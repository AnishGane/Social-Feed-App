import type { ProfileStats as Stats } from "@/types"

interface Props {
    stats: Stats;
}

const ProfileStats = ({ stats }: Props) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-4 text-center">
                <p className="text-2xl font-bold">
                    {stats.postsCount}
                </p>

                <p className="text-sm text-muted-foreground">
                    Posts
                </p>
            </div>

            <div className="rounded-2xl border p-4 text-center">
                <p className="text-2xl font-bold">
                    {stats.upvotesReceived}
                </p>

                <p className="text-sm text-muted-foreground">
                    Upvotes
                </p>
            </div>

            <div className="rounded-2xl border p-4 text-center">
                <p className="text-2xl font-bold">
                    {stats.downvotesReceived}
                </p>

                <p className="text-sm text-muted-foreground">
                    Downvotes
                </p>
            </div>

            <div className="rounded-2xl border p-4 text-center">
                <p className="text-2xl font-bold">
                    {stats.totalScore}
                </p>

                <p className="text-sm text-muted-foreground">
                    Score
                </p>
            </div>
        </div>
    )
}

export default ProfileStats