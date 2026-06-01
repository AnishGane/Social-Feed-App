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
            variant={isFollowing ? "secondary" : "ghost"}
            onClick={handleClick}
            disabled={isLoading}
            className="cursor-pointer text-xs"
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}

export default FollowButton