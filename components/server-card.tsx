import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { isMobile } from "react-device-detect";
import { Server } from "@/types/server";

export default function ServerCard(props: { server: Server, currentSort: string, usesOslProtocol: boolean }) {
  return (
    <Card className="w-[calc(100vw-3rem)] lg:w-86 relative overflow-hidden min-h-32">
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
          <div className="min-w-0">
            <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap mr-2">
              {props.server.name}
              {/* {props.server.onlineCount > 0 && (props.currentSort === "online" || props.currentSort === "") && (
                <> /* i'd use a div but it breaks the css so no thank you *\/
                  <div className="rounded-full ml-2 inline-block w-2 h-2 pb-[1px] bg-green-400"></div>
                  <div className="text-gray-600 inline-block ml-2 text-xs pb-[1px]">{props.server.onlineCount} Online</div>
                </>
              )} */}
              {props.currentSort === "votes" && (
                <>
                  <div className="rounded-full ml-2 inline-block w-2 h-2 pb-[1px] bg-green-400"></div>
                  <div className="text-gray-600 inline-block ml-2 text-xs pb-[1px]">{props.server.votes} Votes</div>
                </>
              )}
            </CardTitle>
            <CardDescription className="flex flex-row flex-wrap">
              {props.server.features?.split(",").map((feature, idx) => {
                // max 3, otherwise css boom
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
      {props.usesOslProtocol && !isMobile && ( 
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(`osl://launch/${props.server.url}`)}
          className="absolute bottom-3 right-14 p-2 hover:cursor-pointer"
        >
          <FontAwesomeIcon width={16} height={16} icon={faPlay} />
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.open(`https://${props.server.url}`, '_blank')}
        className="absolute bottom-3 right-3 p-2 hover:cursor-pointer"
      >
        <FontAwesomeIcon width={16} height={16} icon={faRightToBracket} />
      </Button>
    </Card>
  );
}