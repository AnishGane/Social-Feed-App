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
import { useCreateCommentMutation, useGetCommentsByPostQuery } from "@/services/comment-api";
import PostAuthorInfo from "../post-author-info";

type Props = {
    post: Post;
};

const CommentSheet = ({ post }: Props) => {
    const user = useAppSelector((state) => state.auth.user);

    const { data } = useGetCommentsByPostQuery({
        postId: post._id,
    }, { skip: !user });

    const [createComment] = useCreateCommentMutation();

    if (!user) return null;

    const comments = data?.data.comments || [];
    const commentCount = comments.length ?? post.commentCount;

    const handleCreateComment = async (content: string) => {
        await createComment({
            postId: post._id,
            content,
        }).unwrap();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    title="Comments"
                    className="gap-1 p-0 cursor-pointer"
                >
                    <MessageCircle className="size-4.5" />
                    {commentCount}
                </Button>
            </SheetTrigger>

            <SheetContent className="px-4">
                <SheetHeader className="mt-10 p-0">
                    <PostAuthorInfo authorId={post.author._id} name={post.author.name} username={post.author.username} />

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
                        Total Comments ({commentCount})
                    </p>

                    <CommentInput
                        userId={user._id}
                        onSubmit={handleCreateComment}
                    />

                    <CommentList
                        comments={comments}
                        currentUserId={user._id}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CommentSheet;    