import type { Post } from "@/types";
import { MessageCircle, Clock3, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import PostAuthorInfo from "../post-author-info";
import { Separator } from "../ui/separator";
import { formatPostDate } from "@/utils/format-date";
import VoteButtons from "../post/vote-buttons";
import ShareButton from "../post/share-button";
import BookmarkButton from "../post/bookmark-button";

type Props = {
    post: Post;
    onVoteUpdate?: (
        postId: string,
        updates: Partial<Post>
    ) => void;
};

const PostDetailCard = ({ post, onVoteUpdate }: Props) => {
    return (
        <Card className="overflow-hidden border-border/60">
            {post.mainImage && (
                <div className="aspect-16/7 overflow-hidden border-b -mt-4">
                    <img
                        src={post.mainImage}
                        alt={post.title}
                        className="size-full object-cover object-top"
                        draggable={false}
                    />
                </div>
            )}

            <div className="p-6 space-y-6">
                <PostAuthorInfo
                    authorId={post.author._id}
                    name={post.author.name}
                    username={post.author.username}
                />

                {/* Title + Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-base leading-7 text-muted-foreground whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Tags */}
                {!!post.tags?.length && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <div
                                key={tag}
                                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                            >
                                #{tag}
                            </div>
                        ))}
                    </div>
                )}

                <Separator />

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <MessageCircle className="size-4" />
                        <span>{post.commentCount} comments</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="size-4" />
                        <span>{post.score} score</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock3 className="size-4" />
                        <span>{formatPostDate(post.createdAt)}</span>
                    </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <VoteButtons
                        post={post}
                        onVoteUpdate={onVoteUpdate}
                    />

                    <div className="flex items-center gap-3">
                        <ShareButton
                            postId={post._id}
                            title={post.title}
                            asSubmenu={false}
                        />
                        <BookmarkButton post={post} onBookmarkUpdate={onVoteUpdate} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PostDetailCard;