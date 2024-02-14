import { ViewOptions } from "@/app/data/model/ViewOptions";
import { OperationSection, ResponsiveControl } from "./OperationsSelector";
import { Calendar, Clock, Divide, EyeSlash, List, ListNumbers, MagnifyingGlass, Percent, Play, PlusCircle, SkipForward, SquaresFour } from "phosphor-react-sc";
import { Combobox } from "@/app/common/components/ui/combobox";
import { InfoOperation, InfoType, Operations, PercentDenominator, PercentGrouping, PercentNumerator, PercentOf, SkipFilterType } from "@/app/data/model/Operations";


export function ViewOptionsSelector({ currentOperations, onChangeViewOptions, onChangeInfoOperation }: { currentOperations: Operations, onChangeViewOptions: (newFilter: ViewOptions) => void, onChangeInfoOperation: (newOperation: InfoOperation) => void}) {
    const currentViewOptions = currentOperations.viewOptions
    const currentInfoOperation = currentOperations.info
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Primary info">
            <Combobox 
                    options={[
                        { value: InfoType.Date, label: "Date", key: "Date", icon: <Calendar/> },
                        { value: InfoType.Plays, label: "Plays", key: "Plays", icon: <Play/> },
                        { value: InfoType.Playtime, label: "Playtime", key: "Playtime", icon: <Clock/> },
                        { value: InfoType.Percent, label: "Percent", key: "Percent", icon: <Percent/> },
                        { value: InfoType.Fraction, label: "Fraction", key: "Fraction", icon: <Divide/> },
                    ]} 
                    selectedValues={[currentInfoOperation.primaryInfo]}
                    onSelectValues={(n) => onChangeInfoOperation({ ...currentInfoOperation, primaryInfo: n[0]})}
                    multiSelect={false}
                    placeholder="Search..."
                />
            </OperationSection>
            <OperationSection title="Secondary info">
                <Combobox 
                    options={[
                        { value: InfoType.Date, label: "Date", key: "Date", icon: <Calendar/> },
                        { value: InfoType.Plays, label: "Plays", key: "Plays", icon: <Play/> },
                        { value: InfoType.Playtime, label: "Playtime", key: "Playtime", icon: <Clock/> },
                        { value: InfoType.Percent, label: "Percent", key: "Percent", icon: <Percent/> },
                        { value: InfoType.Fraction, label: "Fraction", key: "Fraction", icon: <Divide/> },
                        { value: null, label: "None", key: "None", icon: <EyeSlash/> },
                    ]} 
                    selectedValues={[currentInfoOperation.secondaryInfo]}
                    onSelectValues={(n) => onChangeInfoOperation({ ...currentInfoOperation, secondaryInfo: n[0]})}
                    multiSelect={false}
                    placeholder="Search..."
                />
            </OperationSection>
            { (currentInfoOperation.primaryInfo == InfoType.Percent || currentInfoOperation.primaryInfo == InfoType.Fraction || currentInfoOperation.secondaryInfo == InfoType.Percent || currentInfoOperation.secondaryInfo == InfoType.Fraction) && 
                <div className="flex flex-col gap-6">
                    <OperationSection title="Fraction of">
                        <ResponsiveControl 
                            items={[
                                { value: PercentOf.Plays, label: "Plays", key: "Plays", icon: <Play/> },
                                { value: PercentOf.Playtime, label: "Playtime", key: "Playtime", icon: <Clock/> },
                            ]}
                            selectedItem={currentInfoOperation.primaryPercent.of}
                            onSelect={(n) => onChangeInfoOperation({ ...currentInfoOperation, primaryPercent: { ...currentInfoOperation.primaryPercent, of: n}})}
                        />
                    </OperationSection>
                    <OperationSection title="Numerator">
                        <ResponsiveControl 
                            items={[
                                { value: PercentNumerator.All, label: "All", key: "All", icon: <Play/> },
                                { 
                                    value: PercentNumerator.Skipped, 
                                    label: (currentOperations.filter.filterSkipsBy == SkipFilterType.OnlySkips ? "Skips" : currentOperations.filter.filterSkipsBy == SkipFilterType.NoSkips ? "Unskipped" : "All"), 
                                    key: "Skipped", 
                                    icon: <SkipForward/>
                                }, 
                                { value: PercentNumerator.Searched, label: "Searched", key: "Searched", icon: <MagnifyingGlass/> },
                            ]}
                            selectedItem={currentInfoOperation.primaryPercent.numerator}
                            onSelect={(n) => onChangeInfoOperation({ ...currentInfoOperation, primaryPercent: { ...currentInfoOperation.primaryPercent, numerator: n}})}
                        />
                    </OperationSection>
                    <OperationSection title="Denominator">
                        <ResponsiveControl 
                            items={[
                                { value: PercentGrouping.Total, label: "Total", key: "Total", icon: <Play/> },
                                { value: PercentGrouping.Groups, label: "Group", key: "Group", icon: <SquaresFour/> },
                            ]}
                            selectedItem={currentInfoOperation.primaryPercent.grouping}
                            onSelect={(n) => onChangeInfoOperation({ ...currentInfoOperation, primaryPercent: { ...currentInfoOperation.primaryPercent, grouping: n}})}
                        />
                        <ResponsiveControl 
                            items={[
                                { value: PercentDenominator.All, label: "All", key: "All", icon: <Play/> },
                                { 
                                    value: PercentDenominator.SkipFilter, 
                                    label: (currentOperations.filter.filterSkipsBy == SkipFilterType.OnlySkips ? "Skipped" : currentOperations.filter.filterSkipsBy == SkipFilterType.NoSkips ? "Unskipped" : "All"), 
                                    key: "Skipped", 
                                    icon: <SkipForward/>
                                },
                                { value: PercentDenominator.SearchFilter, label: "Searched", key: "Searched", icon: <MagnifyingGlass/> },
                            ]}
                            selectedItem={currentInfoOperation.primaryPercent.denominator}
                            onSelect={(n) => onChangeInfoOperation({ ...currentInfoOperation, primaryPercent: { ...currentInfoOperation.primaryPercent, denominator: n}})}
                        />
                    </OperationSection>
                </div>
            }
            <OperationSection title="Show search">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <MagnifyingGlass/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentViewOptions.showSearch}
                    onSelect={(n) => onChangeViewOptions({ ...currentViewOptions, showSearch: n})}
                />
            </OperationSection>
            <OperationSection title="Show items">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <List/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentViewOptions.showItems}
                    onSelect={(n) => onChangeViewOptions({ ...currentViewOptions, showItems: n})}
                />
            </OperationSection>
            <OperationSection title="Show group ranks">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <ListNumbers/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentViewOptions.showGroupRanks}
                    onSelect={(n) => onChangeViewOptions({ ...currentViewOptions, showGroupRanks: n})}
                />
            </OperationSection>
            <OperationSection title="Show item ranks">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <ListNumbers/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentViewOptions.showItemRanks}
                    onSelect={(n) => onChangeViewOptions({ ...currentViewOptions, showItemRanks: n})}
                />
            </OperationSection>
            <OperationSection title="Show group sums">
                <ResponsiveControl 
                    items={[
                        { value: true, label: "Yes", key: "Yes", icon: <PlusCircle/> },
                        { value: false, label: "No", key: "No", icon: <EyeSlash/> },
                    ]} 
                    selectedItem={currentViewOptions.showGroupSum}
                    onSelect={(n) => onChangeViewOptions({ ...currentViewOptions, showGroupSum: n})}
                />
            </OperationSection>
            <OperationSection title="Preview info">
                <ResponsiveControl 
                    items={[
                        { value: false, label: "Songs", key: "Songs", icon: <List/> },
                        { value: true, label: "Groups", key: "Groups", icon: <Calendar/> },
                    ]} 
                    selectedItem={currentViewOptions.previewGroups}
                    onSelect={(n) => onChangeViewOptions({ ...currentViewOptions, previewGroups: n})}
                />
            </OperationSection>
        </div>
    )
}
