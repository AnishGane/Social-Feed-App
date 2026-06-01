import { Button } from "../ui/button"
import FollowListSheet from "./sheets/follow-list-sheet"

type Props = {
    followersCount: number
    followingCount: number
    userId: string
}

const FollowStats = ({ followersCount, followingCount, userId }: Props) => {
    return (
        <div className="flex items-center justify-center gap-4 px-2">
            <FollowListSheet userId={userId} type="followers">
                <Button variant="outline" className="flex-1 flex-col h-full py-4 px-8 cursor-pointer">
                    <span className="font-bold text-2xl">
                        {followersCount}
                    </span>
                    <p className="text-sm text-muted-foreground">
                        Followers
                    </p>
                </Button>
            </FollowListSheet>

            <FollowListSheet userId={userId} type="following">
                <Button variant="outline" className="flex-1 flex-col px-8 h-full py-4 cursor-pointer">
                    <span className="font-bold text-2xl">
                        {followingCount}
                    </span>
                    <p className="text-sm text-muted-foreground">
                        Following
                    </p>
                </Button>
            </FollowListSheet>
        </div>
    )
}

export default FollowStats