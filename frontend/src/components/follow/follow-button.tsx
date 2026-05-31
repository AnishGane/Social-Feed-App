import { useToggleFollowMutation } from "@/services/follow-api"
import { Button } from "../ui/button"

type Props = {
    userId: string,
    isFollowing: boolean
}

const FollowButton = ({ userId, isFollowing }: Props) => {
    const [toggleFollow, { isLoading }] = useToggleFollowMutation();

    const handleClick = async () => {
        await toggleFollow(userId);
    };

    return (
        <Button
            size="sm"
            variant={isFollowing ? "secondary" : "default"}
            onClick={handleClick}
            disabled={isLoading}
        >
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
}

export default FollowButton