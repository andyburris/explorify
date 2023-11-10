import { SegmentedControl } from "@/app/common/SegmentedControl";
import { GroupSortType, ItemSortType, SortFilter } from "@/app/data/model/Filters";
import { Calendar, MusicNote, Play, SortAscending, SortDescending, User } from "phosphor-react-sc";
import { FilterSection } from "./FilterSelector";

export function SortFilterSelector({ currentFilter, hasGroups, onChangeFilter }: { currentFilter: SortFilter, hasGroups: boolean, onChangeFilter: (newFilter: SortFilter) => void }) {
    return (
        <div className="flex flex-col gap-6">
            { hasGroups &&
                <FilterSection title="Sort groups by">
                    <SegmentedControl 
                        items={[
                            { item: GroupSortType.Date, title: "Date", icon: <Calendar/> },
                            { item: GroupSortType.Plays, title: "Plays", icon: <Play/> },
                        ]} 
                        selectedItem={currentFilter.sortGroupsBy}
                        onSelect={(n) => onChangeFilter({ ...currentFilter, sortGroupsBy: n})}
                    />
                    <SegmentedControl 
                        items={[
                            { item: false, title: (currentFilter.sortGroupsBy == GroupSortType.Date) ? "Most to least recent" : "Most to least plays", icon: <SortDescending/> },
                            { item: true, title: (currentFilter.sortGroupsBy == GroupSortType.Date) ? "Least to most recent" : "Least to most plays", icon: <SortAscending/> },
                        ]} 
                        selectedItem={currentFilter.sortGroupsAscending}
                        onSelect={(n) => onChangeFilter({ ...currentFilter, sortGroupsAscending: n})}
                    />
                </FilterSection>
            }
            <FilterSection title="Sort items by">
                <SegmentedControl 
                    items={[
                        { item: ItemSortType.Date, title: "Date", icon: <Calendar/> },
                        { item: ItemSortType.Plays, title: "Plays", icon: <Play/> },
                        { item: ItemSortType.Name, title: "Song Name", icon: <MusicNote/> },
                        { item: ItemSortType.ArtistName, title: "Artist Name", icon: <User/> },
                    ]} 
                    selectedItem={currentFilter.sortItemsBy}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, sortItemsBy: n})}
                />
                <SegmentedControl 
                    items={[
                        { 
                            item: false, 
                            title: (currentFilter.sortItemsBy == ItemSortType.Date) 
                                ? "Most to least recent" 
                                : (currentFilter.sortItemsBy == ItemSortType.Plays)
                                ? "Most to least plays"
                                : "Z-A", 
                            icon: <SortDescending/> 
                        },
                        { 
                            item: true, 
                            title: (currentFilter.sortItemsBy == ItemSortType.Date) 
                                ? "Least to most recent" 
                                : (currentFilter.sortItemsBy == ItemSortType.Plays)
                                ? "Least to most plays"
                                : "A-Z", 
                            icon: <SortAscending/> 
                        },
                    ]} 
                    selectedItem={currentFilter.sortItemsAscending}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, sortItemsAscending: n})}
                />
            </FilterSection>
        </div>
    )
}