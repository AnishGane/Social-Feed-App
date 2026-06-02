import type React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import FollowList from "../follow-list";
import NavSearchButton from "@/components/nav-search-button";

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

                {/* TODO: Instead here whole user search is happening, I only want to search users that the user has in followers list and following list */}                <NavSearchButton />
                <FollowList userId={userId} type={type} />
            </SheetContent>
        </Sheet>
    )
}

export default FollowListSheet