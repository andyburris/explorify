import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { StaticButton } from './button/Button';

export interface Segment<T> {
    item: T,
    title: string,
    key?: string,
    icon: React.ReactNode,
}
const toggleGroupItemClasses = "flex-grow"
// const toggleGroupItemClasses = 'hover:bg-violet3 color-mauve11 data-[state=on]:bg-violet6 data-[state=on]:text-violet12 flex h-[35px] w-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none';

export function SegmentedControl<T>({ items, selectedItem, onSelect }: { items: Segment<T>[], selectedItem: T, onSelect: (item: T) => void }) {
    return (
        <ToggleGroup.Root
        className="flex bg-neutral-50 border border-neutral-200 rounded-full"
        type="single"
        defaultValue="center"
        aria-label="Text alignment"
        onValueChange={v => onSelect(items.find(i => (i.key ?? i.title) == v)!.item)}
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