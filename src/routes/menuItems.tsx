// src/data/menuItems.ts
import {
  AdminControlIcon,
  DashboardIcon,
  NafesLeagueIcon,
} from "../components";
import downarr from "../assets/images/down_arr.svg";
import white_arr from "../assets/images/white_arr.svg";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";

import { Games } from "../pages/Games";
import { Partners } from "../pages/Partners";

import { Badges } from "../pages/Badges";

import { RoutesProps } from "../utils";

// Helper function to convert snake_case to Title Case
const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

// Helper function to generate path from name
const toPath = (name: string) => name.toLowerCase().replace(/_/g, "-");

// Component mapping for modules and submodules
const componentMap: { [key: string]: JSX.Element } = {
  ALL_USER: <Games />,
  ALL_TEAM: <Games />,
  BANNED_USER: <Games />,
  ADMIN_ACCESS: <Games />,
  GAMES: <Games />,
  PARTNERS: <Partners />,
  TROPHIES: <Games />,
  BADGES: <Badges />,
  AUDIT_LOG: <Games />,
  TRANS_MAT: <Games />,
  SEO: <Games />,
};

// Icon mapping for modules
const iconMap: { [key: string]: JSX.Element } = {
  USER_CONTROL: <AdminControlIcon />,
  GENRAL_CONTROL: <AdminControlIcon />,
  AWARDS: <NafesLeagueIcon />,
  AUDIT_LOG: <NafesLeagueIcon />,
  TRANS_MAT: <NafesLeagueIcon />,
  SEO: <NafesLeagueIcon />,
};

// Function to generate routes from adminside data
export const generateRoutes = (adminside: any[]): RoutesProps[] => {
  const dynamicRoutes: RoutesProps[] = adminside
    .filter((module) => module.hasAccess)
    .map((module) => {
      const label = toTitleCase(module.name);
      const path = `/${toPath(module.name)}`;
      const submenu = module.subModules
        .filter((sub: any) => sub.hasAccess)
        .map((sub: any) => ({
          label: toTitleCase(sub.name),
          path: `${path}/${toPath(sub.name)}`,
          component: componentMap[sub.name] || <></>,
          auth: true,
          isShow: true,
        }));

      return {
        label,
        icon: iconMap[module.name] || <NafesLeagueIcon />,
        path: submenu.length > 0 ? path : path,
        dark_svg: downarr,
        white_svg: white_arr,
        submenu: submenu.length > 0 ? submenu : undefined,
        component:
          submenu.length > 0
            ? submenu[0].component
            : componentMap[module.name] || <></>,
        auth: true,
        isShow: true,
      };
    });

  // Combine static routes (Login, Dashboard) with dynamic routes
  return [
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
    ...dynamicRoutes,
  ];
};
