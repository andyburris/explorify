import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface DropdownItem {
    icon: React.ReactNode,
    title: string,
    onClick: () => void
}
export function Dropdown({ trigger, menuItems }: { trigger: React.ReactNode, menuItems: DropdownItem[] }) {
    return (
        <DropdownMenu.Root>
        <DropdownMenu.Trigger >
            {trigger}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white shadow-outset py-2 rounded-2xl" align='end' sideOffset={8}>
                {menuItems.map((item) => 
                    <DropdownMenu.Item 
                        key={item.title} 
                        onClick={() => item.onClick()}
                        className="flex gap-3 px-4 py-3 items-center hover:bg-stone-100 focus:bg-stone-200 cursor-pointer"
                    >
                        {item.icon}
                        {item.title}
                    </DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
    )
}