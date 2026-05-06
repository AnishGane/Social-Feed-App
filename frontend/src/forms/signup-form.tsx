import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { signupSchema, type SignupSchemaType } from "@/schema/auth-schema"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRegisterMutation } from "@/services/auth-api"
import { useAppDispatch } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { setCredentials } from "@/features/auth/auth-slice"
import { useState } from "react"

const SignupForm = ({
    className,
    ...props
}: React.ComponentProps<"div">) => {
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
        password: false,
        confirmPassword: false
    });

    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(data: SignupSchemaType) {
        try {
            const res = await register(data).unwrap();

            dispatch(setCredentials({
                user: res.data.user,
                accessToken: res.data.accessToken
            }));
            navigate("/dashboard");

        } catch (err: any) {
            const message = err?.data?.message || "Signup failed. Please try again.";
            form.setError("root", { message });
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl font-semibold">Start Freshly</CardTitle>
                    <CardDescription>
                        Enter all the fields below to start new
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-username">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="username"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="m@example.com"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-password">
                                            Password
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id="form-rhf-demo-password"
                                                type={showPassword.password ? "text" : "password"}
                                                placeholder="••••••••"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                {showPassword.password ? (
                                                    <EyeIcon
                                                        className="size-4 cursor-pointer"
                                                        onClick={() =>
                                                            setShowPassword((prev) => ({
                                                                ...prev,
                                                                password: false
                                                            }))
                                                        }
                                                    />
                                                ) : (
                                                    <EyeOffIcon
                                                        className="size-4 cursor-pointer"
                                                        onClick={() =>
                                                            setShowPassword((prev) => ({
                                                                ...prev,
                                                                password: true
                                                            }))
                                                        }
                                                    />
                                                )}
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id="form-rhf-demo-confirmPassword"
                                                type={showPassword.confirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                {showPassword.confirmPassword ? (
                                                    <EyeIcon
                                                        className="size-4 cursor-pointer"
                                                        onClick={() =>
                                                            setShowPassword((prev) => ({
                                                                ...prev,
                                                                confirmPassword: false
                                                            }))
                                                        }
                                                    />
                                                ) : (
                                                    <EyeOffIcon
                                                        className="size-4 cursor-pointer"
                                                        onClick={() =>
                                                            setShowPassword((prev) => ({
                                                                ...prev,
                                                                confirmPassword: true
                                                            }))
                                                        }
                                                    />
                                                )}
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {form.formState.errors.root && (
                                <FieldError errors={[form.formState.errors.root]} />
                            )}

                            <Button type="submit" disabled={isLoading} className="py-5.5 cursor-pointer">
                                {isLoading ? "Creating..." : "Create an account"}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-xs">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}

export default SignupForm;
