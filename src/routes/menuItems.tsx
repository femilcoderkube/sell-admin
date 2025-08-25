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
import { BannedUsers } from "../pages/BannedUsers";
import LeagueDetails from "../components/League/LeagueDetails";
import { LeagueDetail } from "../pages/League/leagueDetail";
import { MatcheDetail } from "../pages/League/MatcheDetail";
import { UserDetail } from "../pages/Users/userDetail";
import { ChatDetail } from "../pages/League/ChatDetail";
import { Tournament } from "../pages/Tournament";
import { AddTournament } from "../pages/AddTournamente";
import { Stage } from "../pages/Stage";
import { AddStage } from "../pages/AddStage";
import { Member } from "../pages/Member";
import { StageList } from "../pages/StageList";
import { Seed } from "../pages/Seed";
import { BulkRegistration } from "../pages/BulkRegistration";
import { StageMatcheDetail } from "../pages/StageList/MatcheDetail";
import { Participant } from "../pages/Participant";
import { SeedDetail } from "../pages/League/SeedDetail";
import { Modal } from "../pages/Modal";

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

// Component mapping for modules and submodules (store component types)
const componentMap: { [key: string]: React.ComponentType<any> } = {
  LEAGUE: NafesLeague,
  TOURNAMENT: Tournament,
  ALL_USER: Users,
  ALL_TEAM: AllTeams,
  BANNED_USER: BannedUsers,
  ADMIN_ACCESS: Admin,
  GAMES: Games,
  PARTNERS: Partners,
  TROPHIES: Trophies,
  DEVICE: Devices,
  BADGES: Badges,
  AUDIT_LOG: AuditLog,
  TRANS_MAT: TransMat,
  SEO: SEO,
  PRIME: NafesLeague, // Added for PRIME module
  USER_CONTROL: Users, // Added for USER_CONTROL module
  GENRAL_CONTROL: Games, // Added for GENRAL_CONTROL module (assuming Games as default, adjust as needed)
  AWARDS: Trophies, // Added for AWARDS module (assuming Trophies as default, adjust as needed)
  MODAL: Modal,
};

// Icon mapping for modules (store component types)
const iconMap: { [key: string]: React.ComponentType<any> } = {
  PRIME: NafesLeagueIcon,
  USER_CONTROL: AdminControlIcon,
  GENRAL_CONTROL: AdminControlIcon,
  AWARDS: DashboardIcon,
  MODAL: DashboardIcon,
  AUDIT_LOG: DashboardIcon,
  TRANS_MAT: DashboardIcon,
  SEO: DashboardIcon,
};

