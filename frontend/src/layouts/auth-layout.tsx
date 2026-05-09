import { GalleryVerticalEnd } from "lucide-react"
import { Outlet } from "react-router-dom"

const AuthLayout = () => {
    return (
        <main className="min-h-screen w-full">
            <div className="min-h-screen flex flex-col items-center justify-center max-w-6xl px-4 sm:px-0 gap-12 mx-auto w-full">
                <div className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    SocialFeed
                </div>
                <Outlet />
            </div>
        </main>
    )
}

export default AuthLayout