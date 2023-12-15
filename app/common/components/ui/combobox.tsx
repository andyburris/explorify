"use client"

import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { Button } from "../../button/Button"
import { cn } from "../utils/utils"
import { ArrowsDownUp, ArrowsOut, Check, Plus } from "phosphor-react-sc"

export interface ComboboxOption<T> { key: string, label: string, value: T, icon: React.ReactNode }
export function Combobox<T>({ options, selectedValues, onSelectValues, placeholder, multiSelect }: { options: ComboboxOption<T>[], selectedValues: T[], onSelectValues: (values: T[]) => void, placeholder: string, multiSelect: boolean }) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter(o => selectedValues.includes(o.value))
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex items-center gap-3 w-full p-4 rounded-xl border border-neutral-200 justify-between cursor-pointer"
        >
          <div className="flex gap-3 items-center flex-wrap text-neutral-500">
            {selectedOptions.length
              ? selectedOptions.map((o, i) => <div className="flex items-center gap-2" key={o.key}>{o.icon}{o.label}{i == selectedOptions.length - 1 ? "" : ", "}</div>)
              : placeholder}
          </div>
          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-outset bg-white rounded-xl">
        <Command>
          <CommandInput placeholder={placeholder} className="p-3 outline-none focus:ring-2 rounded-t-xl" />
          <CommandEmpty className="p-3">No options found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                className="flex gap-3 justify-between items-center p-3 data-[selected=true]:bg-neutral-100 cursor-pointer"
                key={option.key}
                value={option.key}
                onSelect={(currentValue) => {
                    if(multiSelect) {
                        onSelectValues(selectedOptions.includes(option) ? selectedValues.filter(v => v != option.value) : [...selectedValues, option.value])
                    } else {
                        onSelectValues(selectedOptions.includes(option) ? [] : [option.value])
                    }
                  setOpen(false)
                }}
              >
                {option.label}
                <Check className={selectedOptions.includes(option) ? "opacity-100" : "opacity-0"}/>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
