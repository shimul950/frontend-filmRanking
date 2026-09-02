import { redirect } from "next/navigation";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import MyProfileForm from "@/components/modules/auth/MyProfileForm";


export default async function MyProfilePage() {
    const user = await getMeAction();

    if (!user) {
        redirect("/login");
    }

    const profileUser = {
        ...user,
        createdAt: new Date().toISOString(),
    };

    return (
        <div className="py-6">
            <MyProfileForm user={profileUser} />
        </div>
    );
}