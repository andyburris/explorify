import { IconBase } from "phosphor-react-sc";
import { HistoryEntry } from "../data/model/HistoryEntry";
import { Preset } from "../data/model/Preset";

export function PresetPreview({ preset, listens }: { preset: Preset, listens: HistoryEntry[] }) {
    return (
        <div className="flex flex-col rounded-2xl shadow-outset bg-white overflow-hidden cursor-pointer">
            <div className="flex flex-col gap-3 p-4 bg-green-600 text-green-50 h-44 justify-end">
                <div className="flex flex-col">
                    <p className="font-semibold">{preset.name}</p>
                    <p className="text-green-200">{preset.description}</p>
                </div>
            </div>
        </div>
    )
}