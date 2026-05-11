const EmptyFeed = () => {
    return (
        <div className="rounded-xl border py-16 text-center">
            <h2 className="text-lg font-semibold">No posts yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
                Be the first one to create a post.
            </p>
        </div>
    );
};

export default EmptyFeed;