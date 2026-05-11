import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
    return (
        <div className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>

            <Skeleton className="h-5 w-3/4" />

            <Skeleton className="h-20 w-full" />

            <Skeleton className="h-52 w-full rounded-lg" />

            <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    );
};

export default PostSkeleton;