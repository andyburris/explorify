import { HistoryEntry } from "@/app/data/model/HistoryEntry";

export function ListenItem({ listen }: { listen: HistoryEntry }) {
    return (
        <div className="flex justify-between">
            <p>{listen.trackName}</p>
            <p className="text-stone-500 flex-shrink-0">
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