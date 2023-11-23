import { Group, GroupType } from "@/app/data/model/Group";
import { ViewOptions } from "@/app/data/model/ViewOptions";
import { Play } from "phosphor-react-sc";

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
                <div className="px-3 py-1.5 border border-neutral-200 rounded-full items-center text-neutral-500">
                    <div className="flex gap-0.5 items-center">
                        <p>
                            <span className="font-medium">{group.totalPlays}</span>
                            <span className="text-neutral-500 max-sm:hidden">{group.totalPlays == 1 ? " play" : " plays"}</span>
                        </p>
                        <Play className="sm:hidden" size="16px" weight="bold"/>
                    </div>
                </div>
            }
        </div>
    )
}