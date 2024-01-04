import { ActionButton } from "@/app/common/button/ActionButton";
import { HistoryEntry } from "@/app/data/model/HistoryEntry";
import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";
import { CaretDown, CaretRight, DotsThreeVertical } from "phosphor-react-sc";
import { SecondaryInfo, PrimaryInfo } from "./InfoChips";
import { useState } from "react";
import { ListenItem } from "./ListenItem";
import { Combination, TrackCombination } from "@/app/data/model/Combination";

interface CombinationItemProps { combination: Combination, indexInGroup: number, viewOptions: ViewOptions, isExpanded: boolean, onToggleExpand: () => void }
export function CombinationItem({ combination, indexInGroup, viewOptions, isExpanded, onToggleExpand }: CombinationItemProps) {
    const firstListen = combination.listens[0]
    return (
        <div className="flex items-center py-2 gap-4 min-h-[64px]">
            { viewOptions.showItemRanks && 
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-neutral-100">
                    <p className="text-neutral-500 text-center text-sm font-medium">{indexInGroup + 1}</p>
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
                    { viewOptions.secondaryInfo != null && <SecondaryInfo combination={combination} secondaryInfo={viewOptions.secondaryInfo} /> }
                    <PrimaryInfo combination={combination} primaryInfo={viewOptions.primaryInfo} />
                </div>
                <ActionButton onClick={() => onToggleExpand()} icon={isExpanded ? <CaretDown/> : <CaretRight/>} hideShadow/>
            </div>
        </div>
    )
}