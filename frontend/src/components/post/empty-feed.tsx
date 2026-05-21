const EmptyFeed = () => {
    return (
        <div className="rounded-xl border py-16 text-center">
            <h2 className="text-lg font-semibold">No posts here</h2>

            <p className="mt-2 text-sm text-muted-foreground">
                Create a post, vote a post or bookmark the post to see here.
            </p>
        </div>
    );
};

export default EmptyFeed;