import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { StaticButton } from './button/Button';

export interface Segment<T> {
    item: T,
    title: string,
    key?: string,
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
            const item = items.find(i => (i.key ?? i.title) == v)
            if(item != null) onSelect(item.item)
        }}
      >
        {items.map((item) => {
            return <ToggleGroup.Item 
                key={item.key ?? item.title}
                className={toggleGroupItemClasses} 
                value={item.key ?? item.title} 
                aria-label="Left aligned"
            >
                <StaticButton 
                    icon={item.icon} 
                    text={item.title} 
                    hideShadow={item.item != selectedItem} 
                    className={"h-8 " + (item.item == selectedItem ? "bg-white" : "hover:bg-neutral-200")}
                />
            </ToggleGroup.Item>
        })}
      </ToggleGroup.Root>
    )
}