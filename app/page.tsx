"use client";

import AdminModal from "@/components/admin/admin-modal";
import ServerCard from "@/components/server-card";
import SortPicker from "@/components/sort-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Server } from "@/types/server";
import SettingsModal from "@/components/settings-modal";
import { DEFAULT_SETTINGS, Settings } from "@/types/settings";

export default function Home() {
  const [servers, setServers] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [shouldReload, setShouldReload] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<Settings>(DEFAULT_SETTINGS);

  function updateSettings(newSettings: Settings, reloadServers: boolean = false) {
    console.log("called blya");
    localStorage.setItem("settings", JSON.stringify(newSettings));
    setCurrentSettings(newSettings);
    if (reloadServers) {
      setShouldReload(!shouldReload);
    }
  }

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings") || JSON.stringify(DEFAULT_SETTINGS);
    setCurrentSettings(JSON.parse(storedSettings));

    if (servers.length > 0) {
      setLoading(true);
      setServers([]);
    }

    fetch("/api/v1/servers")
      .then((res) => res.json())
      .then((data) => {
        setServers(data);
        setLoading(false);
      })
  }, [shouldReload]);

  function reloadData() {
    setShouldReload(!shouldReload);
  }

  function updateSort(newSort: string) {
    updateSettings({ ...currentSettings, currentSort: newSort });
    let sortedServers: Server[] = [...servers];
    switch (newSort) {
      case "online":
      default:
        sortedServers.sort((a, b) => b.onlineCount - a.onlineCount);
        break;
      case "votes":
        sortedServers.sort((a, b) => b.votes - a.votes);
        break;
      case "newest":
        sortedServers.sort((a, b) => b.id - a.id);
        break;
      case "alphabetical":
        sortedServers.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    setServers(sortedServers);
  }

  return (
    <div>
      <nav className="flex items-center w-full h-16">
        <h1 className="ml-7 text-center text-sm md:text-xl lg:text-4xl font-extrabold">osu! server list</h1>
        <div className="max-sm:absolute md:ml-6 max-sm:w-full flex max-sm:justify-center max-sm:ml-9">
          <SortPicker currentSort={currentSettings.currentSort} setCurrentSort={updateSort} />
        </div>

        <div className="flex pr-6 ml-auto">
          <AdminModal reloadData={reloadData} />
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row lg:flex-wrap pl-6 gap-6 w-full min-h-full">
        {isLoading ? (
          <>
            {Array.from({ length: 67 }, (_, i) => (
              <Skeleton key={i} className="w-[calc(100vw-3rem)] lg:w-86 h-[114px] rounded-xl" />
            ))}
          </>
        ) : (
          servers.map(server => {
            return <ServerCard key={server.id} server={server} currentSort={currentSettings.currentSort} usesOslProtocol={currentSettings.usesOslProtocol} />;
          })
        )}
      </div>

      <SettingsModal settings={currentSettings} updateSettings={updateSettings} />
    </div>
  );
}
