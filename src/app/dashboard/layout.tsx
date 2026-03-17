export const dynamic = "force-dynamic";

import { hasUserProfile } from "@/actions/user";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isProfileComplete = await hasUserProfile();

    if (!isProfileComplete) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen pt-24 pb-48 relative overflow-hidden">
            {/* Dashboard Ambient Glow removed for clean UI */}

            <Navbar />
            <main className="max-w-7xl mx-auto px-6 relative z-10 mt-6">
                {children}
            </main>
        </div>
    );
}
