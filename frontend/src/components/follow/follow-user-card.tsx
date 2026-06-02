import { Link } from "react-router-dom";

import type { FollowUser } from "@/types";

import UserAvatar from "../user-avatar";
import FollowButton from "./follow-button";
import { Badge } from "../ui/badge";

type Props = {
    user: FollowUser;
};

const FollowUserCard = ({ user }: Props) => {
    console.log("FUC: ", user);

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
                    <div className="flex items-center gap-2">
                        <p className="font-medium">
                            {user.name}
                        </p>
                        {user.isMutual && <Badge className="text-[11px] tracking-wide px-2" variant="outline">mutual</Badge>}
                    </div>

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