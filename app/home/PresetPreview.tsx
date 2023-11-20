import { HistoryEntry } from "../data/model/HistoryEntry";
import { Preset } from "../data/model/Preset";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArtistCombination, Combination, Group, TrackCombination } from "../data/model/Group";
import { applyOperations } from "../data/Operating";
import { PickedIcon } from "../common/PickedIcon";
import { ViewInfoType, ViewOptions } from "../data/model/ViewOptions";
import { Play } from "phosphor-react-sc";

export function PresetPreview({ preset, listens }: { preset: Preset, listens: HistoryEntry[] }) {
    const [previewItems, setPreviewItems] = useState<Combination[] | Group[] | null>(null)
    useEffect(() => {
        const filtered = applyOperations(listens, preset.operations)
        const selected = preset.operations.viewOptions.previewGroups ? filtered : filtered.flatMap(g => g.combinations)
        setPreviewItems(selected.slice(0, 4))
    }, [])

    return (
        <Link href={`/view/${preset.id}`} className="flex flex-col rounded-2xl shadow-outset bg-white overflow-hidden cursor-pointer">
            <div className="flex flex-col gap-3 p-4 bg-green-600 text-green-50 pt-12 justify-end flex-grow">
                <PickedIcon iconName={preset.icon} size="24px"/>
                <div className="flex flex-col">
                    <p className="font-semibold">{preset.name}</p>
                    <p className="text-green-200">{preset.description}</p>
                </div>
            </div>
            { previewItems == null
                ? (
                    <div className="flex flex-col p-4 gap-3">
                        <div className="w-full h-3 rounded-full bg-neutral-100"></div>
                        <div className="w-full h-3 rounded-full bg-neutral-100"></div>
                        <div className="w-full h-3 rounded-full bg-neutral-100"></div>
                        <div className="w-full h-3 rounded-full bg-neutral-100"></div>
                    </div>
                ) : (
                    <div className="flex flex-col p-4 gap-3">
                        {previewItems.map((c, i) => 
                            <PreviewItem 
                                combinationOrGroup={c} 
                                index={i} 
                                viewOptions={preset.operations.viewOptions}
                                key={i}
                            />)}
                    </div>
                )}
        </Link>
    )
}

const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
}
function PreviewItem({ combinationOrGroup, index, viewOptions }: { combinationOrGroup: Combination | Group, index: number, viewOptions: ViewOptions }) {
    return (
        <div className="flex gap-2 w-full last:opacity-25 last:h-0">
            { viewOptions.showItemRanks &&
                <p className=" tabular-nums text-green-700">{index + 1}.</p>
            }
            <p className="text-green-900 flex-grow overflow-hidden truncate h-fit">
                { combinationOrGroup instanceof Group 
                    ? combinationOrGroup.date.toLocaleDateString('en-us', formatOptions)
                    : (combinationOrGroup instanceof TrackCombination) ? combinationOrGroup.trackName : (combinationOrGroup as ArtistCombination).artistName
                }
            </p>
            { combinationOrGroup instanceof Group
                ? <div className="flex items-center text-green-700 gap-0.5 h-fit"><p>{combinationOrGroup.totalPlays} </p><Play weight="bold" size="16px"/></div>
                : viewOptions.primaryInfo == ViewInfoType.Plays
                    ? <div className="flex items-center text-green-700 gap-0.5 h-fit"><p>{combinationOrGroup.listens.length} </p><Play weight="bold" size="16px"/></div>
                    : <p className="text-green-700">{combinationOrGroup.listens[0].timestamp.toLocaleDateString('en-US', formatOptions)}</p>
            }
        </div>
    )
}