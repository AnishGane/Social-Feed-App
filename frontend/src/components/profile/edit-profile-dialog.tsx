import type { User } from "@/types"
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import EditProfileForm from "@/forms/edit-profile-form";

interface Props {
    user: User;
}
const EditProfileDialog = ({ user }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button className="w-full sm:flex-1 py-5 cursor-pointer" onClick={() => setOpen((prev) => !prev)}>Edit Profile</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-lg! mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Edit Profile
                        </DialogTitle>
                    </DialogHeader>
                    <Separator />

                    <EditProfileForm user={user} setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditProfileDialog