import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { MessageCircle } from "lucide-react";

import type { Post } from "@/types";

import { useAppSelector } from "@/hooks";

import CommentInput from "./comment-input";
import CommentList from "./comment-list";
import PostAuthorInfo from "../post-author-info";
import { usePostComments } from "@/hooks/use-post-comments";

type Props = {
    post: Post;
};

const CommentSheet = ({ post }: Props) => {
    const user = useAppSelector((state) => state.auth.user);

    const { comments, createComment, isLoading, isError, totalComments } = usePostComments(post._id);

    if (!user) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    title="Comments"
                    className="gap-1 p-0 cursor-pointer w-fit"
                >
                    <MessageCircle className="size-4.5" />
                    {comments.length}
                </Button>
            </SheetTrigger>

            <SheetContent className="px-4">
                <SheetHeader className="mt-10 p-0">
                    <PostAuthorInfo
                        authorId={post.author._id}
                        name={post.author.name}
                        username={post.author.username}
                    />

                    <SheetTitle className="text-2xl mt-4">
                        {post.title}
                    </SheetTitle>

                    <SheetDescription className="pr-5 text-justify">
                        {post.content}
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-4 bg-foreground/30" />

                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        Total Comments ({isLoading ? '...' : totalComments})
                    </p>

                    <CommentInput
                        userId={user._id}
                        onSubmit={createComment}
                    />

                    {isLoading && <p className="text-sm text-muted-foreground">Loading comments...</p>}
                    {isError && <p className="text-sm text-destructive">Failed to load comments</p>}

                    {!isLoading && !isError &&
                        <CommentList
                            comments={comments}
                            currentUserId={user._id}
                        />
                    }
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CommentSheet;