"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { Button } from "../../button/Button"
import { cn } from "../utils/utils"
import { ArrowsDownUp, ArrowsIn, ArrowsOut, CaretDown, CaretUp, CaretUpDown, Check, Minus, Plus } from "phosphor-react-sc"
import { ActionButton } from "../../button/ActionButton"
import { useRef, useState } from "react"

export interface ComboboxOption<T> { key: string, label: string, value: T, icon: React.ReactNode }
export function Combobox<T>({ options, selectedValues, onSelectValues, placeholder, multiSelect }: { options: ComboboxOption<T>[], selectedValues: T[], onSelectValues: (values: T[]) => void, placeholder: string, multiSelect: boolean }) {
  const [open, setOpen] = useState(false)
  const closedRef = useRef<HTMLButtonElement>(null)

  const selectedOptions = options.filter(o => selectedValues.includes(o.value))

  const trigger = (
    <button
      className={"flex items-center gap-3 w-full p-4 rounded-xl border border-neutral-200 justify-between cursor-pointer" + (open ? " hidden" : "")}
      onClick={() => setOpen(true)}
      ref={closedRef}
    >
      <div className="flex gap-3 items-center flex-wrap">
        {selectedOptions.length
          ? selectedOptions.map((o, i) => 
            <div className="flex items-center gap-2" key={o.key}>
              <span className="text-neutral-500">{o.icon}</span>
              <p>{o.label}<span className="text-neutral-500">{i == selectedOptions.length - 1 ? "" : ", "}</span></p>
            </div>)
          : placeholder}
      </div>
      { multiSelect ? <Plus className="ml-2 h-5 w-5 shrink-0 opacity-50" /> : <CaretDown className="ml-2 h-5 w-5 shrink-0 opacity-50" /> }
      
    </button>
  )
  const input = (
    <Command 
      className="w-full p-0 border border-neutral-200 bg-white rounded-xl" 
      >
      <div className="flex items-center p-1 focus:ring-2 rounded-t-xl w-full border-b border-neutral-200">
        <CommandInput placeholder={placeholder} className="p-3 outline-none w-full bg-transparent" autoFocus/>
        <ActionButton onClick={() => setOpen(false)} icon={<CaretUp/>} hideShadow/>
      </div>
      <CommandEmpty className="p-3">No options found.</CommandEmpty>
      <CommandGroup className="p-1">
        {options.map((option) => (
          <CommandItem
            className="flex gap-3 items-center px-3 py-3 rounded-lg data-[selected=true]:bg-neutral-100 cursor-pointer"
            key={option.key}
            value={option.key}
            onSelect={(currentValue) => {
                if(multiSelect) {
                    onSelectValues(selectedOptions.includes(option) ? selectedValues.filter(v => v != option.value) : [...selectedValues, option.value])
                } else {
                    onSelectValues(selectedOptions.includes(option) ? [] : [option.value])
                }
              setOpen(false)
              setTimeout(() => closedRef.current?.focus(), 0)
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
  
  return (
    <div 
      onKeyUp={e => { 
        if(e.key == "Escape") {
          setOpen(false)
          setTimeout(() => closedRef.current?.focus(), 0)
        }
      }}>
      {trigger}
      {open && input}
    </div>
  )
}
