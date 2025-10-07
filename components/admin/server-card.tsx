import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import AdminDeleteServer from "@/components/admin/delete-server";
import AdminEditServer from "@/components/admin/edit-server";
import { Server } from "@/types/server";

export default function AdminServerCard(props: { server: Server, adminKey: string, reloadServers: () => void }) {
  return (
    <Card className="w-[calc(92vw-3rem)] lg:w-86 relative overflow-hidden min-h-32">
      <div className="absolute flex flex-row top-0 right-0 m-3 gap-1">
        <AdminEditServer adminKey={props.adminKey} server={props.server} reloadServers={props.reloadServers} />
        <AdminDeleteServer adminKey={props.adminKey} server={props.server} reloadServers={props.reloadServers} />
      </div>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image
              src={props.server.logoUrl}
              alt={`${props.server.name} logo`}
              width={64}
              height={64}
              className="rounded max-w-16 max-h-16 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
              {props.server.name}
              {/* <div className="rounded-full ml-2 inline-block w-2 h-2 pb-[1px] bg-green-400"></div>
              <div className="text-gray-600 inline-block ml-2 text-xs pb-[1px]">{props.server.onlineCount} Online</div> */}
            </CardTitle>
            <CardDescription className="flex flex-row flex-wrap">
              {props.server.features?.split(",").map((feature, idx) => {
                if (idx > 2) return null;
                return (
                  <Badge key={props.server.id + feature} className="mr-1 mt-[3px] text-[10px] bg-green-300 text-gray-800 rounded-full">
                    {feature}
                  </Badge>
                );
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}