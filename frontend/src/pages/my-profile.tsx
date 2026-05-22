import PostFeed from "@/components/post/post-feed";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileStats from "@/components/profile/profile-stats";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProfileCounts from "@/hooks/useProfileCounts";
import { useGetMeQuery } from "@/services/user-api"
import type { ProfileTabSectionProps } from "@/types";
import { ArrowBigDownDash, ArrowBigUpDash, Bookmark, Loader2, SquareDashedBottom } from "lucide-react";

const MyProfile = () => {
    const { data, isLoading } = useGetMeQuery();

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
    const userId = profileUser._id;

    const { counts } = useProfileCounts(userId);

    return (
        <Card className="max-w-3xl rounded-none mx-auto p-0 pb-4">
            <ProfileHeader user={profile.user} />

            <div className="px-4 space-y-6">
                <ProfileStats stats={profile.stats} />

                <ProfileTabSection userId={userId} counts={counts} />
            </div>
        </Card >
    )
}

const ProfileTabSection = ({ userId, counts }: ProfileTabSectionProps) => {
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
                        <Badge className="ml-2 py-1 px-1.5">{counts?.voted ?? 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="bookmark-post" className="py-4 gap-0 cursor-pointer hover:bg-muted">
                        <Bookmark className="size-6" />
                        <span className="sr-only">Bookmark posts</span>
                        <Badge className="ml-2 py-1 px-1.5">{counts?.bookmarked ?? 0}</Badge>
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="post-feed">
                <PostFeed userId={userId} type="user" />
            </TabsContent>
            <TabsContent value="voted-post">
                <PostFeed type="voted" />
            </TabsContent>
            <TabsContent value="bookmark-post">
                <PostFeed type="bookmarked" />
            </TabsContent>
        </Tabs>
    )
}

export default MyProfile