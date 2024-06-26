import { ActionButton } from "@/app/common/button/ActionButton";
import { ViewOptions } from "@/app/data/model/ViewOptions";
import { CaretDown, CaretRight } from "phosphor-react-sc";
import { SecondaryInfo, PrimaryInfo } from "./InfoChips";
import { Combination, TrackCombination } from "@/app/data/model/Combination";
import { InfoOperation } from "@/app/data/model/Operations";
import { DisplayOperation } from "../DataTable";

interface CombinationItemProps { combination: Combination, indexInGroup: number, displayOperation: DisplayOperation, isExpanded?: boolean, onToggleExpand: () => void }
export function CombinationItem({ combination, indexInGroup, displayOperation, isExpanded, onToggleExpand }: CombinationItemProps) {
    const firstListen = combination.listens[0]
    return (
        <div className="flex items-center py-2 gap-4 min-h-[64px]">
            { displayOperation.viewOptions.showItemRanks && 
                <div className="flex items-center justify-center w-8 bg-neutral-100 -ml-4 sm:ml-0 h-8 sm:h-8 rounded-e-2xl sm:rounded-md">
                    <p className={"text-neutral-500 text-center font-medium " + ((indexInGroup + 1) < 100 ? "text-sm" : "text-xs")}>{indexInGroup + 1}</p>
                </div>
            }

            { combination instanceof TrackCombination
                ? <div className="flex flex-col flex-grow w-min break-words">
                    <p className="font-semibold break-words [word-break:break-word]">{firstListen.trackName}</p>
                    <p className="text-neutral-500 break-words [word-break:break-word]">{firstListen.artistName}</p>
                </div>
                : <p className="font-semibold flex-grow w-min break-words [word-break:break-word]">{firstListen.artistName}</p>
            }

            
            <div className="flex gap-1 items-center flex-shrink-0">
                <div className="flex flex-col-reverse items-end sm:flex-row gap-1 sm:gap-3 sm:items-center">
                    { displayOperation.infoOperation.secondaryInfo != null && <SecondaryInfo combination={combination} secondaryInfo={displayOperation.infoOperation.secondaryInfo} /> }
                    <PrimaryInfo combination={combination} primaryInfo={displayOperation.infoOperation.primaryInfo} />
                </div>
                { isExpanded !== undefined && <ActionButton onClick={() => onToggleExpand()} icon={isExpanded ? <CaretDown/> : <CaretRight/>} hideShadow/> }
            </div>
        </div>
    )
}