import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    editProfileSchema,
    type EditProfileInput,
} from "@/schema/user-schema";
import { useUpdateProfileMutation } from "@/services/user-api";
import type { User } from "@/types";
import { toast } from "sonner";

const EditProfileForm = ({ user, setOpen }: { user: User, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const form = useForm<EditProfileInput>({
        resolver: zodResolver(editProfileSchema),

        defaultValues: {
            name: user.name || "",
            bio: user.bio || "",

            socialLinks: {
                website: user.socialLinks?.website || "",
                github: user.socialLinks?.github || "",
                linkedin: user.socialLinks?.linkedin || "",
                twitter: user.socialLinks?.twitter || "",
                instagram: user.socialLinks?.instagram || "",
                youtube: user.socialLinks?.youtube || "",
            },
        },
    });

    const [updateProfile, { isLoading }] =
        useUpdateProfileMutation();

    const onSubmit = async (data: EditProfileInput) => {
        try {
            const formData = new FormData();

            if (data.name !== undefined) formData.append("name", data.name);
            if (data.bio !== undefined) formData.append("bio", data.bio);

            if (data.socialLinks) {
                Object.entries(data.socialLinks).forEach(([key, value]) => {
                    if (value && value.trim() !== "") {
                        formData.append(`socialLinks[${key}]`, value);
                    }
                });
            }

            await updateProfile(formData).unwrap();

            toast.success("Profile updated successfully.");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    return (
        <form
            id="form-rhf-profile"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <FieldGroup>
                {/* Name */}
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                htmlFor="form-rhf-profile-name"
                                className="text-base"
                            >
                                Name
                            </FieldLabel>

                            <Input
                                {...field}
                                id="form-rhf-profile-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Your name"
                                autoComplete="off"
                                className="rounded-sm"
                            />

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />

                {/* Bio */}
                <Controller
                    name="bio"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                htmlFor="form-rhf-profile-bio"
                                className="text-base"
                            >
                                Bio
                            </FieldLabel>

                            <Textarea
                                {...field}
                                id="form-rhf-profile-bio"
                                aria-invalid={fieldState.invalid}
                                placeholder="Tell something about yourself"
                                className="min-h-28 rounded-sm resize-none"
                            />

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />

                {/* Social Links */}
                <h1 className="text-base font-medium">Social Links</h1>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 justify-center">
                        {/* Website */}
                        <Controller
                            name="socialLinks.website"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-base">
                                        Website
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="https://yourwebsite.com"
                                        className="rounded-sm"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Github */}
                        <Controller
                            name="socialLinks.github"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-base">
                                        Github
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="https://github.com/username"
                                        className="rounded-sm"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-2 justify-center">

                        {/* Linkedin */}
                        <Controller
                            name="socialLinks.linkedin"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-base">
                                        Linkedin
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="https://linkedin.com/in/username"
                                        className="rounded-sm"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Twitter */}
                        <Controller
                            name="socialLinks.twitter"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-base">
                                        Twitter
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="https://x.com/username"
                                        className="rounded-sm"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        {/* Instagram */}
                        <Controller
                            name="socialLinks.instagram"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-base">
                                        Instagram
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="https://instagram.com/username"
                                        className="rounded-sm"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Youtube */}
                        <Controller
                            name="socialLinks.youtube"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-base">
                                        Youtube
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="https://youtube.com/@username"
                                        className="rounded-sm"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </div>
            </FieldGroup>

            <div className="flex items-center gap-2 w-full">
                <Button
                    type="reset"
                    disabled={isLoading}
                    className=" py-5 cursor-pointer flex-1 border border-primary/40"
                    onClick={() => form.reset()}
                    variant="secondary"
                >
                    Reset
                </Button>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className=" py-5 cursor-pointer flex-1"
                >
                    {isLoading ? "Updating..." : "Save Changes"}
                </Button>

            </div>
        </form>
    );
};

export default EditProfileForm;