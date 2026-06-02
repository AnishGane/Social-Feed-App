import { useToggleFollowMutation } from "@/services/follow-api";
import { Button } from "../ui/button";

type Props = {
    userId: string;
    isFollowing: boolean;
    className?: string;
};

const FollowButton = ({ userId, isFollowing, className }: Props) => {
    const [toggleFollow, { isLoading }] = useToggleFollowMutation();

    return (
        <Button
            className={className}
            variant={isFollowing ? "secondary" : "default"}
            disabled={isLoading}
            onClick={() => toggleFollow(userId)}
        >
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
};

export default FollowButton;