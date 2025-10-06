import ServerCard from "@/components/server-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faCheckToSlot, faKeyboard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "./ui/button";
import { isMobile } from "react-device-detect";
import { Server } from "@/app/generated/prisma";

export default function ServerCardModal(props: { server: Server, currentSort: string, usesOslProtocol: boolean }) {
  return (
    <Dialog>
      {/* no asChild because it doesn't work */}
      <DialogTrigger className="hover:cursor-pointer">
        <ServerCard key={props.server.id} server={props.server} currentSort={props.currentSort} usesOslProtocol={props.usesOslProtocol} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Server Info</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[150px] lg:h-[200px] w-full">
          <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src={props.server.logoUrl}
                  alt={`${props.server.name} logo`}
                  width={64}
                  height={64}
                  className="rounded max-w-16 max-h-16 object-contain"
                />
                <div className="flex flex-col flex-wrap">
                  <h2 className="text-xl font-bold">{props.server.name}</h2>
                  <span className="text-sm text-gray-500">
                    {props.server.description}
                  </span>
                </div>
              </div>
              {/* <Textarea 
                readOnly              
                name="server-description" 
                defaultValue={props.server.description}
                className="hover:cursor-default"
              /> */}
              <div className="flex flex-row gap-12 items-center pt-2">
                <div className="flex flex-row gap-2">
                  <FontAwesomeIcon width={16} height={16} icon={faCheckToSlot} />
                  <Label className="font-semibold">Votes</Label>
                </div>
                <div className="flex flex-row gap-2">
                  <FontAwesomeIcon width={16} height={16} icon={faUser} />
                  <Label className="font-semibold">Online Users</Label>
                </div>
              </div>
              <div className="flex flex-row gap-24 items-center">
                <div className="flex flex-row gap-2">
                  <span className="font-bold">{props.server.votes}</span>
                  <Button variant="ghost" className="px-2 h-6 hover:cursor-pointer">Vote!</Button>
                </div>
                <div className="flex flex-row gap-2">
                  <span className="font-bold">-1</span>
                </div>
              </div>
          </div>
        </ScrollArea>
        <div className="flex flex-row gap-1 w-full">
          <Button 
            onClick={() => window.open(`https://${props.server.url}`, "_blank")} 
            variant="outline" 
            className={`${props.usesOslProtocol && !isMobile ? "w-1/2" : "w-full"}`}
            >
              Visit Website
          </Button>
          {props.usesOslProtocol && !isMobile && (
            <Button 
              variant="outline"
              onClick={() => window.open(`osl://launch/${props.server.url}`)}
              className="w-1/2"
            >Launch with OSL</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}