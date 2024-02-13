import { SegmentedControl } from "@/app/common/SegmentedControl";
import { GroupSortOrder, GroupSortOrderItem, GroupType, ItemSortType, SortOperation } from "@/app/data/model/Operations";
import { ArrowDown, ArrowUp, ArrowsCounterClockwise, Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, Hourglass, MusicNote, PencilSimpleLine, Percent, Play, SortAscending, SortDescending, User } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { Combobox } from "@/app/common/components/ui/combobox";
import { useState } from "react";
import { ActionButton } from "@/app/common/button/ActionButton";
import { sortItemsInOrder } from "@/app/data/transform/Sorting";
import { simpleSortGroupsDate, simpleSortGroupsPlays, simpleSortGroupsSong } from "@/app/data/Defaults";

export function SortOperationSelector({ currentOperation, groupType, onChangeOperation }: { currentOperation: SortOperation, groupType: GroupType, onChangeOperation: (newFilter: SortOperation) => void }) {
    const [isCustomGroupSort, setCustomGroupSort] = useState(false)
    const simpleGroupSort = complexToSimple(currentOperation.sortGroupsBy)
    const hasGroups= Object.values(groupType).some(b => b)
    return (
        <div className="flex flex-col gap-6">
            { hasGroups &&
                <OperationSection title="Sort groups by">
                    <ResponsiveControl 
                        items={[
                            { value: SimpleGroupSortType.Date, key: "Date", label: "Date", icon: <Calendar/> },
                            { value: SimpleGroupSortType.Plays, key: "Plays", label: "Plays", icon: <Play/> },
                            { value: SimpleGroupSortType.Name, key: "Name", label: "Name", icon: <MusicNote/> },
                            { value: null, key: "Custom", label: "Custom", icon: <PencilSimpleLine/> },
                        ]} 
                        selectedItem={isCustomGroupSort ? null : simpleGroupSort}
                        onSelect={(n) => {
                            if(n !== null) {
                                onChangeOperation({ ...currentOperation, sortGroupsBy: simpleToComplex(n)})
                                setCustomGroupSort(false)
                            } else {
                                setCustomGroupSort(true)
                            }
                        }}
                    />
                    { (isCustomGroupSort || simpleGroupSort == null) && 
                        <GroupSortSelector 
                            currentSort={currentOperation.sortGroupsBy} 
                            currentGroupType={groupType}
                            onChangeSort={(updated) => onChangeOperation({ ...currentOperation, sortGroupsBy: updated })}
                        />
                    }
                </OperationSection>
            }
            <OperationSection title="Sort items by">
                <Combobox 
                    options={[
                        { value: ItemSortType.Date, key: "Date", label: "Date", icon: <Calendar/> },
                        { value: ItemSortType.Plays, key: "Plays", label: "Plays", icon: <Play/> },
                        { value: ItemSortType.Playtime, key: "Playtime", label: "Playtime", icon: <Clock/> },
                        { value: ItemSortType.Name, key: "Song Name", label: "Song Name", icon: <MusicNote/> },
                        { value: ItemSortType.ArtistName, key: "Artist Name", label: "Artist Name", icon: <User/> },
                    ]} 
                    selectedValues={[currentOperation.sortItemsBy]}
                    onSelectValues={(n) => onChangeOperation({ ...currentOperation, sortItemsBy: n[0] ?? currentOperation.sortItemsBy})}
                    multiSelect={false}
                    placeholder="Search..."
                />
                <ResponsiveControl 
                    items={[
                        { 
                            value: false, 
                            key: "descending",
                            label: (currentOperation.sortItemsBy == ItemSortType.Date) 
                                    ? "Latest to earliest" 
                                : (currentOperation.sortItemsBy == ItemSortType.Plays)
                                    ? "Most to least plays"
                                : (currentOperation.sortItemsBy == ItemSortType.Playtime)
                                    ? "Most to least playtime"
                                    : "Z-A", 
                            icon: <SortDescending/> 
                        },
                        { 
                            value: true, 
                            key: "ascending",
                            label: (currentOperation.sortItemsBy == ItemSortType.Date) 
                                    ? "Earliest to latest" 
                                : (currentOperation.sortItemsBy == ItemSortType.Plays)
                                    ? "Least to most plays"
                                : (currentOperation.sortItemsBy == ItemSortType.Playtime)
                                    ? "Least to most playtime"
                                    : "A-Z", 
                            icon: <SortAscending/> 
                        },
                    ]} 
                    selectedItem={currentOperation.sortItemsAscending}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, sortItemsAscending: n})}
                />
            </OperationSection>
        </div>
    )
}


