import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminLogin from "@/components/admin/admin-login";
import AdminServerList from "./server-list";


export default function AdminModal(props: { reloadData: () => void }) {
  // We pass this into other components so it Doesnt die
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = (key: string): boolean => {
    fetch("/api/v1/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key
      }
    }).then(res => {
      if (res.status === 200) {
        setIsAuthenticated(true);
        setAdminKey(key);
        return true;
      }
    });

    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" className="hover:cursor-pointer">
          <FontAwesomeIcon width={26} height={18} icon={faUserSecret} />
        </Button>
      </DialogTrigger>
      {isAuthenticated ? <AdminServerList adminKey={adminKey} reloadServers={props.reloadData} /> : <AdminLogin handleLogin={handleLogin} />}
    </Dialog>
  );
}