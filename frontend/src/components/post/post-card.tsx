// components/post/post-card.tsx

import type { Post } from "@/types";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

import VoteButtons from "./vote-buttons";
import UserAvatar from "../user-avatar";

type Props = {
    post: Post;

    onVoteUpdate: (
        postId: string,
        updates: Partial<Post>
    ) => void;
};

const PostCard = ({
    post,
    onVoteUpdate,
}: Props) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                        <UserAvatar seed={post.author.username} />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            {post.author.username}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            {new Date(
                                post.createdAt
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {post.title}
                    </h2>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {post.content}
                    </p>
                </div>

                {post.mainImage && (
                    <img
                        src={post.mainImage}
                        alt={post.title}
                        className="w-full rounded-xl object-cover"
                    />
                )}

                {!!post.tags?.length && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-muted px-3 py-1 text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <VoteButtons
                    post={post}
                    onVoteUpdate={onVoteUpdate}
                />

                <span className="text-sm text-muted-foreground">
                    {post.commentCount} comments
                </span>
            </CardFooter>
        </Card>
    );
};

export default PostCard;