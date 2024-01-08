import { SegmentedControl } from "@/app/common/SegmentedControl";
import { GroupSortOrder, ItemSortType, SortOperation } from "@/app/data/model/Operations";
import { Calendar, CalendarBlank, Clock, ClockCounterClockwise, Disc, MusicNote, Play, SortAscending, SortDescending, User } from "phosphor-react-sc";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";

export function SortOperationSelector({ currentOperation, hasGroups, onChangeOperation }: { currentOperation: SortOperation, hasGroups: boolean, onChangeOperation: (newFilter: SortOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            { hasGroups &&
                <OperationSection title="Sort groups by">
                    {/* <div className="flex flex-col gap-2">
                        <GroupSortItem icon={<Clock/>} name="Hour" isAscending={true} sortNames={["Old-New", "New-Old"]}/>
                        <GroupSortItem icon={<CalendarBlank/>} name="Day of week" isAscending={true} sortNames={["Old-New", "New-Old"]}/>
                        <GroupSortItem icon={<Calendar/>} name="Day of month" isAscending={true} sortNames={["Old-New", "New-Old"]}/>
                        <GroupSortItem icon={<Calendar/>} name="Month" isAscending={true} sortNames={["Old-New", "New-Old"]}/>
                        <GroupSortItem icon={<ClockCounterClockwise/>} name="Year" isAscending={true} sortNames={["Old-New", "New-Old"]}/>
                        <GroupSortItem icon={<MusicNote/>} name="Song name" isAscending={false} sortNames={["A-Z", "Z-A"]}/>
                        <GroupSortItem icon={<User/>} name="Artist name" isAscending={false} sortNames={["A-Z", "Z-A"]}/>
                        <GroupSortItem icon={<Disc/>} name="Album name" isAscending={false} sortNames={["A-Z", "Z-A"]}/>
                    </div> */}
                    <ResponsiveControl 
                    items={[
                        { value: SimpleGroupSortType.Date, key: "Date", label: "Date", icon: <Calendar/> },
                        { value: SimpleGroupSortType.Plays, key: "Plays", label: "Plays", icon: <Play/> },
                        { value: SimpleGroupSortType.Name, key: "Name", label: "Name", icon: <MusicNote/> },
                    ]} 
                    selectedItem={complexToSimple(currentOperation.sortGroupsBy)}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, sortGroupsBy: simpleToComplex(n)})}
                />
                </OperationSection>
            }
            <OperationSection title="Sort items by">
                <ResponsiveControl 
                    items={[
                        { value: ItemSortType.Date, key: "Date", label: "Date", icon: <Calendar/> },
                        { value: ItemSortType.Plays, key: "Plays", label: "Plays", icon: <Play/> },
                        { value: ItemSortType.Name, key: "Song Name", label: "Song Name", icon: <MusicNote/> },
                        { value: ItemSortType.ArtistName, key: "Artist Name", label: "Artist Name", icon: <User/> },
                    ]} 
                    selectedItem={currentOperation.sortItemsBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, sortItemsBy: n})}
                />
                <ResponsiveControl 
                    items={[
                        { 
                            value: false, 
                            key: "descending",
                            label: (currentOperation.sortItemsBy == ItemSortType.Date) 
                                ? "Earliest to latest" 
                                : (currentOperation.sortItemsBy == ItemSortType.Plays)
                                ? "Most to least plays"
                                : "Z-A", 
                            icon: <SortDescending/> 
                        },
                        { 
                            value: true, 
                            key: "ascending",
                            label: (currentOperation.sortItemsBy == ItemSortType.Date) 
                                ? "Latest to earliest" 
                                : (currentOperation.sortItemsBy == ItemSortType.Plays)
                                ? "Least to most plays"
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

function GroupSortItem({ icon, name, isAscending, sortNames }: { icon: React.ReactNode, name: string, isAscending: boolean, sortNames: [string, string] }) {
    const [ascendingName, descendingName] = sortNames
    return (
        <div className="flex gap-3 p-3 rounded-xl cursor-move hover:bg-neutral-50">
            <div className="text-neutral-500 text-lg">{icon}</div>
            <div className="flex flex-col">
                <div className="font-semibold">{name}</div>
                <ResponsiveControl
                    items={[
                        { value: false, key: "descending", label: descendingName, icon: <SortDescending/> },
                        { value: true, key: "ascending", label: ascendingName, icon: <SortAscending/> },
                    ]}
                    selectedItem={isAscending}
                    onSelect={b => true}
                />
            </div>
        </div>
    )
}

enum SimpleGroupSortType { Date, Name, Plays }
export const simpleSortGroupsDate = {
    hour: { index: 4, isAscending: true },
    dayOfWeek: { index: 3, isAscending: true },
    date: { index: 2, isAscending: true },
    month: { index: 1, isAscending: true },
    year: { index: 0, isAscending: true },
    artist: { index: 6, isAscending: true },
    song: { index: 5, isAscending: true },
    album: { index: 7, isAscending: true },
    totalPlays: { index: 8, isAscending: true },
    totalPlaytime: { index: 9, isAscending: true },
}
export const simpleSortGroupsSong = {
    hour: { index: 7, isAscending: true },
    dayOfWeek: { index: 6, isAscending: true },
    date: { index: 5, isAscending: true },
    month: { index: 4, isAscending: true },
    year: { index: 3, isAscending: true },
    artist: { index: 1, isAscending: true },
    song: { index: 0, isAscending: true },
    album: { index: 2, isAscending: true },
    totalPlays: { index: 8, isAscending: true },
    totalPlaytime: { index: 9, isAscending: true },
}
export const simpleSortGroupsSum = {
    hour: { index: 8, isAscending: true },
    dayOfWeek: { index: 7, isAscending: true },
    date: { index: 6, isAscending: true },
    month: { index: 5, isAscending: true },
    year: { index: 4, isAscending: true },
    artist: { index: 2, isAscending: true },
    song: { index: 1, isAscending: true },
    album: { index: 3, isAscending: true },
    totalPlays: { index: 0, isAscending: false },
    totalPlaytime: { index: 9, isAscending: false },
}

function complexToSimple(complex: GroupSortOrder): SimpleGroupSortType {
    if(complex == simpleSortGroupsSong) return SimpleGroupSortType.Name
    if(complex == simpleSortGroupsSum) return SimpleGroupSortType.Plays
    return SimpleGroupSortType.Date
}

function simpleToComplex(simple: SimpleGroupSortType): GroupSortOrder {
    if(simple == SimpleGroupSortType.Name) return simpleSortGroupsSong
    if(simple == SimpleGroupSortType.Plays) return simpleSortGroupsSum
    return simpleSortGroupsDate

}