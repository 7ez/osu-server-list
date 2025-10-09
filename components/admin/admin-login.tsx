import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Input } from "@/components/ui/input";


export default function AdminLogin(props: { handleLogin: (key: string) => boolean }) {
  const adminKeyInput = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    if (adminKeyInput.current) {
      const success = props.handleLogin(adminKeyInput.current.value);
      if (!success) {
        adminKeyInput.current.classList.add("border-red-500");
      }
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Admin Login</DialogTitle>
        <DialogDescription>
          Please enter the admin key to access admin features.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-2">
        <div className="grid gap-2">
          <Input ref={adminKeyInput} name="adminKey" placeholder="Enter admin key" type="password" />
        </div>
        <Button type="submit" className="w-full hover:cursor-pointer">Login</Button>
      </form>
    </DialogContent>
  );
}
