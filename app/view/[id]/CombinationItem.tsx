import { ArtistCombination, TrackCombination } from "@/app/data/model/Group";
import { HistoryEntry } from "@/app/data/model/HistoryEntry";

export function TrackCombinationItem({ trackCombination }: { trackCombination: TrackCombination }) {
    const firstListen = trackCombination.listens[0]
    return (
        <div className="flex justify-between items-center py-2 gap-4">
            <div className="flex flex-col">
                <p className="font-semibold">{firstListen.trackName}</p>
                <p className="text-neutral-500">{firstListen.artistName}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0 items-center">
                <p className="text-neutral-500">
                    {firstListen.timestamp.toLocaleDateString('en-US', {
                        day: "numeric",
                        month: "numeric",
                        year: "2-digit",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </p>
                <div className="px-3 py-1.5 bg-neutral-100 rounded-full items-center">
                    <p>
                    <span className="font-semibold">{trackCombination.listens.length}</span>
                    <span className="text-neutral-500">{trackCombination.listens.length == 1 ? " play" : " plays"}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export function ArtistCombinationItem({ artistCombination }: { artistCombination: ArtistCombination }) {
    const firstListen = artistCombination.listens[0]
    return (
        <div className="flex justify-between items-center py-2 gap-4">
            <div className="flex flex-col">
                <p className="font-semibold">{firstListen.artistName}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0 items-center">
                <p className="text-neutral-500">
                    {firstListen.timestamp.toLocaleDateString('en-US', {
                        day: "numeric",
                        month: "numeric",
                        year: "2-digit",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </p>
                <div className="px-3 py-1.5 bg-neutral-100 rounded-full items-center">
                    <p>
                    <span className="font-semibold">{artistCombination.listens.length}</span>
                    <span className="text-neutral-500">{artistCombination.listens.length == 1 ? " play" : " plays"}</span>
                    </p>
                </div>
            </div>
            
        </div>
    )
}

export function ListenItem({ listen }: { listen: HistoryEntry }) {
    return (
        <div className="flex justify-between items-center py-2">
            <div className="flex flex-col">
                <p className="font-semibold">{listen.trackName}</p>
                <p className="text-neutral-500">{listen.artistName}</p>
            </div>
            <p className="text-neutral-500 flex-shrink-0">
                {listen.timestamp.toLocaleDateString('en-US', {
                    day: "numeric",
                    month: "numeric",
                    year: "2-digit",
                    hour: "numeric",
                    minute: "2-digit"
                })}
            </p>
        </div>
    )
}