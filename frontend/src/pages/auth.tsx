import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/forms/login-form"
import SignupForm from "@/forms/signup-form"

const AuthPage = () => {
    return (
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
    )
}

export default AuthPage