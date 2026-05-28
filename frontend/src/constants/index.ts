import {
  SearchIcon,
  HomeIcon,
  Settings2Icon,
  UserIcon,
  BellIcon,
} from "lucide-react";

export const navItems = [
  {
    label: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    label: "Search",
    url: "/search",
    icon: SearchIcon,
  },
  {
    label: "Profile",
    url: "/u/me",
    icon: UserIcon,
  },
  {
    label: "Notifications",
    url: "/notifications",
    icon: BellIcon,
  },
  {
    label: "Settings",
    url: "/settings",
    icon: Settings2Icon,
  },
];
