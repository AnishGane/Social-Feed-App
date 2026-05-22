import { Facebook, Linkedin, X } from "@/assets/icons";
import {
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import {
    Copy,
    Share2,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
    postId: string;
    title?: string;
};

const ShareButton = ({ postId, title }: Props) => {
    const postUrl = `${window.location.origin}/p/${postId}`;

    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(
        title || "Check out this post",
    );

    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);

            toast.success("Post link copied");
        } catch (error) {
            console.error(error);

            toast.error("Failed to copy link");
        }
    };

    const openShareWindow = (url: string) => {
        window.open(url, "_blank", "width=600,height=500,noopener,noreferrer");
    };

    const handleNativeShare = async () => {
        if (!navigator.share) return;

        try {
            await navigator.share({
                title: title || "Check out this post",
                url: postUrl,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer py-2.5">
                <Share2 />
                Share
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="ml-2 w-48 data-[side=left]:mr-2">
                    {navigator.share && (
                        <DropdownMenuItem onClick={handleNativeShare}>
                            <Share2 className="mr-2 size-4" />
                            Native Share
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleCopyLink}>
                        <Copy className="mr-2 size-4" />
                        Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => openShareWindow(twitterShareUrl)}
                    >
                        <X className="mr-2 size-4" />
                        Share to Twitter/X
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => openShareWindow(facebookShareUrl)}
                    >
                        <Facebook className="mr-2 size-4" />
                        Share to Facebook
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => openShareWindow(linkedinShareUrl)}
                    >
                        <Linkedin className="mr-2 size-4" />
                        Share to LinkedIn
                    </DropdownMenuItem>

                    {/* <DropdownMenuSeparator /> */}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};

export default ShareButton;