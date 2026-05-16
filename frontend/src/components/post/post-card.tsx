import type { Post } from "@/types";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

import VoteButtons from "./vote-buttons";
import UserAvatar from "../user-avatar";
import { EllipsisVertical, MessageCircleMore, Trash2, TrendingUp } from "lucide-react";
import { formatPostDate } from "@/utils/format-date";
import { useState } from "react";
import { Button } from "../ui/button";
import { useGetMeQuery } from "@/services/user-api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditPostDialog from "./edit-post-dialog";

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
    const [expanded, setExpanded] = useState(false);

    // only enable 'show more' when post has image
    const shouldClamp = !!post.mainImage;

    const me = useGetMeQuery().data?.data;
    const isOwner = me?.user._id === post.author._id;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                            <UserAvatar seed={post.author.username} className="size-8" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-base">
                                {post.author.username}
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                {formatPostDate(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <PostCardDropdownMenus post={post} />
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {post.title}
                    </h2>

                    <p
                        className={`mt-2 whitespace-pre-wrap text-sm text-muted-foreground transition-all ${shouldClamp && !expanded
                            ? "line-clamp-3"
                            : ""
                            }`}
                    >
                        {post.content}
                    </p>

                    {shouldClamp && post.content.length > 180 && (
                        <Button
                            variant="link"
                            className="h-auto p-0 mt-1 text-sm cursor-pointer text-primary/90 hover:text-primary"
                            onClick={() => setExpanded((prev) => !prev)}
                        >
                            {expanded ? "Show less" : "Show more"}
                        </Button>
                    )}
                </div>

                {post.mainImage && (
                    <img
                        src={post.mainImage}
                        alt={post.title}
                        className="w-full rounded-xl object-cover select-none"
                        draggable={false}
                    />
                )}

                {!!post.tags?.length && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-muted font-semibold tracking-wide px-3 py-1 text-xs"
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

                <div className="flex items-center justify-center gap-2">
                    <span title="Comments" className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <MessageCircleMore className="size-5" />{post.commentCount}
                    </span>

                    <div className="size-[3px] mt-0.5 rounded-full bg-muted-foreground" />

                    <span title="Score" className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <TrendingUp className="size-5" /> {post.score}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
};

const PostCardDropdownMenus = ({
    post,
}: {
    post: Post;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    aria-label="Post actions"
                >
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <EditPostDialog post={post} />

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive">
                    <Trash2 />
                    Delete Post
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PostCard;