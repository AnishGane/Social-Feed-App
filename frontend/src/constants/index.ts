import {
  SearchIcon,
  HomeIcon,
  Settings2Icon,
  UserIcon,
  BookmarkIcon,
  BellIcon,
  PlusSquareIcon,
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
    label: "Create Post",
    url: "/create-post",
    icon: PlusSquareIcon,
  },
  {
    label: "Profile",
    url: "/profile",
    icon: UserIcon,
  },
  {
    label: "Bookmarks",
    url: "/bookmarks",
    icon: BookmarkIcon,
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
