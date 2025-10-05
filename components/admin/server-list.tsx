import { useEffect, useState } from "react";
import { 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AdminServerCard from "@/components/admin/server-card";
import { ScrollArea } from "../ui/scroll-area";
import AdminAddServer from "./add-server";
import { Server } from "@/types/server";

export default function AdminServerList(props: { adminKey: string, reloadServers: () => void }) {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [shouldReload, setShouldReload] = useState(false);

  function reloadServers() {
    setShouldReload(!shouldReload);
    props.reloadServers();
  }

  useEffect(() => {
    fetch("/api/v1/servers")
      .then((res) => res.json())
      .then((data) => {
        setServers(data);
        setLoading(false);
      })
  }, [shouldReload]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Admin: Servers</DialogTitle>
        <DialogDescription>
          Add, modify, or delete servers from the list.
        </DialogDescription>
      </DialogHeader>
      <AdminAddServer adminKey={props.adminKey} reloadServers={reloadServers} />
      <ScrollArea className="w-full h-[400px]">
        <div className="flex flex-col flex-wrap gap-6 items-center justify-center">
          {isLoading ? (
            <>
              {Array.from({ length: 10 }, (_, i) => (
                <Skeleton key={i} className="w-[calc(92vw-3rem)] lg:w-86 h-[114px] rounded-xl" />
              ))}
            </>
          ) : (
            servers.map(server => {
              return <AdminServerCard key={server.id} server={server} adminKey={props.adminKey} reloadServers={reloadServers} />;
            })
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
}