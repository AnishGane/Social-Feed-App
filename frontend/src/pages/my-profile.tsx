import PostFeed from "@/components/post/post-feed";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileStats from "@/components/profile/profile-stats";
import { Card } from "@/components/ui/card";
import { useGetMeQuery } from "@/services/user-api"

const MyProfile = () => {
    const { data, isLoading } = useGetMeQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data?.data) {
        return <div>User not found</div>;
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

export default MyProfile