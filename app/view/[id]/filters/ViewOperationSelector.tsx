import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";
import { OperationSection } from "./OperationsSelector";
import { SegmentedControl } from "@/app/common/SegmentedControl";
import { Calendar, EyeSlash, List, ListNumbers, MagnifyingGlass, Play, PlusCircle } from "phosphor-react-sc";

export function ViewOptionsSelector({ currentOperation, onChangeOperation }: { currentOperation: ViewOptions, onChangeOperation: (newFilter: ViewOptions) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Primary info">
                <SegmentedControl 
                    items={[
                        { item: ViewInfoType.Date, title: "Date", icon: <Calendar/> },
                        { item: ViewInfoType.Plays, title: "Plays", icon: <Play/> },
                    ]} 
                    selectedItem={currentOperation.primaryInfo}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, primaryInfo: n})}
                />
            </OperationSection>
            <OperationSection title="Secondary info">
                <SegmentedControl 
                    items={[
                        { item: ViewInfoType.Date, title: "Date", icon: <Calendar/> },
                        { item: ViewInfoType.Plays, title: "Plays", icon: <Play/> },
                        { item: null, title: "None", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.secondaryInfo}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, secondaryInfo: n})}
                />
            </OperationSection>
            <OperationSection title="Show search">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <MagnifyingGlass/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showSearch}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showSearch: n})}
                />
            </OperationSection>
            <OperationSection title="Show items">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <List/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showItems}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showItems: n})}
                />
            </OperationSection>
            <OperationSection title="Show item ranks">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <ListNumbers/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showItemRanks}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showItemRanks: n})}
                />
            </OperationSection>
            <OperationSection title="Show group sums">
                <SegmentedControl 
                    items={[
                        { item: true, title: "Yes", icon: <PlusCircle/> },
                        { item: false, title: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentOperation.showGroupSum}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, showGroupSum: n})}
                />
            </OperationSection>
            <OperationSection title="Preview info">
                <SegmentedControl 
                    items={[
                        { item: false, title: "Songs", icon: <List/> },
                        { item: true, title: "Groups", icon: <Calendar/> },
                    ]} 
                    selectedItem={currentOperation.previewGroups}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, previewGroups: n})}
                />
            </OperationSection>
        </div>
    )
}