interface GroupSortOrderType {
    icon: React.ReactNode, 
    name: string, 
    sortNames: [string, string], 
}
const sortOrderTypes: Map<String, GroupSortOrderType> = new Map([
    ["hour", { icon: <Clock/>, name: "Hour", sortNames: ["Old-New", "New-Old"], } ],
    ["dayOfWeek", { icon: <CalendarBlank/>, name: "Day of week", sortNames: ["Old-New", "New-Old"], } ],
    ["date", { icon: <Calendar/>, name: "Day of month", sortNames: ["Old-New", "New-Old"], } ],
    ["month", { icon: <Calendar/>, name: "Month", sortNames: ["Old-New", "New-Old"], } ],
    ["year", { icon: <ClockCounterClockwise/>, name: "Year", sortNames: ["Old-New", "New-Old"], } ],
    ["plays", { icon: <Play/>, name: "Plays", sortNames: ["Least-Most", "Most-Least"], } ],
    ["playtime", { icon: <Clock/>, name: "Playtime", sortNames: ["Least-Most", "Most-Least"], } ],
    ["percent", { icon: <Percent/>, name: "Percent", sortNames: ["Least-Most", "Most-Least"], } ],
    ["song", { icon: <MusicNote/>, name: "Song name", sortNames: ["A-Z", "Z-A"], } ],
    ["album", { icon: <User/>, name: "Artist name", sortNames: ["A-Z", "Z-A"], } ],
    ["artist", { icon: <Disc/>, name: "Album name", sortNames: ["A-Z", "Z-A"], } ],
])
function GroupSortSelector({ currentSort, currentGroupType, onChangeSort }: { currentSort: GroupSortOrder, currentGroupType: GroupType, onChangeSort: (updated: GroupSortOrder) => void }) {
    const sortTypesInOrder: [string, GroupSortOrderType, GroupSortOrderItem][] = sortItemsInOrder(currentSort).map(([key, item]) => [key, sortOrderTypes.get(key)!, item])

    return (
        <div className="flex flex-col border border-neutral-200 rounded-xl">
            { sortTypesInOrder.map(([key, sortType, item]) => {
                const isAscending = currentSort[key as keyof GroupSortOrder].isAscending
                return (
                    <GroupSortItem 
                    key={key}
                    icon={sortType.icon} 
                    name={sortType.name} 
                    sortNames={sortType.sortNames} 
                    isEnabled={true}
                    isAscending={isAscending}
                    canIncreasePriority={item.index > 0}
                    canDecreasePriority={item.index < sortOrderTypes.size - 1}
                    onInvert={() => {
                        const updated: GroupSortOrder = { ...currentSort }
                        updated[key as keyof GroupSortOrder].isAscending = !isAscending
                        onChangeSort(updated)
                    }}
                    onIncreasePriority={() => {
                        const currentIndex = item.index
                        const updated: GroupSortOrder = { ...currentSort }
                        const swapKey: string = Object.entries(currentSort).find(([key, item]) => item.index == currentIndex - 1)![0]
                        
                        updated[swapKey as keyof GroupSortOrder].index = currentIndex
                        updated[key as keyof GroupSortOrder].index = currentIndex - 1
                        onChangeSort(updated)
                    }}
                    onDecreasePriority={() => {
                        const currentIndex = item.index
                        const updated: GroupSortOrder = { ...currentSort }
                        const swapKey: string = Object.entries(currentSort).find(([key, item]) => item.index == currentIndex + 1)![0]
                        
                        updated[swapKey as keyof GroupSortOrder].index = currentIndex
                        updated[key as keyof GroupSortOrder].index = currentIndex + 1
                        onChangeSort(updated)
                    }}
                />
                )
            })}
        </div>
    )
}

interface GroupSortItemProps { 
    icon: React.ReactNode, 
    name: string, 
    isAscending: boolean, 
    sortNames: [string, string], 
    isEnabled: boolean,
    canIncreasePriority: boolean,
    canDecreasePriority: boolean,
    onInvert: () => void,
    onIncreasePriority: () => void,
    onDecreasePriority: () => void,
}
function GroupSortItem({ icon, name, isAscending, sortNames, isEnabled, canIncreasePriority, canDecreasePriority, onInvert, onIncreasePriority, onDecreasePriority }: GroupSortItemProps) {
    const [ascendingName, descendingName] = sortNames
    return (
        <div className="flex gap-3 px-3 py-2 rounded-xl items-center w-full">
            <div className="text-neutral-500 text-xl">{icon}</div>
            <p className={"flex-grow" + (isEnabled ? "" : " opacity-70")}>
                <span className="min-w-min">{name}</span>
                <span className="text-neutral-500"> ∙ {isAscending ? ascendingName : descendingName}</span>
            </p>
            <div className="flex">
                <ActionButton hideShadow icon={<ArrowsCounterClockwise/>} onClick={() => onInvert()} />
                <ActionButton hideShadow icon={<ArrowUp/>} onClick={() => onIncreasePriority()} enabled={canIncreasePriority} />
                <ActionButton hideShadow icon={<ArrowDown/>} onClick={() => onDecreasePriority()} enabled={canDecreasePriority} />
            </div>
        </div>
    )
}

enum SimpleGroupSortType { Date, Name, Plays }

const songAsString = JSON.stringify(simpleSortGroupsSong)
const playsAsString = JSON.stringify(simpleSortGroupsPlays)
const dateAsString = JSON.stringify(simpleSortGroupsDate)
function complexToSimple(complex: GroupSortOrder): SimpleGroupSortType | null {
    const asString = JSON.stringify(complex)
    if(asString == songAsString) return SimpleGroupSortType.Name
    if(asString == playsAsString) return SimpleGroupSortType.Plays
    if(asString == dateAsString) return SimpleGroupSortType.Date
    return null
}

function simpleToComplex(simple: SimpleGroupSortType): GroupSortOrder {
    switch(simple) {
        case SimpleGroupSortType.Name: return simpleSortGroupsSong
        case SimpleGroupSortType.Plays: return simpleSortGroupsPlays
        case SimpleGroupSortType.Date: return simpleSortGroupsDate
    }
}