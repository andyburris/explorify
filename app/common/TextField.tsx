export function TextField({ currentValue, placeholder, onChangeValue }: { currentValue: string, placeholder: string, onChangeValue: (newValue: string) => void}) {
    return (
        <input 
            className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl" 
            placeholder={placeholder}
            value={currentValue}
            onChange={e => onChangeValue(e.currentTarget.value)}    
        />
    )
}