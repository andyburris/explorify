import { ArtistCombination, Combination, TrackCombination } from "@/app/data/model/Group";
import { HistoryEntry } from "@/app/data/model/HistoryEntry";
import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";

export function CombinationItem({ combination, indexInGroup, viewOptions }: { combination: Combination, indexInGroup: number, viewOptions: ViewOptions }) {
    const firstListen = combination.listens[0]
    return (
        <div className="flex items-center py-2 gap-4 min-h-[64px]">
            { viewOptions.showItemRanks && 
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 -ml-1">
                    <p className="text-neutral-500 text-center text-sm font-medium">{indexInGroup + 1}</p>
                </div>
            }

            { combination instanceof TrackCombination
                ? <div className="flex flex-col flex-grow w-min">
                    <p className="font-semibold">{firstListen.trackName}</p>
                    <p className="text-neutral-500">{firstListen.artistName}</p>
                </div>
                : <p className="font-semibold flex-grow w-min">{firstListen.artistName}</p>
            }

            
            <div className="flex gap-3 flex-shrink-0 items-center">
                { viewOptions.secondaryInfo != null && <SecondaryInfo combination={combination} secondaryInfo={viewOptions.secondaryInfo} /> }
                <PrimaryInfo combination={combination} primaryInfo={viewOptions.primaryInfo} />
            </div>
        </div>
    )
}

const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit"
}
function PrimaryInfo({ combination, primaryInfo }: { combination: Combination, primaryInfo: ViewInfoType }) {
    return (
        <div className="px-3 py-1.5 bg-neutral-100 rounded-full items-center">
            { primaryInfo == ViewInfoType.Date
                ? <p>{combination.listens[0].timestamp.toLocaleDateString('en-US', formatOptions)}</p>
                : <p>
                        <span className="font-semibold">{combination.listens.length}</span>
                        <span className="text-neutral-500">{combination.listens.length == 1 ? " play" : " plays"}</span>
                </p>
            }
        </div>
    )
}
function SecondaryInfo({ combination, secondaryInfo }: { combination: Combination, secondaryInfo: ViewInfoType }) {
    return (
        <div className="">
            { secondaryInfo == ViewInfoType.Date
                ? <p className="text-neutral-500">{combination.listens[0].timestamp.toLocaleDateString('en-US', formatOptions)}</p>
                : <p className="text-neutral-500">{combination.listens.length} {combination.listens.length == 1 ? " play" : " plays"}</p>
            }
        </div>
    )
}