import ServerCard from "@/components/server-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faCheckToSlot, faEdit, faKeyboard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isMobile } from "react-device-detect";
import { Server } from "@/types/server";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ServerAdminModal } from "./server-admin-modal";

// move to diff file
function VoteModal(props: { server: Server, usesOslProtocol: boolean, updateServer: (server: Server) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const userIdInput = useRef<HTMLInputElement>(null);

  function handleVote() {
    const userId = parseInt(userIdInput.current?.value || "");
    if (isNaN(userId)) return;

    fetch(`/api/v1/servers/${props.server.id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: userId })
    }).then(async (res) => {
      if (res.status === 200) {
        toast.success("Vote submitted successfully!");
        setIsOpen(false);
        const updatedServer = await res.json();
        props.updateServer(updatedServer);
      } else {
        if (res.status === 429) {
          toast.warning("You can only vote once every 24 hours.");
        } else {
          toast.error("Failed to submit vote.");
        }
      }
    });
  }

  function handleOpen(open: boolean) {
    if (!open && userIdInput.current?.value) {
      userIdInput.current.value = "";
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className={`${props.usesOslProtocol && !isMobile ? "w-1/3" : "w-1/2"} hover:cursor-pointer`}
        >
          Vote
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vote for {props.server.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4 pb-6">
          <div className="flex flex-row gap-2 items-center">
            <FontAwesomeIcon icon={faUser} />
            <Label htmlFor="user-id" className="text-sm">User ID</Label>
          </div>
          <Input name="user-id" type="number" placeholder="eg. 123" className="mb-4" ref={userIdInput} />
        </div>
        <div className="flex flex-row gap-2 w-full">
          <Button onClick={handleVote} className="w-1/2 hover:cursor-pointer">Submit Vote</Button>
          <Button onClick={() => handleOpen(false)} variant="secondary" className="w-1/2 hover:cursor-pointer">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default function ServerCardModal(props: { server: Server, currentSort: string, usesOslProtocol: boolean, updateServer: (server: Server) => void }) {
  return (
    <Dialog>
      {/* no asChild because it doesn't work */}
      <DialogTrigger className="hover:cursor-pointer">
        <ServerCard key={props.server.id} server={props.server} currentSort={props.currentSort} usesOslProtocol={props.usesOslProtocol} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Server Info
            {props.server.hasAdminKeys && (
              <ServerAdminModal server={props.server} updateServer={props.updateServer} />
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[150px] lg:h-[200px] w-full">
          <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2">
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
            className={`${props.usesOslProtocol && !isMobile ? "w-1/3" : "w-1/2"} hover:cursor-pointer`}
            >
              Visit Website
          </Button>
          <VoteModal server={props.server} usesOslProtocol={props.usesOslProtocol} updateServer={props.updateServer} />
          {props.usesOslProtocol && !isMobile && (
            <Button 
              variant="outline"
              onClick={() => window.open(`osl://launch/${props.server.url}`)}
              className="w-1/3 hover:cursor-pointer"
            >Launch with OSL</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}