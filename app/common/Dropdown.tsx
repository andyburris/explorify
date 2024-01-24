import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

export interface DropdownItem {
    icon: React.ReactNode,
    title: string,
    onClick?: () => void,
    linkPath?: string,
}
export function Dropdown({ trigger, menuItems }: { trigger: React.ReactNode, menuItems: DropdownItem[] }) {
    return (
        <DropdownMenu.Root>
        <DropdownMenu.Trigger className='rounded-full'>
            {trigger}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white shadow-outset py-2 rounded-2xl w-64 overflow-hidden" align='end' sideOffset={8}>
                {menuItems.map((item) => 
                    <DropdownMenu.Item 
                        key={item.title} 
                        onClick={item.onClick !== undefined ? () => item.onClick?.() : undefined}
                        disabled={item.onClick === undefined}
                        asChild={item.linkPath !== undefined}
                        className="outline-none"
                    >
                        <Link 
                            href={item.linkPath ?? ""}
                            className={"flex gap-3 px-4 py-3 items-center" + ((item.onClick === undefined && item.linkPath === undefined) ? "" : " hover:bg-neutral-100 focus:bg-neutral-100 cursor-pointer")}
                            >
                            <div className="text-2xl text-neutral-500">
                                {item.icon}
                            </div>
                            <p className={`` + ((item.onClick === undefined && item.linkPath === undefined) ? "text-neutral-500" : "")}>
                                {item.title}
                            </p>
                        </Link>
                    </DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
    )
}