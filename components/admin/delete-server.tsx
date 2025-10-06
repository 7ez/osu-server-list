import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Server } from "@/app/generated/prisma";


export default function AdminDeleteServer(props: { adminKey: string, server: Server, reloadServers: () => void })
{
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleOpen(open: boolean) {
    if (!open && isDeleting) return;
    setIsOpen(open);
  }

  function handleDelete() {
    setIsDeleting(true);
    fetch(`/api/v1/servers/${props.server.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": props.adminKey
      },
      body: JSON.stringify({ id: props.server.id })
    }).then(res => {
      if (res.status === 200) {
        props.reloadServers();
        toast.success(`${props.server.name} was deleted.`);
        setIsOpen(false);
      } else {
        toast.error(`Failed to delete ${props.server.name}.`);
      }
    });
    setIsDeleting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="p-2 hover:cursor-pointer"
        >
          <FontAwesomeIcon width={8} height={8} icon={faXmark} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Server</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the server <span className="font-bold">{props.server.name}</span>?
            <p>This action cannot be undone.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting} className="w-[50%] hover:cursor-pointer">Cancel</Button>
          {/* !isOpen to not delete server by accident when the modal is closed */}
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || !isOpen} className="w-[50%] hover:cursor-pointer">
            {isDeleting && <Spinner />}
            Delete Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}