import { Group, GroupType } from "@/app/data/model/Group";

export function GroupHeader({ group }: { group: Group }) {
    const dateString = (group.type == GroupType.None)
        ? "All Time"
        : group.date.toLocaleDateString('en-US', {
            hour: (group.type == GroupType.Hour) ? "numeric" : undefined,
            month: (group.type == GroupType.Hour || GroupType.Day || GroupType.Month) ? "long" : undefined,
            day: (group.type == GroupType.Hour || GroupType.Day) ? "numeric" : undefined,
            year: "numeric"
        })
    return (
        <p className="tracking-tight text-3xl font-bold pb-2 pt-8">{dateString}</p>
    )
}