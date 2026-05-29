import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostDetailsSkeleton = () => {
    return (
        <main className="mx-auto max-w-7xl px-4 py-6">
            {/* Back button */}
            <Skeleton className="mb-6 h-5 w-32" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Main Content */}
                <div className="space-y-6 min-w-0">

                    {/* Post Detail Card */}
                    <Card className="overflow-hidden border-border/60 p-0">
                        {/* Cover image */}
                        <Skeleton className="aspect-16/7 w-full rounded-none" />

                        <div className="p-6 space-y-6">

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-12 rounded-full" />

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>

                            {/* Title + content */}
                            <div className="space-y-4">
                                <Skeleton className="h-9 w-3/4" />

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-7 w-16 rounded-full" />
                                <Skeleton className="h-7 w-20 rounded-full" />
                                <Skeleton className="h-7 w-14 rounded-full" />
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-5">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-28" />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-28 rounded-md" />
                                    <Skeleton className="h-9 w-28 rounded-md" />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Comments Section */}
                    <Card className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-36" />
                            <Skeleton className="h-4 w-48" />
                        </div>

                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex gap-3"
                            >
                                <Skeleton className="size-10 rounded-full shrink-0" />

                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>

                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>

                                    <div className="flex gap-3">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card>

                    {/* Related Posts */}
                    <Card className="p-6 space-y-4">
                        <Skeleton className="h-7 w-40" />

                        {Array.from({ length: 2 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-lg border p-4 space-y-3"
                            >
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block space-y-6">
                    {/* Author Card */}
                    <Card className="p-5 space-y-5">
                        <Skeleton className="h-6 w-24" />

                        <div className="flex items-center gap-3">
                            <Skeleton className="size-12 rounded-full" />

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </Card>

                    {/* Engagement Card */}
                    <Card className="p-5 space-y-5">
                        <Skeleton className="h-6 w-32" />

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-10" />
                            </div>

                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-10" />
                            </div>

                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-10" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
};

export default PostDetailsSkeleton;