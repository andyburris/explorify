import { MagnifyingGlass } from "phosphor-react-sc"

export function NoResultsItem() {
    return (
        <div className="flex flex-col gap-3 p-4 mt-4">
            <MagnifyingGlass weight="duotone" className="text-neutral-500 text-3xl" />
            <p className="font-serif font-semibold text-3xl tracking-tight">No results</p>
        </div>
    )
}