import { Group } from "@/app/data/model/Group";
import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";
import { Clock, Play } from "phosphor-react-sc";
import { millisToMinsSecs } from "./ListenItem";

export function GroupHeader({ group, viewOptions }: { group: Group, viewOptions: ViewOptions }) {
    const { primary, secondary } = group.headerStrings()
    return (
        <div className="flex justify-between items-center pb-2 pt-12">
            <div className="flex items-center -ml-4 gap-3 w-full">
                <div className="h-6 w-1 rounded-full bg-green-600 nightwind-prevent"></div>
                <div className="flex flex-col w-full flex-shrink">
                    <p className="font-serif tracking-tight text-4xl font-bold break-words">{primary}</p>
                    <p className="text-neutral-500 break-words">{secondary}</p>
                </div>
            </div>
            { viewOptions.showGroupSum &&
                <div className="px-3 py-1.5 border border-neutral-200 rounded-full items-center text-neutral-500 flex-shrink-0">
                    { viewOptions.primaryInfo == ViewInfoType.Playtime
                        ? <div className="flex gap-0.5 items-center">
                            <p className="font-semibold hidden sm:block">{millisToMinsSecs(group.playtime)}</p>
                            <p className="font-semibold sm:hidden">{millisToMinsSecs(group.playtime, true)}</p>
                            <Clock className="" size="16px" weight="bold"/>
                        </div>
                    : (viewOptions.primaryInfo == ViewInfoType.Date || viewOptions.primaryInfo == ViewInfoType.Plays)
                        ? <div className="flex gap-0.5 items-center">
                            <p>
                                <span className="font-medium">{group.plays}</span>
                                <span className="text-neutral-500 max-sm:hidden">{group.plays == 1 ? " play" : " plays"}</span>
                            </p>
                            <Play className="sm:hidden" size="16px" weight="bold"/>
                        </div>
                        : <p>{(group.percent(viewOptions.primaryInfo) * 100).toFixed(2)}%</p>
                    }
                    
                </div>
            }
        </div>
    )
}