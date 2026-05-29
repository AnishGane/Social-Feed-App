import { Facebook, Linkedin, X } from "@/assets/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
    Copy,
    Share2,
} from "lucide-react";
import { toast } from "sonner";

type ShareMenuItemsProps = {
    postId: string;
    title?: string;
};

export const ShareMenuItems = ({ postId, title }: ShareMenuItemsProps) => {
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
        <>
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
        </>
    );
};

type Props = ShareMenuItemsProps & {
    /** Use inside an existing DropdownMenu (e.g. post card ⋮ menu). Default: true */
    asSubmenu?: boolean;
};

const ShareButton = ({ postId, title, asSubmenu = true }: Props) => {
    if (!asSubmenu) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                        <Share2 className="size-4" />
                        Share
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                    <ShareMenuItems postId={postId} title={title} />
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer py-2.5">
                <Share2 />
                Share this post
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="ml-2 w-48 data-[side=left]:mr-2">
                    <ShareMenuItems postId={postId} title={title} />
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};

export default ShareButton;
