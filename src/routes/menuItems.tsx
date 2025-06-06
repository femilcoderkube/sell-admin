// src/data/menuItems.ts

import downarr from "../assets/images/down_arr.svg";
import white_arr from "../assets/images/white_arr.svg";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Games } from "../pages/Games";
import { Partners } from "../pages/Partners";
import { Badges } from "../pages/Badges";
import { RoutesProps } from "../utils";
import { AuditLog } from "../pages/AuditLogs/AuditLog";
import { TransMat } from "../pages/TransMet/TransMat";
import { SEO } from "../pages/SEO/SEO";
import { AllTeams } from "../pages/Allteams/AllTeams";
import { Devices } from "../pages/Devices";
import { Users } from "../pages/Users";
import { Trophies } from "../pages/Trophies";
import {
  AdminControlIcon,
  DashboardIcon,
  NafesLeagueIcon,
} from "../components/ui";
import { Admin } from "../pages/Admin";
import { NafesLeague } from "../pages/League";
import { AddLeague } from "../pages/AddLeague";

// Helper function to convert snake_case to Title Case
const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

// Helper function to generate path from name, removing spaces and underscores
const toPath = (str: string) =>
  str
    .toLowerCase()
    .replace(/[\s_]+/g, "-") // Replaces spaces and underscores with a single hyphen
    .replace(/-+/g, "-") // Ensures multiple hyphens are reduced to one
    .replace(/^-|-$/g, ""); // Removes leading or trailing hyphens

// Component mapping for modules and submodules
const componentMap: { [key: string]: JSX.Element } = {
  ALL_USER: <Users />,
  ALL_TEAM: <AllTeams />,
  BANNED_USER: <Games />,
  ADMIN_ACCESS: <Admin />,
  GAMES: <Games />,
  PARTNERS: <Partners />,
  TROPHIES: <Trophies />,
  DEVICE: <Devices />,
  BADGES: <Badges />,
  AUDIT_LOG: <AuditLog />,
  TRANS_MAT: <TransMat />,
  SEO: <SEO />,
};

// Icon mapping for modules
const iconMap: { [key: string]: JSX.Element } = {
  USER_CONTROL: <AdminControlIcon />,
  GENRAL_CONTROL: <AdminControlIcon />,
  AWARDS: <DashboardIcon />,
  AUDIT_LOG: <DashboardIcon />,
  TRANS_MAT: <DashboardIcon />,
  SEO: <DashboardIcon />,
};

// Function to generate routes from adminside data
export const generateRoutes = (adminside: any[]): RoutesProps[] => {
  const dynamicRoutes: RoutesProps[] = adminside
    .filter((module) => module.hasAccess)
    .map((module) => {
      const label = toTitleCase(module.nameEn); // Use nameEn for label
      const path = `/${toPath(module.nameEn)}`; // Use nameEn for path
      const submenu = module.subModules
        .filter((sub: any) => sub.hasAccess)
        .map((sub: any) => ({
          label: toTitleCase(sub.nameEn), // Use nameEn for submenu label
          path: `${path}/${toPath(sub.nameEn)}`, // Use nameEn for submenu path
          component: componentMap[sub.key] || <></>,
          auth: true,
          isShow: true,
        }));

      return {
        label,
        icon: iconMap[module.key] || <NafesLeagueIcon />,
        path: submenu.length > 0 ? path : path,
        dark_svg: downarr,
        white_svg: white_arr,
        submenu: submenu.length > 0 ? submenu : undefined,
        component:
          submenu.length > 0
            ? submenu[0].component
            : componentMap[module.key] || <></>,
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
    {
      label: "PRIME",
      icon: <NafesLeagueIcon />,
      path: "/prime",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <NafesLeague />,
      auth: true,
      isShow: true,
    },
    {
      label: "Nafes League",
      icon: <NafesLeagueIcon />,
      path: "/leagues",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <NafesLeague />,
      auth: true,
      isShow: true,
    },
    {
      label: "Add League",
      icon: <NafesLeagueIcon />,
      path: "/leagues/add",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <AddLeague />,
      auth: true,
      isShow: false,
    },
    ...dynamicRoutes,
  ];
};
