import type { Post } from "@/types";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

import VoteButtons from "./vote-buttons";
import UserAvatar from "../user-avatar";
import { EllipsisVertical, MessageSquare, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { formatPostDate } from "@/utils/format-date";
import { useState } from "react";
import { Button } from "../ui/button";
import { useGetMeQuery } from "@/services/user-api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditPostDialog from "./edit-post-dialog";
import AlertDialogComp from "../alert-dialog-comp";
import { Link, useLocation } from "react-router-dom";
import BookmarkButton from "./bookmark-button";

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

    const pathname = useLocation().pathname;
    const isMeProfile = pathname === "/u/me";

    const visitProfile = isOwner ? `/u/me` : `/u/${post.author.username}`;

    return (

        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                            <UserAvatar seed={post.author._id} className="size-8" />
                        </div>

                        <div className="flex items-center justify-between w-full">
                            <Link to={visitProfile} className="flex flex-col">
                                <h3 className="font-semibold text-base">
                                    {post.author.name}
                                </h3>
                                <p className="text-xs text-muted-foreground tracking-wide">@{post.author.username}</p>
                            </Link>

                        </div>
                    </div>
                    {isOwner && isMeProfile && (
                        <PostCardDropdownMenus post={post} />
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Link to={`/p/${post._id}`} className="cursor-pointer">
                        <h2 className="text-xl font-semibold">
                            {post.title}
                        </h2>

                        <p
                            className={`mt-2 whitespace-pre-wrap text-justify text-sm text-muted-foreground transition-all ${shouldClamp && !expanded
                                ? "line-clamp-3"
                                : ""}`}>
                            {post.content}
                        </p>
                    </Link>

                    {shouldClamp && post.content.length > 180 && (
                        <Button
                            variant="link"
                            className="h-auto p-0 mt-1 text-sm cursor-pointer text-primary/90 hover:text-primary"
                            onClick={() => setExpanded(!expanded)}
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


            <CardFooter className="flex items-center justify-between py-3!">
                <div className="flex flex-col gap-2">
                    <p className="text-[13px] text-muted-foreground">
                        {formatPostDate(post.createdAt)}
                    </p>
                    <VoteButtons
                        post={post}
                        onVoteUpdate={onVoteUpdate}
                    />
                </div>

                <div className="flex items-center justify-center gap-3">
                    <span title="Comments" className="text-base text-foreground flex items-center justify-center gap-1">
                        <MessageSquare className="size-4.5" />{post.commentCount}
                    </span>

                    <span title="Score" className="text-base text-foreground flex items-center justify-center gap-1">
                        {post.score >= 0 ? <TrendingUp className="size-5 " /> : post.score < 0 ? <TrendingDown className="size-4.5" /> : null}
                        {post.score}
                    </span>

                    <BookmarkButton
                        postId={post._id}
                        isBookmarked={post.isBookmarked ?? false}
                        bookmarksCount={post.bookmarksCount}
                    />
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
                    className="cursor-pointer rounded-full px-2 ml-1"
                    aria-label="Post actions"
                >
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <EditPostDialog post={post} />

                <DropdownMenuSeparator />

                <AlertDialogComp
                    icon={Trash2}
                    title="Are you sure you want to delete this post?"
                    description="This action cannot be undone. If you once deleted a post, you can't recover it."
                    iconLabel="Delete Post"
                    post={post} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PostCard;