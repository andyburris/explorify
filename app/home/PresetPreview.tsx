import { HistoryEntry } from "../data/model/HistoryEntry";
import { Preset } from "../data/model/Preset";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArtistCombination, Combination, Group, TrackCombination } from "../data/model/Group";
import { applyFilters } from "../data/Filtering";
import { PickedIcon } from "../common/PickedIcon";

export function PresetPreview({ preset, listens }: { preset: Preset, listens: HistoryEntry[] }) {
    const [previewItems, setPreviewItems] = useState<Combination[] | null>(null)
    useEffect(() => {
        const filtered = applyFilters(listens, preset.filters).flatMap(g => g.combinations)
        setPreviewItems(filtered.slice(0, 4))
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
                        {previewItems.map((c, i) => <PreviewItem combination={c} index={i} key={i}/>)}
                    </div>
                )}
        </Link>
    )
}

function PreviewItem({ combination, index }: { combination: Combination, index: number }) {
    return (
        <div className="flex gap-2 w-full last:opacity-25 last:h-0">
            <p className="w-3 text-right text-green-700">{index + 1}.</p>
            <p className="text-green-900 flex-grow overflow-hidden truncate h-fit">{(combination instanceof TrackCombination) ? combination.trackName : (combination as ArtistCombination).artistName}</p>
            <p className="text-green-700">{combination.listens.length}</p>
        </div>
    )
}