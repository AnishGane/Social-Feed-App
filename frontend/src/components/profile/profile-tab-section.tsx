import type { ProfileTabSectionProps } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ArrowBigDownDash, ArrowBigUpDash, Bookmark, SquareDashedBottom } from "lucide-react"
import { Badge } from "../ui/badge"
import PostFeed from "../post/post-feed"

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
                        <Badge className="ml-2 p-1.5 text-[9px]">{counts?.voted ?? 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="bookmark-post" className="py-4 gap-0 cursor-pointer hover:bg-muted">
                        <Bookmark className="size-6" />
                        <span className="sr-only">Bookmark posts</span>
                        <Badge className="ml-2 text-[9px] p-1.5">{counts?.bookmarked ?? 0}</Badge>
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

export default ProfileTabSection