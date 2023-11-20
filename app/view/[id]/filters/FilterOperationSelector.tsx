import { SegmentedControl } from "@/app/common/SegmentedControl";
import { CombineInto, CombineType, FilterOperation, GroupOperation, SkipFilterType } from "@/app/data/model/Operations";
import { GroupType } from "@/app/data/model/Group";
import { ArrowsInLineVertical, ArrowsOutLineVertical, Calendar, CalendarBlank, Clock, ClockCounterClockwise, List, MusicNote, SortAscending, SortDescending, User, Users } from "phosphor-react-sc";
import { OperationSection } from "./OperationsSelector";

export function FilterOperationSelector({ currentOperation, onChangeOperation }: { currentOperation: FilterOperation, onChangeOperation: (newFilter: FilterOperation) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <OperationSection title="Filter skips by" description="Spotify counts plays as songs you played for at least 30 seconds">
                <SegmentedControl 
                    items={[
                        { item: SkipFilterType.All, title: "All", icon: <List/> },
                        { item: SkipFilterType.NoSkips, title: "No skips", icon: <Clock/> },
                        { item: SkipFilterType.OnlySkips, title: "Only skips", icon: <CalendarBlank/> },
                    ]} 
                    selectedItem={currentOperation.filterSkipsBy}
                    onSelect={(n) => onChangeOperation({ ...currentOperation, filterSkipsBy: n})}
                />
            </OperationSection>
        </div>
    )
}