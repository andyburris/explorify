import { CaretCircleDown, CaretCircleUp } from "phosphor-react-sc";

export function ExpandItem({ isExpanded, amountRemaining, onClick }: { isExpanded: boolean, amountRemaining: number, onClick: () => void }) {
    return (
        <div className="flex gap-3 items-center hover:bg-neutral-100 rounded-lg cursor-pointer min-h-[64px] -mx-3 px-3 group" onClick={onClick}>
            <div className="flex w-10 h-10 bg-neutral-100 group-hover:bg-neutral-200 rounded-md justify-center items-center text-neutral-500">
                {isExpanded ? <CaretCircleUp size="24px"/> : <CaretCircleDown size="24px"/>}
            </div>
            <p className="font-semibold text-neutral-500">{isExpanded ? "Show less" : `Show ${amountRemaining} more ${amountRemaining == 1 ? "item" : "items"}`}</p>
        </div>
    )
}