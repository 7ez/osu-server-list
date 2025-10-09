import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings } from "@/types/settings";

export default function SettingsModal(props: { settings: Settings, updateSettings: (newSettings: Settings, reloadServers?: boolean) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:cursor-pointer absolute right-3 bottom-3">
          <FontAwesomeIcon width={26} height={18} icon={faGear} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Settings are here, probably.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          {/* the tooltip automatically opens when you open settings. why. */}
          <Tooltip>
            <TooltipTrigger>
              <Checkbox
                checked={props.settings.usesOslProtocol}
                onCheckedChange={(checked) => props.updateSettings({ ...props.settings, usesOslProtocol: checked.valueOf() as boolean })} 
                id="osl-protocol"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggles whether the <a className="text-blue-500" href="https://github.com/7ez/osl-bridge">OSL Protocol</a> can be used.</p>
            </TooltipContent>
          </Tooltip>
          <Label htmlFor="osl-protocol">Use OSL Protocol</Label>
        </div>
      </DialogContent>
    </Dialog>
  );
}