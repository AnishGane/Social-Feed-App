import { Card } from "../ui/card";

const RelatedPosts = () => {
    return (
        <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
                Related Posts
            </h2>

            <div className="space-y-4">
                <div className="rounded-lg border p-4">
                    <h3 className="font-medium">
                        Similar content coming soon
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        You can later fetch posts with same tags/category.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default RelatedPosts;