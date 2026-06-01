import { Link } from "react-router-dom";

import type { SearchUser } from "@/types";

import UserAvatar from "../user-avatar";
import FollowButton from "./follow-button";

type Props = {
    user: SearchUser;
};

const FollowUserCard = ({ user }: Props) => {
    return (
        <div className="flex items-center justify-between">
            <Link
                to={`/u/${user.username}`}
                className="flex items-center gap-3"
            >
                <UserAvatar
                    seed={user._id}
                    className="size-10"
                />

                <div>
                    <p className="font-medium">
                        {user.name}
                    </p>

                    <p className="text-muted-foreground text-sm">
                        @{user.username}
                    </p>
                </div>
            </Link>

            <FollowButton userId={user._id} isFollowing={user.isFollowing} />
        </div>
    );
};

export default FollowUserCard;