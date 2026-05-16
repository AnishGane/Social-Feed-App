import PostFeed from "@/components/post/post-feed";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileStats from "@/components/profile/profile-stats";
import { Card } from "@/components/ui/card";
import { useGetProfileQuery } from "@/services/user-api";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const { username } = useParams();

    if (!username) {
        return <div>Invalid profile URL</div>;
    }

    const { data, isLoading } = useGetProfileQuery(username);

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

    return (
        <Card className="max-w-3xl rounded-none mx-auto p-0">
            <ProfileHeader user={profile.user} />

            <div className="px-4 space-y-6">
                <ProfileStats stats={profile.stats} />

                <PostFeed userId={profile.user._id} />
            </div>
        </Card>
    )
}

export default ProfilePage