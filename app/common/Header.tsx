export function Header(
    { icon, title, description, actions }: { icon: React.ReactNode, title: string, description: string, actions?: React.ReactNode }
) {
    return (
        <div className="flex flex-col gap-3 w-full">
            {icon}
            <div className="flex items-end justify-between gap-4 w-full flex-wrap">
                <div className="flex flex-col gap-2 min-w-64 basis-64 flex-grow">
                    <p className="text-5xl/[50px] font-serif font-semibold tracking-tight">{title}</p>
                    <p className="text-neutral-500">{description}</p>
                </div>
                { actions ?? actions }
            </div>
        </div>
    )
}