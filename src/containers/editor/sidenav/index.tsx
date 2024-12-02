"use client";


import { Separator } from "@/components/ui/separator";
import { isCN } from "@/lib/env";
import { useStatusStore } from "@/stores/statusStore";
import {
  ArrowDownNarrowWide,
  Braces,
  Download,
  FileUp,
  Share2,
  SquareStack,
  BarChartBig,
  AlignHorizontalJustifyCenter,
  ArrowLeftToLine,
  ArrowRightFromLine,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import Button from "./Button";
import ExportPopover from "./ExportPopover";
import ImportPopover from "./ImportPopover";
import PopoverBtn, { popoverBtnClass } from "./PopoverButton";
import SharePopover from "./SharePopover";
import Toggle from "./Toggle";

export default function SideNav() {
  const t = useTranslations();
  const {
    sideNavExpanded,
    setSideNavExpanded,
    fixSideNav,
    setFixSideNav,
    enableAutoFormat,
    enableAutoSort,
    enableNestParse,
    setParseOptions,
    enableSyncScroll,
    setEnableSyncScroll,
  } = useStatusStore(
    useShallow((state) => ({
      sideNavExpanded: !!state.sideNavExpanded,
      setSideNavExpanded: state.setSideNavExpanded,
      fixSideNav: state.fixSideNav,
      setFixSideNav: state.setFixSideNav,
      enableAutoFormat: !!state.parseOptions.format,
      enableAutoSort: !!state.parseOptions.sort,
      enableNestParse: !!state.parseOptions.nest,
      setParseOptions: state.setParseOptions,
      enableSyncScroll: state.enableSyncScroll,
      setEnableSyncScroll: state.setEnableSyncScroll,
    })),
  );

  return (
    <div
      className="flex flex-col h-full w-8"
      onMouseEnter={(event) => {
        if (fixSideNav || (event.target as HTMLElement).closest(`.${popoverBtnClass}`)) {
          return;
        }
        setSideNavExpanded(true);
      }}
      onMouseLeave={() => setSideNavExpanded(false)}
    >
      <nav
        className="group z-50 h-full py-1.5 w-8 data-[expanded=true]:w-32 box-content border-r border-default shadow-xl transition-width duration-200 hide-scrollbar flex flex-col justify-between bg-background overflow-hidden"
        data-expanded={sideNavExpanded}
      >
        <ul className="relative flex flex-col justify-start px-1 gap-y-1">
          <PopoverBtn title={t("Import")} icon={<FileUp className="icon" />} content={<ImportPopover />} />
          <PopoverBtn title={t("Export")} icon={<Download className="icon" />} content={<ExportPopover />} />
          <PopoverBtn
            className="hidden"
            title={t("Share")}
            icon={<Share2 className="icon" />}
            content={<SharePopover />}
          />
          <Separator className="my-1" />
          <Toggle
            icon={<Braces className="icon" />}
            title={t("Auto Format")}
            description={t("auto_format_desc")}
            isPressed={enableAutoFormat}
            onPressedChange={(pressed) => setParseOptions({ format: pressed })}
          />
          <Toggle
            icon={<SquareStack className="icon" />}
            title={t("Nested Parse")}
            description={t("nested_parse_desc")}
            isPressed={enableNestParse}
            onPressedChange={(pressed) => setParseOptions({ nest: pressed })}
          />
          <Toggle
            icon={<ArrowDownNarrowWide className="icon" />}
            title={t("Auto Sort")}
            description={t("auto_sort_desc")}
            isPressed={enableAutoSort}
            onPressedChange={(pressed) => setParseOptions({ sort: pressed ? "asc" : undefined })}
          />
          <Toggle
            icon={<AlignHorizontalJustifyCenter className="icon" />}
            title={t("sync_reveal")}
            description={t("sync_reveal_desc")}
            isPressed={enableSyncScroll}
            onPressedChange={(pressed) => setEnableSyncScroll(pressed)}
          />
        </ul>
        <ul className="flex flex-col px-1 gap-y-2">
          <Button
            className="my-1.5"
            icon={fixSideNav ? <ArrowRightFromLine className="icon" /> : <ArrowLeftToLine className="icon" />}
            title={t(fixSideNav ? "Expand" : "Collapse")}
            onClick={() => {
              setFixSideNav(!fixSideNav);
              setSideNavExpanded(fixSideNav);
            }}
          />
        </ul>
      </nav>
    </div>
  );
}
