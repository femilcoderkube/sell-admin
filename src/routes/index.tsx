// src/data/menuItems.ts
import {
  AdminControlIcon,
  BlogIcon,
  DashboardIcon,
  NafesLeagueIcon,
  RankingSystemIcon,
  RegistrationFormsIcon,
  TicketsIcon,
  TournamentsIcon,
  UsersIcon,
} from "../components";
import downarr from "../assets/images/down_arr.svg";
import white_arr from "../assets/images/white_arr.svg";
import { Dashboard } from "../pages/Dashboard";
// import { Users } from "../pages/Users";
// import { Partners } from "../pages/Partners";
// import { Rules } from "../pages/Rules";
// import { Games } from "../pages/Games";
// import { Devices } from "../pages/Devices";
import { Login } from "../pages/Login";
import { RoutesProps } from "../utils";
// import { NafesLeague } from "../pages/League";
// import { AddLeague } from "../pages/AddLeague";
// import { AddPartners } from "../pages/AddPartners";
// import { UpdatePartners } from "../pages/UpdatePartners";
// import { AddRules } from "../pages/AddRules";
// import { UpdateRules } from "../pages/UpdateRules";
// import { Badges } from "../pages/Badges";
// import { UpdateBadges } from "../pages/UpdateBadges";
// import { AddBadges } from "../pages/AddBadges";

export const routes: RoutesProps[] = [
  {
    label: "Login",
    icon: <></>,
    path: "/",
    dark_svg: downarr,
    white_svg: white_arr,
    component: <Login />,
    auth: false,
    isShow: false,
  },
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    dark_svg: downarr,
    white_svg: white_arr,
    component: <Dashboard />,
    auth: true,
    isShow: true,
  },

  // {
  //   label: "Tickets",
  //   icon: <TicketsIcon />,
  //   path: "#",
  //   dark_svg: downarr,
  //   white_svg: white_arr,
  //   component: <></>,
  //   auth: true,
  //   isShow: true,
  // },

  // {
  //   label: "Ranking System",
  //   icon: <RankingSystemIcon />,
  //   path: "#",
  //   dark_svg: downarr,
  //   white_svg: white_arr,
  //   submenu: [],
  //   component: <></>,
  //   auth: true,
  //   isShow: true,
  // },

  // {
  //   label: "Tournaments",
  //   icon: <TournamentsIcon />,
  //   path: "#",
  //   dark_svg: downarr,
  //   white_svg: white_arr,
  //   component: <></>,
  //   auth: true,
  //   isShow: true,
  // },

  // {
  //   label: "Blog",
  //   icon: <BlogIcon />,
  //   path: "#",
  //   dark_svg: downarr,
  //   white_svg: white_arr,
  //   submenu: [],
  //   component: <></>,
  //   auth: true,
  //   isShow: true,
  // },

  // {
  //   label: "Registration Forms",
  //   icon: <RegistrationFormsIcon />,
  //   path: "#",
  //   dark_svg: downarr,
  //   white_svg: white_arr,
  //   component: <></>,
  //   auth: true,
  //   isShow: true,
  // },
];
