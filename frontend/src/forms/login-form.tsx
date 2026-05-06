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
import { loginSchema, type LoginSchemaType } from "@/schema/auth-schema"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { setCredentials } from "@/features/auth/auth-slice"
import { useAppDispatch } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "@/services/auth-api"
import { useState } from "react"

const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(data: LoginSchemaType) {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.data?.message || "Login failed. Please try again.";
      form.setError("root", { message });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Login with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <InputGroupAddon align="inline-end">
                        {showPassword ? (
                          <EyeIcon onClick={() => setShowPassword(false)} className="size-4 cursor-pointer" />
                        ) : (
                          <EyeOffIcon onClick={() => setShowPassword(true)} className="size-4 cursor-pointer" />
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
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default LoginForm;
