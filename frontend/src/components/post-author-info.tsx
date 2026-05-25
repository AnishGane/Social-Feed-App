import { Link } from "react-router-dom"
import UserAvatar from "./user-avatar"
import { useGetMeQuery } from "@/services/user-api";

type Props = {
    authorId: string,
    name: string,
    username: string,
}

const PostAuthorInfo = ({ authorId, name, username }: Props) => {
    const me = useGetMeQuery().data?.data;
    const isOwner = me?.user._id === authorId;

    const visitProfile = isOwner ? `/u/me` : `/u/${username}`;

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                <UserAvatar seed={authorId} className="size-8" />
            </div>

            <div className="flex items-center justify-between w-full">
                <Link to={visitProfile} className="flex flex-col">
                    <h3 className="font-semibold text-base">
                        {name}
                    </h3>
                    <p className="text-xs text-muted-foreground tracking-wide">@{username}</p>
                </Link>

            </div>
        </div>
    )
}

export default PostAuthorInfo