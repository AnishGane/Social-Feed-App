import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

type Props = {
    showReplyInput: boolean,
    setShowReplyInput: (show: boolean) => void
}

const ReplyButton = ({
    showReplyInput,
    setShowReplyInput
}: Props) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("h-auto p-0 text-xs cursor-pointer", showReplyInput && "hidden")}
            onClick={() => setShowReplyInput(true)}
        >
            Reply
        </Button>
    )
}

export default ReplyButton