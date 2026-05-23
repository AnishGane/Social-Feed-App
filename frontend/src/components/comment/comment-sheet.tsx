import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { Post } from "@/types"
import { MessageCircle, SendHorizonal } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import UserAvatar from "../user-avatar"
import { Input } from "../ui/input"
import { useAppSelector } from "@/hooks"

type Props = {
    post: Post
}

const CommentSheet = ({ post }: Props) => {

    const user = useAppSelector(state => state.auth.user);
    if (!user) {
        return null
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" title="Comments" className="text-base text-foreground flex items-center justify-center gap-1 p-0! cursor-pointer">
                    <MessageCircle className="size-4.5" />{post.commentCount}
                </Button>
            </SheetTrigger>
            <SheetContent className="px-4">
                <SheetHeader className="p-0 mt-10">
                    <SheetTitle className="text-2xl">{post.title}</SheetTitle>
                    <SheetDescription className="text-justify pr-5">{post.content}</SheetDescription>
                </SheetHeader>

                <Separator className="bg-foreground/40" />

                <p className="text-base">Total Comments ( {post.commentCount} )</p>

                {/* Comments list here */}
                <div className="flex items-center justify-center gap-2">
                    <UserAvatar seed={user._id} className="size-10" />
                    <Input placeholder="Add a comment..." className="w-full" />
                    <Button className="text-base py-5 rounded-full cursor-pointer">
                        <SendHorizonal className="size-5 ml-0.5" />
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CommentSheet