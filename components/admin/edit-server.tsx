import { Server } from "@/types/server";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faEdit, faIcons, faLink, faSignature, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";


export default function AdminEditServer(props: { adminKey: string, server: Server, reloadServers: () => void })
{
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const serverNameInput = useRef<HTMLInputElement>(null);
  const serverDescriptionInput = useRef<HTMLTextAreaElement>(null);
  const serverUrlInput = useRef<HTMLInputElement>(null);
  const serverLogoInput = useRef<HTMLInputElement>(null);
  const serverFeatureInput = useRef<HTMLInputElement>(null);
  const [serverFeatures, setServerFeatures] = useState([...props.server.features]);

  function handleOpen(open: boolean) {
    if (!open && isEditing) return;
    // hacky way to reset features on cancel
    if (!open) setServerFeatures([...props.server.features]);
    setIsOpen(open);
  }

  function handleEdit() {
    setIsEditing(true);

    if (!serverNameInput.current || !serverDescriptionInput.current || !serverUrlInput.current || !serverLogoInput.current) {
      toast.error("Please fill in all fields.");
      setIsEditing(false);
      return;
    }

    const serverName = serverNameInput.current.value.trim();
    const serverDescription = serverDescriptionInput.current.value.trim();
    const serverUrl = serverUrlInput.current.value.trim();
    const serverLogo = serverLogoInput.current.value.trim();
    if (serverName === "" || serverDescription === "" || serverUrl === "" || serverLogo === "") {
      toast.error("Please fill in all fields.");
      setIsEditing(false);
      return;
    }

    if (serverFeatureInput.current && serverFeatureInput.current.value.trim() !== "") {
      serverFeatures.push(serverFeatureInput.current.value.trim());
      setServerFeatures([...serverFeatures]);
      serverFeatureInput.current.value = "";
    }

    const updatedServer = { ...props.server, features: serverFeatures, name: serverName, url: serverUrl, logoUrl: serverLogo, description: serverDescription };

    fetch("/api/v1/servers", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": props.adminKey
      },
      body: JSON.stringify(updatedServer)
    }).then(res => {
      setIsEditing(false);
      if (res.status === 200) {
        props.reloadServers();
        toast.success(`${props.server.name} was updated.`);
        handleOpen(false);
      } else {
        toast.error(`Failed to update ${props.server.name}.`);
      }
    });

  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger>
        <Button 
          variant="outline" 
          size="sm"
          className="p-2 hover:cursor-pointer"
        >
          <FontAwesomeIcon width={8} height={8} icon={faEdit} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Server</DialogTitle>
          <DialogDescription>
            Here you can update the server info for <span className="font-bold">{props.server.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[300px]">
          <div className="flex flex-col gap-3 pt-4 pb-6">
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faSignature} />
              <Label htmlFor="server-name" className="font-semibold">Server Name</Label>
            </div>
            <Input ref={serverNameInput} placeholder="Enter Server name..." name="server-name" defaultValue={props.server.name} type="text" />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faEdit} />
              <Label htmlFor="server-description" className="font-semibold">Server Description</Label>
            </div>
            <Textarea ref={serverDescriptionInput} placeholder="Enter Server Description..." name="server-description" defaultValue={props.server.description} />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faLink} />
              <Label htmlFor="server-url" className="font-semibold">Server URL</Label>
            </div>
            <Input ref={serverUrlInput} placeholder="Enter Server URL..." name="server-url" defaultValue={props.server.url} type="text" />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faIcons} />
              <Label htmlFor="server-icon" className="font-semibold">Server Logo URL</Label>
            </div>
            <Input ref={serverLogoInput} placeholder="Enter Server Logo URL..." name="server-icon" defaultValue={props.server.logoUrl} type="text" />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faCheckToSlot} />
              <Label htmlFor="server-features" className="font-semibold">Server Features</Label>
            </div>
            <div className="flex flex-row gap-2 items-center">
              {serverFeatures.map((feature, index) => (
                <Badge key={index} className="mr-1 mt-[3px] text-[10px] bg-green-300 text-gray-800 rounded-full">
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 pb-0.5 pl-1 pr-1 w-1 text-center"
                    onClick={() => {
                      serverFeatures.splice(index, 1);
                      setServerFeatures([...serverFeatures]);
                    }}
                  >
                    &times;
                  </Button>
                </Badge>
              ))}
            </div>
            <Input 
              ref={serverFeatureInput}
              placeholder="Enter Server Feature..."
              name="server-feature"
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = serverFeatureInput.current?.value;
                  if (value) {
                    setServerFeatures([...serverFeatures, value]);
                    serverFeatureInput.current!.value = "";
                  }
                }
              }}
            />
          </div>
        </ScrollArea>
        <div className="flex flex-row gap-2">
          <Button onClick={handleEdit} className="w-[50%] hover:cursor-pointer">Edit Server</Button>
          <Button variant="outline" onClick={() => handleOpen(false)} className="w-[50%] hover:cursor-pointer">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}