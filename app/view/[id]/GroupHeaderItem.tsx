import { Group, GroupType } from "@/app/data/model/Group";
import { ViewOptions } from "@/app/data/model/ViewOptions";

export function GroupHeader({ group, viewOptions }: { group: Group, viewOptions: ViewOptions }) {
    const dateString = (group.type == GroupType.None)
        ? "All Time"
        : group.date.toLocaleDateString('en-US', {
            hour: (group.type == GroupType.Hour) ? "numeric" : undefined,
            month: (group.type == GroupType.Hour || group.type == GroupType.Day || group.type == GroupType.Month) ? "long" : undefined,
            day: (group.type == GroupType.Hour || group.type == GroupType.Day) ? "numeric" : undefined,
            year: "numeric"
        })
    return (
        <div className="flex justify-between items-center pb-2 pt-12">
            <div className="flex items-center -ml-4 gap-3">
                <div className="h-6 w-1 rounded-full bg-green-600"></div>
                <p className="font-serif tracking-tight text-4xl font-bold">{dateString}</p>
            </div>
            { viewOptions.showGroupSum &&
                <div className="px-3 py-1.5 text-neutral-500 border border-neutral-300 rounded-full">
                    <p>{`${group.totalPlays.toLocaleString()} play${group.totalPlays == 0 ? "" : "s"}`}</p>
                </div>
            }
        </div>
    )
}