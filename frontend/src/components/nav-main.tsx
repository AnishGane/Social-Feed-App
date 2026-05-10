import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

type Props = {
  item: {
    label: string,
    icon: any,
    url: string
  },
  isActive: boolean
}

export function NavMain({
  item,
  isActive
}: Props) {

  return (
    <SidebarMenu>
      <SidebarMenuItem key={item.label} className="flex flex-col mb-1">
        <SidebarMenuButton asChild className="py-5 data-[active=true]:bg-sidebar-primary/8" isActive={isActive}>
          <Link to={item.url} className=" flex items-center rounded-sm justify-center gap-3">
            <item.icon />
            <span className="flex-1 ">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu >
  )
}
