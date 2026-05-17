import { useUpdateProfileMutation } from "@/services/user-api"
import type { User } from "@/types"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Ban, CircleCheck, Loader2 } from "lucide-react"

const UserBannerImage = ({ user }: { user: User }) => {

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState(user.bannerImage);

    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    useEffect(() => {
        setBannerPreview(user.bannerImage || "");
    }, [user.bannerImage]);

    // Revoke the object URL when the component unmounts
    useEffect(() => {
        return () => {
            if (bannerPreview && bannerPreview.startsWith('blob:')) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [bannerPreview]);

    const handleApply = async () => {
        if (!bannerFile) return;
        try {

            const formData = new FormData();
            formData.append("bannerImage", bannerFile);

            const res = await updateProfile(formData);
            if (res.error) {
                toast.error("Failed to update banner image.");
                console.error(res.error);
            } else {
                toast.success("Banner image updated successfully!");
                setBannerFile(null);
            }
        } catch (error) {
            error instanceof Error && toast.error(error.message);
        }
    };

    const removeBanner = () => {
        if (bannerPreview && bannerPreview.startsWith('blob:')) {
            URL.revokeObjectURL(bannerPreview);
        }
        setBannerFile(null);
        setBannerPreview(user.bannerImage);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        {
            const file = e.target.files?.[0];
            if (file) {
                // Revoke previous preview URL if it exists
                if (bannerPreview && bannerPreview.startsWith('blob:')) {
                    URL.revokeObjectURL(bannerPreview);
                }
                setBannerFile(file);
                const url = URL.createObjectURL(file);
                setBannerPreview(url);
            }
        }
    }

    const src = bannerPreview || user.bannerImage;

    return (
        <div className="h-full relative">
            {src ? (
                <img
                    src={src}
                    alt="banner"
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                    No Banner Image
                </div>
            )}
            <>
                <div className="absolute right-2 top-2 z-10">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/90 hover:bg-white/90 border border-gray-200 shadow text-sm font-medium">
                        <span>Change Banner</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleImageChange(e)}
                        />
                    </label>
                </div>
                {bannerFile && (
                    <div className="flex items-center gap-2 absolute right-2 bottom-2">
                        <Button disabled={isLoading} onClick={handleApply} size="sm" className="bg-green-500 cursor-pointer">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-1">
                                    <Loader2 className="animate-spin" aria-hidden="true" />
                                    Applying
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1">
                                    <CircleCheck className="size-3.5" />
                                    Apply
                                </div>
                            )}
                        </Button>
                        <Button size="sm" className="bg-red-400 flex items-center justify-center gap-1 cursor-pointer" onClick={removeBanner}>
                            <Ban className="size-3.5" />
                            Cancel
                        </Button>
                    </div>
                )
                }
            </>
        </div>
    )
}

export default UserBannerImage

