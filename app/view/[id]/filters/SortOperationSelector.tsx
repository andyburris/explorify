import { SegmentedControl } from "@/app/common/SegmentedControl";
import { GroupSortOrder, GroupSortOrderItem, GroupType, ItemSortType, SortOperation } from "@/app/data/model/Operations";
import { ArrowDown, ArrowUp, ArrowsCounterClockwise, Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, DotsSixVertical, Hourglass, MusicNote, PencilSimpleLine, Percent, Play, SortAscending, SortDescending, User } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { Combobox } from "@/app/common/components/ui/combobox";
import { useState } from "react";
import { ActionButton } from "@/app/common/button/ActionButton";
import { sortItemsInOrder } from "@/app/data/transform/Sorting";
import { simpleSortGroupsDate, simpleSortGroupsPlays, simpleSortGroupsSong } from "@/app/data/Defaults";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers'
import {CSS} from '@dnd-kit/utilities';

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
    ["artist", { icon: <User/>, name: "Artist name", sortNames: ["A-Z", "Z-A"], } ],
    ["album", { icon: <Disc/>, name: "Album name", sortNames: ["A-Z", "Z-A"], } ],
])
function GroupSortSelector({ currentSort, currentGroupType, onChangeSort }: { currentSort: GroupSortOrder, currentGroupType: GroupType, onChangeSort: (updated: GroupSortOrder) => void }) {
    const sortTypesInOrder: { id: string, sortType: GroupSortOrderType, item: GroupSortOrderItem }[] = sortItemsInOrder(currentSort).map(([key, item]) => { return { id: key, sortType: sortOrderTypes.get(key)!, item: item } })
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="flex flex-col border border-neutral-200 rounded-xl p-1">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToParentElement]}
                onDragEnd={(e) => {
                    const { active, over } = e
                    if(active.id !== over?.id) {
                        const oldIndex = sortTypesInOrder.findIndex(st => st.id == active.id)
                        const newIndex = sortTypesInOrder.findIndex(st => st.id == over?.id)


                        const newOrder = arrayMove(sortTypesInOrder, oldIndex, newIndex)
                        const updated: GroupSortOrder = { ...currentSort }
                        newOrder.forEach((st, i) => updated[st.id as keyof GroupSortOrder].index = i)
                        onChangeSort(updated)
                    }
                }}
                >
                <SortableContext 
                    items={sortTypesInOrder}
                    strategy={verticalListSortingStrategy}>
                        {sortTypesInOrder.map(st => {
                            const { id, sortType, item } = st
                            const isAscending = currentSort[id as keyof GroupSortOrder].isAscending
                            return (
                                <GroupSortItem 
                                key={id}
                                id={id}
                                icon={sortType.icon} 
                                name={sortType.name} 
                                sortNames={sortType.sortNames} 
                                isEnabled={true}
                                isAscending={isAscending}
                                canIncreasePriority={item.index > 0}
                                canDecreasePriority={item.index < sortOrderTypes.size - 1}
                                onInvert={() => {
                                    const updated: GroupSortOrder = { ...currentSort }
                                    updated[id as keyof GroupSortOrder].isAscending = !isAscending
                                    onChangeSort(updated)
                                }}
                            />)
                        })
                    }
                </SortableContext>
            </DndContext>
        </div>
    )
}

interface GroupSortItemProps { 
    id: string,
    icon: React.ReactNode, 
    name: string, 
    isAscending: boolean, 
    sortNames: [string, string], 
    isEnabled: boolean,
    canIncreasePriority: boolean,
    canDecreasePriority: boolean,
    onInvert: () => void,
}
function GroupSortItem({ id, icon, name, isAscending, sortNames, isEnabled, canIncreasePriority, canDecreasePriority, onInvert }: GroupSortItemProps) {
    const { active, attributes, listeners, setNodeRef, transform, transition } = useSortable({id: id})
    const noScaleY = transform ? { ...transform, scaleY: 1 } : null
    const style = { transform: CSS.Transform.toString(noScaleY), transition }

    const [ascendingName, descendingName] = sortNames
    return (
        <div 
            ref={setNodeRef}
            className="flex gap-1 items-center w-full pr-1 touch-none"
            style={style} 
            {...attributes}
            >
            <div 
                className={"flex gap-3 px-3 py-3 rounded-xl items-center w-full " + (active?.id === undefined ? "hover:bg-neutral-100 focus:bg-neutral-100" : active.id == id ? "bg-neutral-100 ring-2 ring-offset-2 ring-neutral-200 z-10" : "")}
                {...listeners}
                >
                <div className="text-neutral-500 text-xl">{icon}</div>
                <p className={"flex-grow" + (isEnabled ? "" : " opacity-70")}>
                    <span className="min-w-min">{name}</span>
                    <span className="text-neutral-500"> ∙ {isAscending ? ascendingName : descendingName}</span>
                </p>
                <DotsSixVertical className="text-neutral-500 text-2xl"/>
            </div>
            <ActionButton hideShadow icon={<ArrowsCounterClockwise/>} onClick={() => onInvert()} />
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