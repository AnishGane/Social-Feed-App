import { Skeleton } from "../ui/skeleton"

const PostDetailCommentSkeleton = () => {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <Skeleton className="h-3 w-20 bg-muted rounded animate-pulse" />
                        </div>
                    </div>

                    <div className="h-16 rounded bg-muted animate-pulse" />
                </div>
            ))}
        </div>
    )
}

export default PostDetailCommentSkeleton