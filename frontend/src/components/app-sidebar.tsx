import * as React from "react"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navItems } from "@/constants"
import { BringToFront } from "lucide-react"
import { Separator } from "./ui/separator"
import { Link, useLocation } from "react-router-dom"
import NavUser from "./nav-user"
import { useAppSelector } from "@/hooks"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const pathname = useLocation().pathname;
  const user = useAppSelector(state => state.auth.user);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="py-4 flex items-center flex-row pl-4 gap-">
        <div className="size-8 p-[6px] rounded-md bg-primary">
          <BringToFront className="size-full text-secondary" />
        </div>
        <Link to="/" className="font-medium text-xl text-primary">SocialFeed</Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2 flex flex-col items-center justify-center">
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <NavMain key={item.label} item={item} isActive={isActive} />
          )
        }
        )}
      </SidebarContent>
      <SidebarRail />
      <Separator />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
