import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type React from "react"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { useState } from "react"
import type { Post } from "@/types"
import { useDeletePostMutation } from "@/services/post-api"
import { toast } from "sonner"

type Props = {
    icon: React.ElementType,
    title: string,
    description: string,
    iconLabel: string,
    post: Post,
}

const AlertDialogComp = ({ icon, title, iconLabel, description, post }: Props) => {
    const [open, setOpen] = useState(false)
    const Icon = icon;

    const [deletePost, { isLoading }] = useDeletePostMutation();

    const handleDeletePost = async (id: string) => {
        try {
            const res = await deletePost(id).unwrap();

            toast.success(res.message || "Post deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete post.");
        } finally {
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive" onSelect={(e) => { e.preventDefault(); setOpen(true) }}>
                    <Icon />
                    {iconLabel}
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="py-5 px-5 cursor-pointer">No, Keep it</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeletePost(post._id)} disabled={isLoading} className="py-5 px-5 cursor-pointer">
                        {isLoading ? "Deleting..." : "Yes, Delete it."}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDialogComp