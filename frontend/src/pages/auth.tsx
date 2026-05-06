import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/forms/login-form"
import SignupForm from "@/forms/signup-form"
import { GalleryVerticalEnd } from "lucide-react"

const AuthPage = () => {
    return (
        <main className="min-h-screen w-full">
            <div className="min-h-screen flex flex-col items-center justify-center max-w-6xl px-4 sm:px-0 gap-12 mx-auto w-full">
                <div className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </div>

                <Tabs defaultValue="login">
                    <TabsList className="mx-auto h-[46px]! mb-2">
                        <TabsTrigger value="login" className={"px-12 cursor-pointer"}>
                            Login
                        </TabsTrigger>
                        <TabsTrigger value="signup" className={"px-12 cursor-pointer"}>
                            Register
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignupForm />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}

export default AuthPage