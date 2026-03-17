export const dynamic = "force-dynamic";

import { hasUserProfile } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isProfileComplete = await hasUserProfile();

    if (isProfileComplete) {
        redirect("/dashboard");
    }

    return <>{children}</>;
}
