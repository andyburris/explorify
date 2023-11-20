import { SegmentedControl } from "@/app/common/SegmentedControl";
import { GroupSortType, ItemSortType, SortOperation } from "@/app/data/model/Operations";
import { Calendar, MusicNote, Play, SortAscending, SortDescending, User } from "phosphor-react-sc";
import { OperationSection } from "./OperationsSelector";

export function SortOperationSelector({ currentOperation, hasGroups, onChangeOperation }: { currentOperation: SortOperation, hasGroups: boolean, onChangeOperation: (newFilter: SortOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            { hasGroups &&
                <OperationSection title="Sort groups by">
                    <SegmentedControl 
                        items={[
                            { item: GroupSortType.Date, title: "Date", icon: <Calendar/> },
                            { item: GroupSortType.Plays, title: "Plays", icon: <Play/> },
                        ]} 
                        selectedItem={currentOperation.sortGroupsBy}
                        onSelect={(n) => onChangeOperation({ ...currentOperation, sortGroupsBy: n})}
                    />
                    <SegmentedControl 
                        items={[
                            { item: false, title: (currentOperation.sortGroupsBy == GroupSortType.Date) ? "Earliest to latest" : "Most to least plays", icon: <SortDescending/> },
                            { item: true, title: (currentOperation.sortGroupsBy == GroupSortType.Date) ? "Latest to earliest" : "Least to most plays", icon: <SortAscending/> },
                        ]} 
                        selectedItem={currentOperation.sortGroupsAscending}
                        onSelect={(n) => onChangeOperation({ ...currentOperation, sortGroupsAscending: n})}
                    />
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