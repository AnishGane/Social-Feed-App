import ProfileHeader from "@/components/profile/profile-header";
import ProfileStats from "@/components/profile/profile-stats";
import ProfileTabSection from "@/components/profile/profile-tab-section";
import { Card } from "@/components/ui/card";
import useProfileCounts from "@/hooks/useProfileCounts";
import { useGetMeQuery } from "@/services/user-api"
import { Loader2 } from "lucide-react";

const MyProfile = () => {
    const { data, isLoading } = useGetMeQuery();

    const userId = data?.data?.user?._id;
    const { counts } = useProfileCounts(userId);

    if (isLoading) {
        return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center" role="status" aria-live="polite">
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading profile</span>
        </div>;
    }

    if (!data?.data) {
        return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">User not found</div>;
    }

    const profile = data.data;
    const profileUser = profile.user

    return (
        <Card className="max-w-3xl rounded-none mx-auto p-0 pb-4">
            <ProfileHeader user={profileUser} />

            <div className="px-4 space-y-6">
                <ProfileStats stats={profile.stats} />

                <ProfileTabSection userId={userId} counts={counts} />
            </div>
        </Card >
    )
}

export default MyProfile