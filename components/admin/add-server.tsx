import { Server } from "@/types/server";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faEdit, faIcons, faLink, faSignature } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";


export default function AdminAddServer(props: { adminKey: string, reloadServers: () => void })
{
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const serverNameInput = useRef<HTMLInputElement>(null);
  const serverDescriptionInput = useRef<HTMLTextAreaElement>(null);
  const serverUrlInput = useRef<HTMLInputElement>(null);
  const serverLogoInput = useRef<HTMLInputElement>(null);
  const serverFeatureInput = useRef<HTMLInputElement>(null);
  const [serverFeatures, setServerFeatures] = useState<string[]>([]);

  function handleOpen(open: boolean) {
    if (!open && isCreating) return;
    // hacky way to reset features on cancel
    if (!open) setServerFeatures([]);
    setIsOpen(open);
  }

  function handleEdit() {
    setIsCreating(true);

    if (!serverNameInput.current || !serverDescriptionInput.current || !serverUrlInput.current || !serverLogoInput.current) {
      toast.error("Please fill in all fields.");
      setIsCreating(false);
      return;
    }

    const serverName = serverNameInput.current.value.trim();
    const serverDescription = serverDescriptionInput.current.value.trim();
    const serverUrl = serverUrlInput.current.value.trim();
    const serverLogo = serverLogoInput.current.value.trim();
    if (serverName === "" || serverDescription === "" || serverUrl === "" || serverLogo === "") {
      toast.error("Please fill in all fields.");
      setIsCreating(false);
      return;
    }

    if (serverFeatureInput.current && serverFeatureInput.current.value.trim() !== "") {
      serverFeatures.push(serverFeatureInput.current.value.trim());
      setServerFeatures([...serverFeatures]);
      serverFeatureInput.current.value = "";
    }

    const server: Server = {
      id: 67,
      name: serverName,
      description: serverDescription,
      url: serverUrl,
      logoUrl: serverLogo,
      features: serverFeatures,
      onlineCount: 0,
      votes: 0,
    }

    fetch("/api/v1/servers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": props.adminKey
      },
      body: JSON.stringify(server)
    }).then(res => {
      setIsCreating(false);
      if (res.status === 201) {
        props.reloadServers();
        toast.success(`${server.name} was created.`);
        handleOpen(false);
      } else {
        toast.error(`Failed to create ${server.name}.`);
      }
    });

  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger>
        <Button className="mt-2 mb-4 hover:cursor-pointer w-[calc(92vw-3rem)] lg:w-full">Add Server</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Server</DialogTitle>
          <DialogDescription>
            Here you can add a new server.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[300px]">
          <div className="flex flex-col gap-3 pt-4 pb-6">
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faSignature} />
              <Label htmlFor="server-name" className="font-semibold">Server Name</Label>
            </div>
            <Input ref={serverNameInput} placeholder="Enter Server name..." name="server-name" type="text" />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faEdit} />
              <Label htmlFor="server-description" className="font-semibold">Server Description</Label>
            </div>
            <Textarea ref={serverDescriptionInput} placeholder="Enter Server Description..." name="server-description" />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faLink} />
              <Label htmlFor="server-url" className="font-semibold">Server URL</Label>
            </div>
            <Input ref={serverUrlInput} placeholder="Enter Server URL..." name="server-url" type="text" />
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon width={16} height={16} icon={faIcons} />
              <Label htmlFor="server-icon" className="font-semibold">Server Logo URL</Label>
            </div>
            <Input ref={serverLogoInput} placeholder="Enter Server Logo URL..." name="server-icon" type="text" />
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
          <Button onClick={handleEdit} className="w-[50%] hover:cursor-pointer" disabled={isCreating || !isOpen}>Add Server</Button>
          <Button variant="outline" onClick={() => handleOpen(false)} className="w-[50%] hover:cursor-pointer" disabled={isCreating || !isOpen}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}