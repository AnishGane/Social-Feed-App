import { cn } from "@/lib/utils";
import type { RelatedPosts } from "@/types"
import { formatPostDate } from "@/utils/format-date";
import { Link } from "react-router-dom";

type Props = {
    p: RelatedPosts;
}

const RelatedPostsCard = ({ p }: Props) => {
    return (
        <Link to={`/p/${p._id}`}
            key={p._id}
            className={cn("border rounded-lg hover:bg-muted/50 transition flex items-center gap-4 overflow-hidden", !p.mainImage && "p-4")}
        >
            {p.mainImage ? (
                <div className="size-30">
                    <img src={p.mainImage} className="size-full object-cover" alt={p.title} draggable={false} />
                </div>
            ) : (
                null
            )}
            <div>
                <h3 className="font-medium line-clamp-1 text-lg">
                    {p.title}
                </h3>
                <p className="line-clamp-3 text-muted-foreground mt-2">
                    {p.content}
                </p>

                <p className="text-xs text-muted-foreground mt-4">
                    {formatPostDate(p.createdAt)}
                </p>
            </div>
        </Link>
    )
}

export default RelatedPostsCard