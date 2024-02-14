import { Group } from "@/app/data/model/Group";
import { ViewOptions } from "@/app/data/model/ViewOptions";
import { Clock, Play } from "phosphor-react-sc";
import { millisToMinsSecs } from "./ListenItem";
import { InfoOperation, InfoType } from "@/app/data/model/Operations";
import { InfoContent, SecondaryInfo } from "./InfoChips";

export function GroupHeader({ group, viewOptions, infoOperation }: { group: Group, viewOptions: ViewOptions, infoOperation: InfoOperation }) {
    const { primary, secondary } = group.headerStrings()
    return (
        <div className="flex justify-between items-center pb-2 pt-12 gap-3">
            <div className={"flex items-center w-full " + (viewOptions.showGroupRanks ? "gap-4" : "gap-3")}>
                { viewOptions.showGroupRanks
                    ? <div className="flex items-center justify-center h-10 w-10 rounded-lg flex-shrink-0 bg-green-600 nightwind-prevent text-white text-sm font-semibold">
                        {group.rank + 1}
                    </div>
                    : <div className="h-6 w-1 -ml-4 rounded-full bg-green-600 nightwind-prevent"></div>
                }
                
                <div className="flex flex-col w-full flex-shrink">
                    <p className="font-serif tracking-tight text-4xl font-bold break-words">{primary}</p>
                    <p className="text-neutral-500 break-words">{secondary}</p>
                </div>
            </div>
            { viewOptions.showGroupSum &&
                <div className="flex flex-col-reverse flex-shrink-0 items-end sm:flex-row gap-1 sm:gap-3 sm:items-center text-neutral-500">
                    { (infoOperation.secondaryInfo != null && infoOperation.primaryInfo != InfoType.Date && infoOperation.secondaryInfo != InfoType.Date) && 
                        <InfoContent combinationOrGroup={group} infoType={infoOperation.secondaryInfo} />
                    }
                    <div className="px-3 py-1.5 border border-neutral-200 rounded-full items-center flex-shrink-0">
                        <InfoContent combinationOrGroup={group} infoType={infoOperation.primaryInfo == InfoType.Date ? (infoOperation.secondaryInfo ?? InfoType.Plays) : infoOperation.primaryInfo} />                    
                    </div>
                </div>
                
            }
        </div>
    )
}