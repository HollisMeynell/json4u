"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainPanel from "@/containers/editor/MainPanel";
import SideNav from "@/containers/editor/sidenav";
import { init as dbInit } from "@/lib/db/config";
import { initLogger } from "@/lib/utils";
import { type MyWorker } from "@/lib/worker/worker";
import { useStatusStore } from "@/stores/statusStore";
import { useUserStore } from "@/stores/userStore";
import { wrap } from "comlink";
import { useShallow } from "zustand/react/shallow";

export default function Page() {
  return (
    <TooltipProvider delayDuration={0}>
      <Main />
    </TooltipProvider>
  );
}

function Main() {
  const inited = useInit();

  return inited ? (
    <div className="flex h-full w-full">
      <SideNav />
      <Separator orientation="vertical" />
      <MainPanel />
    </div>
  ) : (
    <Loading />
  );
}

function useInit() {
  const [hydrated, setHydrated] = useState(false);
  const { user, updateActiveOrder } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      updateActiveOrder: state.updateActiveOrder,
    })),
  );

  useEffect(() => {
    initLogger();

    window.rawWorker = new Worker(new URL("@/lib/worker/worker.ts", import.meta.url));
    window.worker = wrap<MyWorker>(window.rawWorker);
    window.addEventListener("beforeunload", () => {
      console.l("worker is terminated.");
      window.rawWorker?.terminate();
    });

    dbInit();
    updateActiveOrder(user);
    Promise.resolve(useStatusStore.persist.rehydrate()).then(() => {
      setHydrated(true);
      console.l("finished worker initial.");
    });
  }, []);

  return hydrated;
}
