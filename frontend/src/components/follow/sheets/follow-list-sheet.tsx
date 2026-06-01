import type React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import FollowList from "../follow-list";

type Props = {
    children: React.ReactNode,
    userId: string,
    type: "followers" | "following"
}
const FollowListSheet = ({ userId, type, children }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        {type === "followers"
                            ? "Followers"
                            : "Following"}
                    </SheetTitle>
                </SheetHeader>

                <FollowList userId={userId} type={type} />
            </SheetContent>
        </Sheet>
    )
}

export default FollowListSheet