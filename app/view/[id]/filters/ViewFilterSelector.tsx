import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";
import { FilterSection } from "./FilterSelector";
import { SegmentedControl } from "@/app/common/SegmentedControl";
import { Calendar, EyeSlash, List, ListNumbers, Play, PlusCircle } from "phosphor-react-sc";

export function ViewOptionsSelector({ currentFilter, onChangeFilter }: { currentFilter: ViewOptions, onChangeFilter: (newFilter: ViewOptions) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <FilterSection title="Primary info">
                <SegmentedControl 
                    items={[
                        { item: ViewInfoType.Date, title: "Date", icon: <Calendar/> },
                        { item: ViewInfoType.Plays, title: "Plays", icon: <Play/> },
                    ]} 
                    selectedItem={currentFilter.primaryInfo}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, primaryInfo: n})}
                />
            </FilterSection>
            <FilterSection title="Secondary info">
                <SegmentedControl 
                    items={[
                        { item: ViewInfoType.Date, title: "Date", icon: <Calendar/> },
                        { item: ViewInfoType.Plays, title: "Plays", icon: <Play/> },
                        { item: null, title: "None", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentFilter.secondaryInfo}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, secondaryInfo: n})}
                />
            </FilterSection>
            <FilterSection title="Show items">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <List/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentFilter.showItems}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, showItems: n})}
                />
            </FilterSection>
            <FilterSection title="Show item ranks">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <ListNumbers/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentFilter.showItemRanks}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, showItemRanks: n})}
                />
            </FilterSection>
            <FilterSection title="Show group sums">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <PlusCircle/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentFilter.showGroupSum}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, showGroupSum: n})}
                />
            </FilterSection>
            <FilterSection title="Preview info">
                <SegmentedControl 
                    items={[
                        { item: false, title: "Songs", icon: <List/> },
                        { item: true, title: "Groups", icon: <Calendar/> },
                    ]} 
                    selectedItem={currentFilter.previewGroups}
                    onSelect={(n) => onChangeFilter({ ...currentFilter, previewGroups: n})}
                />
            </FilterSection>
        </div>
    )
}
