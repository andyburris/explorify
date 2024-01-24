"use client"

import * as SwitchPrimitive from '@radix-ui/react-switch';

export function Switch({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (checked: boolean) => void}) {
    return (
        <SwitchPrimitive.Root checked={checked} onCheckedChange={onCheckedChange} className="w-11 h-7 bg-neutral-100 border border-neutral-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-200 rounded-full p-0.5 flex data-[state=checked]:justify-end">
            <SwitchPrimitive.Thumb className='block w-[22px] h-[22px] bg-white rounded-full shadow-outset'/>
        </SwitchPrimitive.Root>
    )
}