import PostFeed from "@/components/post/post-feed";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileStats from "@/components/profile/profile-stats";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMeQuery } from "@/services/user-api"
import { ArrowBigDownDash, ArrowBigUpDash, Bookmark, Loader2, SquareDashedBottom } from "lucide-react";

const MyProfile = () => {
    const { data, isLoading } = useGetMeQuery();
    // const userData = useAppSelector(state => state.auth.user);

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
        <Card className="max-w-3xl rounded-none mx-auto p-0 pb-4">
            <ProfileHeader user={profile.user} />

            <div className="px-4 space-y-6">
                <ProfileStats stats={profile.stats} />

                <ProfileTabSection profile={profile} />
            </div>
        </Card >
    )
}

const ProfileTabSection = ({ profile }) => {
    return (
        <Tabs defaultValue="post-feed">
            <div className="border border-border rounded-xl px-1 py-1.5 mb-2">
                <TabsList className="w-full bg-transparent gap-1">
                    <TabsTrigger value="post-feed" className="py-4 cursor-pointer hover:bg-muted rounded-sm">
                        <SquareDashedBottom className="size-6" />
                        <span className="sr-only">Posts</span>
                    </TabsTrigger>
                    <TabsTrigger value="voted-post" className="py-4 gap-0 cursor-pointer hover:bg-muted">
                        <div>
                            <ArrowBigUpDash className="size-6" />
                            <span className="sr-only">Voted posts</span>
                        </div>
                        <div>
                            <ArrowBigDownDash className="size-6" />
                            <span className="sr-only">Voted posts</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="bookmark-post" className="py-4 gap-0 cursor-pointer hover:bg-muted">
                        <Bookmark className="size-6" />
                        <span className="sr-only">Bookmark posts</span>
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="post-feed">
                <PostFeed userId={profile.user._id} type="user" />
            </TabsContent>
            <TabsContent value="voted-post">
                <PostFeed type="voted" />
            </TabsContent>
            <TabsContent value="bookmark-post">Bookmarked posts by user will be here.</TabsContent>
        </Tabs>
    )
}

export default MyProfile