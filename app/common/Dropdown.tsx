import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

export interface DropdownItem {
    icon: React.ReactNode,
    title: string,
    onClick?: () => void,
    linkPath?: string,
    hide?: boolean,
}
export function Dropdown({ trigger, menuItems }: { trigger: React.ReactNode, menuItems: DropdownItem[] }) {
    return (
        <DropdownMenu.Root>
        <DropdownMenu.Trigger className='rounded-full'>
            {trigger}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white shadow-outset p-1 rounded-2xl w-64 overflow-hidden" align='end' sideOffset={8}>
                {menuItems.filter(i => i.hide != true).map((item) => 
                    <DropdownMenu.Item 
                        key={item.title} 
                        onClick={item.onClick !== undefined ? () => item.onClick?.() : undefined}
                        disabled={item.onClick === undefined}
                        // asChild={item.linkPath !== undefined}
                        className="outline-none focus:bg-neutral-100 rounded-xl"
                    >
                        { item.linkPath &&
                            <Link href={item.linkPath}><ItemContent item={item}/></Link>
                            // <ItemContent item={item}/>
                        }
                        { item.linkPath === undefined &&
                            <ItemContent item={item}/>
                        }
                    </DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
    )
}

function ItemContent({ item }: { item: DropdownItem }) {
    return (
        <div className={"flex gap-3 px-3 py-3 items-center rounded-xl" + ((item.onClick === undefined && item.linkPath === undefined) ? " cursor-default" : " cursor-pointer")}>
            <div className="text-2xl text-neutral-500">
                {item.icon}
            </div>
            <p className={`` + ((item.onClick === undefined && item.linkPath === undefined) ? "text-neutral-500" : "")}>
                {item.title}
            </p>
        </div>
    )
}