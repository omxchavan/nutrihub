import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
            <div className="clay-panel p-2 rounded-[2rem]">
                <SignUp />
            </div>
        </div>
    );
}
