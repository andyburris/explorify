import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface DropdownItem {
    icon: React.ReactNode,
    title: string,
    onClick: () => void
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
                        onClick={() => item.onClick()}
                        className="flex gap-3 px-4 py-3 items-center hover:bg-stone-100 focus:bg-stone-100 cursor-pointer outline-none"
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