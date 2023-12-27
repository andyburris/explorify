import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { StaticButton } from './button/Button';

export interface Segment<T> {
    value: T,
    label: string,
    key: string,
    icon: React.ReactNode,
}
const toggleGroupItemClasses = "flex-grow"

export function SegmentedControl<T>({ items, selectedItem, onSelect }: { items: Segment<T>[], selectedItem: T, onSelect: (item: T) => void }) {
    return (
        <ToggleGroup.Root
        className="flex bg-neutral-50 border border-neutral-200 rounded-full"
        type="single"
        defaultValue="center"
        aria-label="Text alignment"
        onValueChange={v => {
            const item = items.find(i => (i.key ?? i.label) == v)
            if(item != null) onSelect(item.value)
        }}
      >
        {items.map((item) => {
            return <ToggleGroup.Item 
                key={item.key ?? item.label}
                className={toggleGroupItemClasses} 
                value={item.key ?? item.label} 
                aria-label="Left aligned"
            >
                <StaticButton 
                    icon={item.icon} 
                    text={item.label} 
                    hideShadow={item.value != selectedItem} 
                    className={"h-8 " + (item.value == selectedItem ? "bg-white" : "hover:bg-neutral-200")}
                />
            </ToggleGroup.Item>
        })}
      </ToggleGroup.Root>
    )
}