"use client";

import { useEffect } from "react";
import ModePanel from "@/components/mode/ModePanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import LeftPanel, { leftPanelId } from "@/containers/LeftPanel";
import RightPanel, { rightPanelId } from "@/containers/RightPanel";
import StatusBar from "@/containers/StatusBar";
import { cn } from "@/lib/utils";
import { useStatusStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";

export default function MainPanel() {
  const { rightPanelSize, rightPanelCollapsed, setRightPanelSize, setRightPanelCollapsed } = useStatusStore(
    useShallow((state) => ({
      rightPanelSize: state.rightPanelSize,
      rightPanelCollapsed: state.rightPanelCollapsed,
      setRightPanelSize: state.setRightPanelSize,
      setRightPanelCollapsed: state.setRightPanelCollapsed,
    })),
  );

  useObserveResize();

  // TODO: fix the performance problem with resize when there are a large number of nodes in the table view
  // see https://github.com/bvaughn/react-resizable-panels/issues/128#issuecomment-1523343548
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <ResizablePanelGroup
        className="flex-grow"
        direction="horizontal"
        onLayout={(layout) => setRightPanelSize(layout[1])}
      >
        <ResizablePanel id={leftPanelId} collapsible defaultSize={100 - rightPanelSize} minSize={0}>
          <LeftPanel />
        </ResizablePanel>
        <ResizableHandle withHandle className={cn("hover:bg-blue-600", rightPanelCollapsed && "w-3")} />
        <ResizablePanel
          id={rightPanelId}
          defaultSize={rightPanelSize}
          minSize={10}
          collapsible={true}
          onCollapse={() => setRightPanelCollapsed(true)}
          onExpand={() => setRightPanelCollapsed(false)}
          className={cn(rightPanelCollapsed && "transition-all duration-300 ease-in-out")}
        >
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      <ModePanel />
      <Separator />
      <StatusBar />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

function useObserveResize() {
  const { setLeftPanelWidth, setRightPanelWidth } = useStatusStore(
    useShallow((state) => ({
      setLeftPanelWidth: state.setLeftPanelWidth,
      setRightPanelWidth: state.setRightPanelWidth,
    })),
  );

  useEffect(() => {
    const leftPanel = document.getElementById(leftPanelId)!;
    const rightPanel = document.getElementById(rightPanelId)!;
    setLeftPanelWidth(leftPanel.offsetWidth);
    setRightPanelWidth(rightPanel.offsetWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.id === leftPanelId) {
          setLeftPanelWidth(entry.contentRect.width);
        } else {
          setRightPanelWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(leftPanel);
    resizeObserver.observe(rightPanel);

    return () => {
      resizeObserver.unobserve(leftPanel);
      resizeObserver.unobserve(rightPanel);
    };
  }, []);
}
