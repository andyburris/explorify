import { SegmentedControl } from "@/app/common/SegmentedControl";
import { GroupSortOrder, ItemSortType, SortOperation } from "@/app/data/model/Operations";
import { Calendar, MusicNote, Play, SortAscending, SortDescending, User } from "phosphor-react-sc";
import { OperationSection } from "./OperationsSelector";

export function SortOperationSelector({ currentOperation, hasGroups, onChangeOperation }: { currentOperation: SortOperation, hasGroups: boolean, onChangeOperation: (newFilter: SortOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            { hasGroups &&
                <OperationSection title="Sort groups by">
                    <div className="flex flex-col gap-2">
                        <GroupSortItem icon={<Calendar/>} name="Day" isAscending={true} sortNames={["Old-New", "New-Old"]}/>
                        <GroupSortItem icon={<MusicNote/>} name="Song name" isAscending={false} sortNames={["A-Z", "Z-A"]}/>
                    </div>
                </OperationSection>
            }
            <OperationSection title="Sort items by">
                <SegmentedControl 
                    items={[
                        { item: ItemSortType.Date, title: "Date", icon: <Calendar/> },
                        { item: ItemSortType.Plays, title: "Plays", icon: <Play/> },
                        { item: ItemSortType.Name, title: "Song Name", icon: <MusicNote/> },
                        { item: ItemSortType.ArtistName, title: "Artist Name", icon: <User/> },
                    ]} 
                    selectedItem={currentOperation.sortItemsBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, sortItemsBy: n})}
                />
                <SegmentedControl 
                    items={[
                        { 
                            item: false, 
                            title: (currentOperation.sortItemsBy == ItemSortType.Date) 
                                ? "Earliest to latest" 
                                : (currentOperation.sortItemsBy == ItemSortType.Plays)
                                ? "Most to least plays"
                                : "Z-A", 
                            icon: <SortDescending/> 
                        },
                        { 
                            item: true, 
                            title: (currentOperation.sortItemsBy == ItemSortType.Date) 
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
                <SegmentedControl
                    items={[
                        { item: false, title: descendingName, icon: <SortDescending/> },
                        { item: true, title: ascendingName, icon: <SortAscending/> },
                    ]}
                    selectedItem={isAscending}
                    onSelect={b => true}
                />
            </div>
        </div>
    )
}