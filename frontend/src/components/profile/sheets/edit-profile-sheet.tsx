import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { User } from "@/types"
import { Button } from "../../ui/button";
import EditProfileForm from "@/forms/edit-profile-form";
import { useState } from "react";

type Props = {
    user: User;
}

const EditProfileSheet = ({ user }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger className="flex-1">
                <Button className="w-full py-5 cursor-pointer">Edit Profile</Button>
            </SheetTrigger>
            <SheetContent className="px-4">
                <SheetHeader className="px-0">
                    <SheetTitle className="text-2xl">Edit Profile</SheetTitle>
                </SheetHeader>

                <EditProfileForm user={user} setOpen={setOpen} />
            </SheetContent>
        </Sheet>
    )
}

export default EditProfileSheet