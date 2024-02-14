import { Group } from "@/app/data/model/Group";
import { ViewOptions } from "@/app/data/model/ViewOptions";
import { Clock, Play } from "phosphor-react-sc";
import { millisToMinsSecs } from "./ListenItem";
import { InfoOperation, InfoType } from "@/app/data/model/Operations";
import { InfoContent, SecondaryInfo } from "./InfoChips";
import { DisplayOperation } from "../DataTable";

export function GroupHeader({ group, displayOperation }: { group: Group, displayOperation: DisplayOperation }) {
    const { primary, secondary } = group.headerStrings()
    return (
        <div className="flex justify-between items-center pb-2 pt-12 gap-3">
            <div className={"flex items-center w-full " + (displayOperation.viewOptions.showGroupRanks ? "gap-4" : "gap-3")}>
                { displayOperation.viewOptions.showGroupRanks
                    ? <div className={"flex items-center justify-center w-8 flex-shrink-0 bg-green-600 nightwind-prevent text-white font-semibold -ml-4 sm:-ml-12 h-8 sm:h-8 rounded-e-2xl sm:rounded-md " + ((group.rank + 1) < 100 ? "text-sm" : "text-xs")}>
                        {group.rank + 1}
                    </div>
                    : <div className="h-6 w-1 -ml-4 rounded-full bg-green-600 nightwind-prevent"></div>
                }
                
                <div className="flex flex-col w-full flex-shrink">
                    <p className="font-serif tracking-tight text-4xl font-bold break-words">{primary}</p>
                    <p className="text-neutral-500 break-words">{secondary}</p>
                </div>
            </div>
            { displayOperation.viewOptions.showGroupSum &&
                <div className="flex flex-col-reverse flex-shrink-0 items-end sm:flex-row gap-1 sm:gap-3 sm:items-center text-neutral-500">
                    { (displayOperation.infoOperation.secondaryInfo != null && displayOperation.infoOperation.primaryInfo != InfoType.Date && displayOperation.infoOperation.secondaryInfo != InfoType.Date) && 
                        <InfoContent 
                            combinationOrGroup={group} 
                            infoType={displayOperation.infoOperation.secondaryInfo} />
                    }
                    <div className="px-3 py-1.5 border border-neutral-200 rounded-full items-center flex-shrink-0">
                        <InfoContent 
                            combinationOrGroup={group} 
                            infoType={displayOperation.infoOperation.primaryInfo == InfoType.Date ? (displayOperation.infoOperation.secondaryInfo ?? InfoType.Plays) : displayOperation.infoOperation.primaryInfo} />                    
                    </div>
                </div>
                
            }
        </div>
    )
}