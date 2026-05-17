import type { User } from "@/types"
import UserAvatar from "../user-avatar";
import { Globe } from "lucide-react";
import EditProfileDialog from "./edit-profile-dialog";
import SocialLinks from "../social-links";
import { Github, Instagram, Linkedin, X, Youtube } from "@/assets/icons";
import UserBannerImage from "./user-banner-image";
import { useGetMeQuery } from "@/services/user-api";

interface Props {
    user: User
}

const ProfileHeader = ({ user }: Props) => {
    // const me = useAppSelector(state => state.auth.user);
    const me = useGetMeQuery().data?.data;

    const isOwner = me?.user._id === user._id;

    return (
        <div className="flex flex-col space-y-1">
            <div className="relative h-44">
                {/* Banner image */}
                <UserBannerImage user={user} />

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


