import { HistoryEntry } from "../data/model/HistoryEntry";
import { Preset } from "../data/model/Preset";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Group } from "../data/model/Group";
import { applyOperations } from "../data/transform/Operating";
import { PickedIcon } from "../common/PickedIcon";
import { ViewOptions } from "../data/model/ViewOptions";
import { Clock, Play } from "phosphor-react-sc";
import { Combination, TrackCombination, ArtistCombination } from "../data/model/Combination";
import { millisToMinsSecs } from "../view/[id]/item/ListenItem";
import { InfoOperation, InfoType } from "../data/model/Operations";

export function PresetPreview({ preset, listens }: { preset: Preset, listens: HistoryEntry[] }) {
    const [previewItems, setPreviewItems] = useState<Combination[] | Group[] | null>(null)
    useEffect(() => {
        setTimeout(() => { //putting the operations in a settimeout seems to do the trick of rendering the preview before the operations are applied
            const filtered = applyOperations(listens, preset.operations)
            const selected = preset.operations.viewOptions.previewGroups ? filtered : filtered.flatMap(g => g.combinations)
            setPreviewItems(selected.slice(0, 4))
        }, 0)
    }, [])

    return (
        <Link href={`/view/${preset.id}`} className="flex flex-col rounded-2xl shadow-outset dark:shadow-outsetDark bg-white dark:bg-neutral-100 overflow-hidden cursor-pointer">
            <div className="flex flex-col gap-3 p-4 bg-green-600 text-green-50 pt-12 justify-end flex-grow nightwind-prevent nightwind-prevent-block">
                <PickedIcon iconName={preset.icon} size="24px"/>
                <div className="flex flex-col">
                    <p className="font-semibold">{preset.name}</p>
                    <p className="text-green-200">{preset.description}</p>
                </div>
            </div>
            { previewItems == null
                ? (
                    <div className="flex flex-col p-4 gap-3">
                        <div className="w-full h-6 rounded-full bg-neutral-100 dark:bg-neutral-200"></div>
                        <div className="w-full h-6 rounded-full bg-neutral-100 dark:bg-neutral-200"></div>
                        <div className="w-full h-6 rounded-full bg-neutral-100 dark:bg-neutral-200"></div>
                        <div className="h-0">
                            <div className="w-full h-6 rounded-full bg-neutral-100 dark:bg-neutral-200"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col p-4 gap-3">
                        {previewItems.map((c, i) => 
                            <PreviewItem 
                                combinationOrGroup={c} 
                                index={i} 
                                viewOptions={preset.operations.viewOptions}
                                infoOperation={preset.operations.info}
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
function PreviewItem({ combinationOrGroup, index, viewOptions, infoOperation }: { combinationOrGroup: Combination | Group, index: number, viewOptions: ViewOptions, infoOperation: InfoOperation }) {
    return (
        <div className="flex gap-2 w-full last:opacity-25 last:h-0">
            { ((combinationOrGroup instanceof Group && viewOptions.showGroupRanks) || (!(combinationOrGroup instanceof Group) && viewOptions.showItemRanks)) &&
                <p className=" tabular-nums text-green-700">{index + 1}.</p>
            }
            <p className="text-green-900 font-medium flex-grow overflow-hidden truncate h-fit">
                { combinationOrGroup instanceof Group 
                    ? combinationOrGroup.headerStrings(true).primary
                    : (combinationOrGroup instanceof TrackCombination) ? combinationOrGroup.trackName : (combinationOrGroup as ArtistCombination).artistName
                }
            </p>
            {
                infoOperation.primaryInfo == InfoType.Plays
                    ? <div className="flex items-center text-green-700 gap-0.5 h-fit"><p>{combinationOrGroup.visiblePlays} </p><Play weight="bold" size="16px"/></div>
                : infoOperation.primaryInfo == InfoType.Playtime
                    ? <div className="flex items-center text-green-700 gap-0.5 h-fit"><p>{millisToMinsSecs(combinationOrGroup.visiblePlaytime, true)} </p><Clock weight="bold" size="16px"/></div>
                : infoOperation.primaryInfo == InfoType.Percent
                    ? <div className="flex items-center text-green-700 gap-0.5 h-fit"><p>{(combinationOrGroup.percent * 100).toFixed(2)}%</p></div>
                : combinationOrGroup instanceof Group
                        ? <></>
                        : <p className="text-green-700">{combinationOrGroup.listens[0].timestamp.toLocaleDateString('en-US', formatOptions)}</p>
            }
        </div>
    )
}