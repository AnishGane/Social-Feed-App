import type { Post } from "@/types";
import { Card } from "../ui/card";
import UserAvatar from "../user-avatar";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

type Props = {
    post: Post;
};

const PostDetailSidebar = ({ post }: Props) => {
    return (
        <div className="space-y-4 sticky top-6">
            {/* Author Card */}
            <Card className="p-5 space-y-1">
                <h2 className="font-semibold text-lg">About Author</h2>

                <Separator />

                <div className="flex items-center gap-3">
                    <UserAvatar seed={post.author._id} className="size-10" />

                    <Link to={`/u/${post.author.username}`}>
                        <h3 className="font-medium">
                            {post.author.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            @{post.author.username}
                        </p>
                    </Link>
                </div>

                {post.author.bio && (
                    <div>
                        <h2 className="font-semibold text-base">Author Bio</h2>
                        <p className="text-sm text-muted-foreground leading-6">
                            {post.author.bio}
                        </p>
                    </div>
                )}

            </Card >

            {/* Engagement Card */}
            < Card className="p-5 space-y-2" >
                <h2 className="font-semibold text-lg">
                    Engagement
                </h2>

                <Separator />

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        Votes
                    </span>

                    <span className="font-medium">
                        {post.score}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        Comments
                    </span>

                    <span className="font-medium">
                        {post.commentCount}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        Bookmarks
                    </span>

                    <span className="font-medium">
                        {post.bookmarksCount ?? 0}
                    </span>
                </div>
            </Card >
        </div >
    );
};

export default PostDetailSidebar;