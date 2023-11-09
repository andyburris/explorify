export function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <main className={"p-4 sm:px-12 sm:py-8 max-w-3xl mx-auto flex flex-col gap-4" + (className ? ` ${className}` : "")}>
            {children}
        </main>
    )
}