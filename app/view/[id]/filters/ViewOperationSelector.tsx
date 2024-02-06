import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { Calendar, Clock, EyeSlash, List, ListNumbers, MagnifyingGlass, Percent, Play, PlusCircle, SquaresFour } from "phosphor-react-sc";
import { Combobox } from "@/app/common/components/ui/combobox";

enum SimpleViewInfoType {
    Date, Plays, Playtime, Percent
}
function toSimple(viewInfoType: ViewInfoType) { 
    switch (viewInfoType) {
        case ViewInfoType.Date: return SimpleViewInfoType.Date
        case ViewInfoType.Plays: return SimpleViewInfoType.Plays
        case ViewInfoType.Playtime: return SimpleViewInfoType.Playtime
        default: return SimpleViewInfoType.Percent
    }
}
function fromSimple(simple: SimpleViewInfoType) {
    switch(simple) {
        case SimpleViewInfoType.Date: return ViewInfoType.Date
        case SimpleViewInfoType.Plays: return ViewInfoType.Plays
        case SimpleViewInfoType.Playtime: return ViewInfoType.Playtime
        case SimpleViewInfoType.Percent: return ViewInfoType.PercentGroupPlays
    }
}

export function ViewOptionsSelector({ currentOperation, onChangeOperation }: { currentOperation: ViewOptions, onChangeOperation: (newFilter: ViewOptions) => void }) {
    const simplePrimary = toSimple(currentOperation.primaryInfo)
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Primary info">
                <ResponsiveControl 
                    items={[
                        { value: SimpleViewInfoType.Date, label: "Date", key: "Date", icon: <Calendar/> },
                        { value: SimpleViewInfoType.Plays, label: "Plays", key: "Plays", icon: <Play/> },
                        { value: SimpleViewInfoType.Playtime, label: "Playtime", key: "Playtime", icon: <Clock/> },
                        { value: SimpleViewInfoType.Percent, label: "Percent", key: "Percent", icon: <Percent/> },
                    ]} 
                    selectedItem={toSimple(currentOperation.primaryInfo)}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, primaryInfo: fromSimple(n)})}
                />
                { simplePrimary == SimpleViewInfoType.Percent && 
                    <Combobox
                        options={[
                            { value: ViewInfoType.PercentTotalPlays, label: "Percent of total plays", key: "total-plays", icon: <Play/> },
                            { value: ViewInfoType.PercentTotalPlaytime, label: "Percent of total playtime", key: "total-playtime", icon: <Clock/> },
                            { value: ViewInfoType.PercentGroupPlays, label: "Percent of plays within group", key: "group-plays", icon: <Play/> },
                            { value: ViewInfoType.PercentGroupPlaytime, label: "Percent of playtime within group", key: "group-playtime", icon: <Clock/> },
                        ]}
                        selectedValues={[currentOperation.primaryInfo]}
                        onSelectValues={(n) => onChangeOperation({ ...currentOperation, primaryInfo: n[0]})}
                        multiSelect={false}
                        placeholder="Search..."
                    />
                }
            </OperationSection>
            <OperationSection title="Secondary info">
                <ResponsiveControl 
                    items={[
                        { value: ViewInfoType.Date, label: "Date", key: "Date", icon: <Calendar/> },
                        { value: ViewInfoType.Plays, label: "Plays", key: "Plays", icon: <Play/> },
                        { value: ViewInfoType.Playtime, label: "Playtime", key: "Playime", icon: <Clock/> },
                        { value: null, label: "None", key: "None", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.secondaryInfo}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, secondaryInfo: n})}
                />
            </OperationSection>
            <OperationSection title="Show search">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <MagnifyingGlass/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showSearch}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showSearch: n})}
                />
            </OperationSection>
            <OperationSection title="Show items">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <List/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showItems}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showItems: n})}
                />
            </OperationSection>
            <OperationSection title="Show item ranks">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <ListNumbers/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showItemRanks}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showItemRanks: n})}
                />
            </OperationSection>
            <OperationSection title="Show group sums">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <PlusCircle/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showGroupSum}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showGroupSum: n})}
                />
            </OperationSection>
            <OperationSection title="Preview info">
                <ResponsiveControl 
                    items={[
                        { value: false, label: "Songs", key: "Songs", icon: <List/> },
                        { value: true, label: "Groups", key: "Groups", icon: <Calendar/> },
                    ]} 
                    selectedItem={currentOperation.previewGroups}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, previewGroups: n})}
                />
            </OperationSection>
        </div>
    )
}
