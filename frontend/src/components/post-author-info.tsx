import { Link } from "react-router-dom"
import UserAvatar from "./user-avatar"
import FollowButton from "./follow/follow-button";

type Props = {
    authorId: string,
    name: string,
    username: string,
    isOwner: boolean,
    isFollowing?: boolean,
}

const PostAuthorInfo = ({ authorId, name, username, isOwner, isFollowing }: Props) => {
    const visitAuthorProfile = isOwner ? `/u/me` : `/u/${username}`;

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                <UserAvatar seed={authorId} className="size-8" />
            </div>

            <div className="flex items-center justify-between w-full">
                <Link to={visitAuthorProfile} className="flex flex-col">
                    <h3 className="font-semibold text-base">
                        {name}
                    </h3>
                    <p className="text-xs text-muted-foreground tracking-wide">@{username}</p>
                </Link>
            </div>

            {/* FOLLOW BUTTON */}
            {!isOwner && (
                <FollowButton
                    userId={authorId}
                    isFollowing={!!isFollowing}
                />
            )}
        </div>
    )
}

export default PostAuthorInfo