import type { Post } from "@/types";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import VoteButtons from "./vote-buttons";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatPostDate } from "@/utils/format-date";
import { useState } from "react";
import { Button } from "../ui/button";
import { useGetMeQuery } from "@/services/user-api";
import { Link, useLocation } from "react-router-dom";
import BookmarkButton from "./bookmark-button";
import OwnerPostDropDown from "./owner-post-dropdown";
import SharePostDropdown from "./share-post-dropdown";
import CommentSheet from "../comment/comment-sheet";
import PostAuthorInfo from "../post-author-info";

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

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <PostAuthorInfo authorId={post.author._id} name={post.author.name} username={post.author.username} />

                    {isOwner && isMeProfile ? <OwnerPostDropDown post={post} /> : <SharePostDropdown post={post} />}
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

                    <CommentSheet post={post} />

                    <span title="Score" className="text-base text-foreground flex items-center justify-center gap-1">
                        {post.score >= 0 ? <TrendingUp className="size-5 " /> : post.score < 0 ? <TrendingDown className="size-4.5" /> : null}
                        {post.score}
                    </span>

                    <BookmarkButton
                        post={post}
                        onBookmarkUpdate={onVoteUpdate}
                    />
                </div>
            </CardFooter>
        </Card>
    );
};



export default PostCard;