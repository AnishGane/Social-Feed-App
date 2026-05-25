import { Button } from "../ui/button"

const ReplyButton = ({
    setShowReplyInput
}: {
    setShowReplyInput: (show: boolean) => void
}) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs cursor-pointer"
            onClick={() => setShowReplyInput(true)}
        >
            Reply
        </Button>
    )
}

export default ReplyButton