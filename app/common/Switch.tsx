"use client"

import * as SwitchPrimitive from '@radix-ui/react-switch';

export function Switch() {
    return (
        <SwitchPrimitive.Root className="w-11 h-8 bg-stone-100 data-[state=checked]:bg-green-600 rounded-full">
            <SwitchPrimitive.Thumb className='block w-7 h-7 bg-white rounded-full'/>
        </SwitchPrimitive.Root>
    )
}