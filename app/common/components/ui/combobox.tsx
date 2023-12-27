"use client"

import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { Button } from "../../button/Button"
import { cn } from "../utils/utils"
import { ArrowsDownUp, ArrowsIn, ArrowsOut, CaretUpDown, Check, Minus, Plus } from "phosphor-react-sc"
import { ActionButton } from "../../button/ActionButton"

export interface ComboboxOption<T> { key: string, label: string, value: T, icon: React.ReactNode }
export function Combobox<T>({ options, selectedValues, onSelectValues, placeholder, multiSelect }: { options: ComboboxOption<T>[], selectedValues: T[], onSelectValues: (values: T[]) => void, placeholder: string, multiSelect: boolean }) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter(o => selectedValues.includes(o.value))

  if(!open) {
    return (
      <div
        className="flex items-center gap-3 w-full p-4 rounded-xl border border-neutral-200 justify-between cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex gap-3 items-center flex-wrap text-neutral-500">
          {selectedOptions.length
            ? selectedOptions.map((o, i) => <div className="flex items-center gap-2" key={o.key}>{o.icon}{o.label}{i == selectedOptions.length - 1 ? "" : ", "}</div>)
            : placeholder}
        </div>
        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </div>
    )
  } else {
    return (
      <Command className="w-full p-0 border border-neutral-200 bg-white rounded-xl">
        <div className="flex items-center p-1 focus:ring-2 rounded-t-xl w-full border-b border-neutral-200">
          <CommandInput placeholder={placeholder} className="p-3 outline-none w-full bg-transparent"/>
          <ActionButton onClick={() => setOpen(false)} icon={<Minus/>} hideShadow/>
        </div>
        <CommandEmpty className="p-3">No options found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              className="flex gap-3 items-center p-3 data-[selected=true]:bg-neutral-100 cursor-pointer"
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
              {option.icon && option.icon}
              <p className="flex-grow">{option.label}</p>
              <Check className={selectedOptions.includes(option) ? "opacity-100" : "opacity-0"}/>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    )
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-outset bg-white rounded-xl">
        
      </PopoverContent>
    </Popover>
  )
}
