import type { User } from "@/types"
import UserAvatar from "../user-avatar";
import { Globe } from "lucide-react";
import EditProfileDialog from "./edit-profile-dialog";
import SocialLinks from "../social-links";
import { Github, Instagram, Linkedin, X, Youtube } from "@/assets/icons";
import { useGetMeQuery } from "@/services/user-api";

interface Props {
    user: User
}

const ProfileHeader = ({ user }: Props) => {
    const me = useGetMeQuery().data?.data;

    const isOwner = me?.user._id === user._id;

    return (
        <div className="flex flex-col space-y-1">
            <div className="relative h-44">
                {/* Banner image */}
                <div className="h-full">
                    <img src="https://images.unsplash.com/photo-1777829999062-917dd30ad425?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="banner" className="h-full w-full object-cover" draggable={false} />
                </div>

                {/* User Image */}
                <div className="flex size-[120px] p-1 absolute bottom-[-40%] left-0 items-center justify-center rounded-full bg-white">
                    <UserAvatar seed={user.username || user.name} className="size-full" />
                </div>
            </div>

            <div className="mt-16 space-y-2 p-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {user.name || user.username}
                    </h1>

                    <p className="text-muted-foreground">
                        @{user.username}
                    </p>
                </div>

                {user.bio && (
                    <p className="max-w-xl text-sm">
                        {user.bio}
                    </p>
                )}
            </div>

            <div className="px-4 py-2 flex sm:items-center flex-col sm:flex-row justify-between gap-4">
                {isOwner && <EditProfileDialog user={user} />}
                <div className="flex flex-1 flex-wrap gap-3 sm:gap-2 text-sm text-muted-foreground">
                    {user.socialLinks?.website && (
                        <SocialLinks icon={Globe} url={user.socialLinks.website} label="website" />
                    )}

                    {user.socialLinks?.github && (
                        <SocialLinks icon={Github} url={user.socialLinks.github} label="github" />
                    )}

                    {user.socialLinks?.linkedin && (
                        <SocialLinks icon={Linkedin} url={user.socialLinks.linkedin} label="linkedin" />
                    )}

                    {user.socialLinks?.instagram && (
                        <SocialLinks icon={Instagram} url={user.socialLinks.instagram} label="instagram" />
                    )}

                    {user.socialLinks?.twitter && (
                        <SocialLinks icon={X} url={user.socialLinks.twitter} label="twitter/X" />
                    )}

                    {user.socialLinks?.youtube && (
                        <SocialLinks icon={Youtube} url={user.socialLinks.youtube} label="youtube" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader


