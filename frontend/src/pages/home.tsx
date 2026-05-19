import CreatePostCard from "@/components/post/create-post-card"
import PostFeed from "@/components/post/post-feed"

const HomePage = () => {
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-6">
            <CreatePostCard />

            <PostFeed type="all" />
        </main>
    )
}

export default HomePage