import {
    useGetFollowersQuery,
    useGetFollowingQuery,
} from "@/services/follow-api";

import FollowUserCard from "./follow-user-card";

type Props = {
    userId: string;
    type: "followers" | "following";
};

const FollowList = ({ userId, type }: Props) => {
    const query =
        type === "followers"
            ? useGetFollowersQuery({ userId })
            : useGetFollowingQuery({ userId });

    const users = query.data?.data.follows || [];

    if (query.isLoading) {
        return <p className="text-muted-foreground text-sm h-40 flex items-center justify-center">
            Loading...
        </p>;
    }

    if (!users.length) {
        return (
            <p className="text-muted-foreground text-sm h-40 flex items-center justify-center">
                No {type} yet.
            </p>
        );
    }

    return (
        <div className="mt-4 space-y-4 mx-4">
            {users.map((user) => (
                <FollowUserCard
                    key={user._id}
                    user={user}
                />
            ))}
        </div>
    );
};

export default FollowList;