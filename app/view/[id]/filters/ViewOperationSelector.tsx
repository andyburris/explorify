import { ViewInfoType, ViewOptions } from "@/app/data/model/ViewOptions";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { Calendar, EyeSlash, List, ListNumbers, MagnifyingGlass, Play, PlusCircle } from "phosphor-react-sc";

export function ViewOptionsSelector({ currentOperation, onChangeOperation }: { currentOperation: ViewOptions, onChangeOperation: (newFilter: ViewOptions) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Primary info">
                <ResponsiveControl 
                    items={[
                        { value: ViewInfoType.Date, label: "Date", key: "Date", icon: <Calendar/> },
                        { value: ViewInfoType.Plays, label: "Plays", key: "Plays", icon: <Play/> },
                    ]} 
                    selectedItem={currentOperation.primaryInfo}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, primaryInfo: n})}
                />
            </OperationSection>
            <OperationSection title="Secondary info">
                <ResponsiveControl 
                    items={[
                        { value: ViewInfoType.Date, label: "Date", key: "Date", icon: <Calendar/> },
                        { value: ViewInfoType.Plays, label: "Plays", key: "Plays", icon: <Play/> },
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
