import { Container } from "../common/Container";
import { Header } from "../common/Header";
import { Logo } from "../common/Logo";

export function LoadingPage() {
    return (
        <Container>
            <Header
                icon={<Logo/>}
                title="Spotify Data Explorer"
                // description="by Lyrical"
                actions={
                    <div className="px-3 py-2 text-neutral-500 border border-neutral-300 rounded-full">
                        <p>Loading...</p>
                    </div>
                }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                <div className="bg-neutral-100 rounded-2xl w-full h-44"></div>
                <div className="bg-neutral-100 rounded-2xl w-full h-44"></div>
                <div className="bg-neutral-100 rounded-2xl w-full h-44"></div>
                <div className="bg-neutral-100 rounded-2xl w-full h-44"></div>
                <div className="bg-neutral-100 rounded-2xl w-full h-44"></div>
            </div>
        </Container>
    )
}