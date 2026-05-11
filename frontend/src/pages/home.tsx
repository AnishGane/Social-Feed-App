import CreatePostCard from "@/components/post/create-post-card"
import PostFeed from "@/components/post/post-feed"

const HomePage = () => {
    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-6">
            <CreatePostCard />

            <PostFeed />
        </main>
    )
}

export default HomePage