// Function to generate routes from adminside data
export const generateRoutes = (adminside: any[]): RoutesProps[] => {
  const role = localStorage.getItem("admin");
  const jsonValue = JSON.parse(role as any);

  const dynamicRoutes: RoutesProps[] = adminside
    .filter((module) => module.hasAccess)
    .map((module) => {
      const label = toTitleCase(module.nameEn);
      let path;
      if (module.isPartner) {
        path = `/${toPath(module.partnerId)}`;
      } else {
        path = `/${toPath(module.nameEn)}`;
      }
      const ModuleComponent = componentMap[module.key] || (() => <></>);
      const IconComponent = iconMap[module.key] || NafesLeagueIcon;
      const submenu = module.subModules
        .filter((sub: any) => sub.hasAccess)
        .map((sub: any) => {
          const SubComponent = componentMap[sub.key] || (() => <></>);
          return {
            label: toTitleCase(sub.nameEn),
            path: `${path}/${toPath(sub.nameEn)}`,
            component: (
              <SubComponent
                title={toTitleCase(sub.nameEn)}
                id={sub._id}
                partnerId={module.isPartner ? module.partnerId : undefined}
                partnerColor={
                  module.isPartner ? module.partnerColor : undefined
                }
                key={sub._id}
              />
            ),
            auth: true,
            isShow: true,
          };
        });

      return {
        label,
        isPartner: module.isPartner,
        partnerId: module.isPartner ? module.partnerId : undefined,
        partnerColor: module.isPartner ? module.partnerColor : undefined,
        icon: module.isPartner ? (
          <></>
        ) : (
          <IconComponent
            isPartner={module.isPartner}
            partnerId={module.isPartner ? module.partnerId : undefined}
            partnerColor={module.isPartner ? module.partnerColor : undefined}
            key={module._id}
          />
        ),
        path: submenu.length > 0 ? path : path,
        dark_svg: downarr,
        white_svg: white_arr,
        submenu: submenu.length > 0 ? submenu : undefined,
        component:
          submenu.length > 0 ? (
            submenu[0].component
          ) : (
            <ModuleComponent
              title={toTitleCase(module.nameEn)}
              id={module._id}
              isPartner={module.isPartner}
              partnerId={module.isPartner ? module.partnerId : undefined}
              partnerColor={module.isPartner ? module.partnerColor : undefined}
              key={module._id}
            />
          ),
        auth: true,
        isShow: true,
      };
    });

  // Combine static routes (Login, Dashboard, Add League) with dynamic routes
  return [
    {
      label: "Login",
      icon: <></>,
      path: "/login",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <Login />,
      auth: false,
      isShow: false,
    },
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <Dashboard />,
      auth: true,
      isShow: true,
      partnerColor: undefined,
    },

    // {
    //   label: "Add League",
    //   icon: <NafesLeagueIcon />,
    //   path: "/:id/leagues/add",
    //   dark_svg: downarr,
    //   white_svg: white_arr,
    //   component: <AddLeague />,
    //   auth: true,
    //   isShow: false,
    //   partnerColor: undefined,
    // },
    // {
    //   label: "Edit League",
    //   icon: <NafesLeagueIcon />,
    //   path: "/:id/leagues/edit/:lid",
    //   dark_svg: downarr,
    //   white_svg: white_arr,
    //   component: <AddLeague />,
    //   auth: true,
    //   isShow: false,
    //   partnerColor: undefined,
    // },

    ...(jsonValue?.role !== "Operator"
      ? [
          {
            label: "Add League",
            icon: <NafesLeagueIcon />,
            path: "/:id/leagues/add",
            dark_svg: downarr,
            white_svg: white_arr,
            component: <AddLeague />,
            auth: true,
            isShow: false,
            partnerColor: undefined,
          },
          {
            label: "Edit League",
            icon: <NafesLeagueIcon />,
            path: "/:id/leagues/edit/:lid",
            dark_svg: downarr,
            white_svg: white_arr,
            component: <AddLeague />,
            auth: true,
            isShow: false,
            partnerColor: undefined,
          },
        ]
      : []),
    {
      label: "Add Tournamente",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/add",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <AddTournament />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Edit Tournamente",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/edit/:lid",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <AddTournament />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "League Details",
      icon: <NafesLeagueIcon />,
      path: "/:id/leagues/:lid",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <LeagueDetail />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Seed League Details",
      icon: <NafesLeagueIcon />,
      path: "/:id/leagues/:lid/seed/:did",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <SeedDetail title={"Drafting Phase"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Stage",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <Stage title={"Stages"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Participants",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/participants",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <Participant title={"Participants"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "List Stage",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/list",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <StageList title={"List Stage"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Seed",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/list/seed/:id",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <Seed title={"Seeding"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Matche Details",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/list/:mid",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <StageMatcheDetail />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Bulk Registration",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/bulkregistration",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <BulkRegistration title={"Bulk Registration"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Add Stage",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/add",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <AddStage />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Edit Stage",
      icon: <NafesLeagueIcon />,
      path: "/:id/tournament/:lid/stage/edit/:id",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <AddStage />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Matche Details",
      icon: <NafesLeagueIcon />,
      path: "/:id/leagues/:lid/:mid",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <MatcheDetail />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Chat",
      icon: <NafesLeagueIcon />,
      path: "/:id/leagues/:lid/chat/:mid",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <ChatDetail />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "User Details",
      icon: <NafesLeagueIcon />,
      path: "/user-controll/all-user/:id",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <UserDetail />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },
    {
      label: "Teams Members",
      icon: <NafesLeagueIcon />,
      path: "/user-controll/all-team/:id",
      dark_svg: downarr,
      white_svg: white_arr,
      component: <Member title={"Teams Members"} />,
      auth: true,
      isShow: false,
      partnerColor: undefined,
    },

    ...dynamicRoutes,
  ];
};
