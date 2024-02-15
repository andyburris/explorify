import { CaretCircleDown, CaretCircleUp } from "phosphor-react-sc";

export function ExpandItem({ isExpanded, amountRemaining, onClick }: { isExpanded: boolean, amountRemaining: number, onClick: () => void }) {
    return (
        <button className="flex gap-4 items-center hover:bg-neutral-100 rounded-lg cursor-pointer min-h-[64px] -mx-3 px-3 group w-full" onClick={onClick}>
            <div className="flex w-10 bg-neutral-100 group-hover:bg-neutral-200 justify-center items-center text-neutral-500 -ml-4 sm:ml-0 h-8 sm:h-10 rounded-e-2xl sm:rounded-md">
                {isExpanded ? <CaretCircleUp size="24px"/> : <CaretCircleDown size="24px"/>}
            </div>
            <p className="font-semibold text-neutral-500">{isExpanded ? "Show less" : `Show ${amountRemaining} more ${amountRemaining == 1 ? "item" : "items"}`}</p>
        </button>
    )
}