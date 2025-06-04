// // src/data/menuItems.ts
// import {
//   AdminControlIcon,
//   BlogIcon,
//   DashboardIcon,
//   NafesLeagueIcon,
//   RankingSystemIcon,
//   RegistrationFormsIcon,
//   TicketsIcon,
//   TournamentsIcon,
//   UsersIcon,
// } from "../components";
// import downarr from "../assets/images/down_arr.svg";
// import white_arr from "../assets/images/white_arr.svg";
// import { Dashboard } from "../pages/Dashboard";
// import { Users } from "../pages/Users";
// import { Partners } from "../pages/Partners";
// import { Trophies } from "../pages/Trophies";
// import { Games } from "../pages/Games";
// import { Devices } from "../pages/Devices";
// import { Login } from "../pages/Login";
// import { RoutesProps } from "../utils";
// import { NafesLeague } from "../pages/League";
// import { AddLeague } from "../pages/AddLeague";

// import { Badges } from "../pages/Badges";


// export const routes: RoutesProps[] = [
//   {
//     label: "Login",
//     icon: <></>,
//     path: "/",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <Login />,
//     auth: false,
//     isShow: false,
//   },
//   {
//     label: "Dashboard",
//     icon: <DashboardIcon />,
//     path: "/dashboard",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <Dashboard />,
//     auth: true,
//     isShow: true,
//   },

//   {
//     label: "Admin Control",
//     icon: <AdminControlIcon />,
//     path: "/admin-control",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     submenu: [
//       {
//         label: "Devices",
//         path: "/admin-control/devices",
//         component: <Devices />,
//         auth: true,
//         isShow: true,
//       },

//       {
//         label: "Games",
//         path: "/admin-control/games",
//         component: <Games />,
//         auth: true,
//         isShow: true,
//       },

//       {
//         label: "Partners",
//         path: "/admin-control/partners",
//         component: <Partners />,
//         auth: true,
//         isShow: true,
//       },
//       {
//         label: "Rules",
//         path: "/admin-control/rules",
//         component: <Rules />,
//         auth: true,
//         isShow: true,
//       },
//       {
//         label: "Badge",
//         path: "/admin-control/badge",
//         component: <Badges />,
//         auth: true,
//         isShow: true,
//       },
//     ],
//     component: <Devices />,
//     auth: true,
//     isShow: true,
//   },

//   {
//     label: "Users",
//     icon: <UsersIcon />,
//     path: "/users",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     submenu: [
//       {
//         label: "Usres",
//         path: "/users",
//         component: <Users />,
//         auth: true,
//         isShow: true,
//       },
//     ],
//     component: <Users />,
//     auth: true,
//     isShow: true,
//   },

//   // {
//   //   label: "Tickets",
//   //   icon: <TicketsIcon />,
//   //   path: "#",
//   //   dark_svg: downarr,
//   //   white_svg: white_arr,
//   //   component: <></>,
//   //   auth: true,
//   //   isShow: true,
//   // },

//   // {
//   //   label: "Ranking System",
//   //   icon: <RankingSystemIcon />,
//   //   path: "#",
//   //   dark_svg: downarr,
//   //   white_svg: white_arr,
//   //   submenu: [],
//   //   component: <></>,
//   //   auth: true,
//   //   isShow: true,
//   // },

//   {
//     label: "Nafes League",
//     icon: <NafesLeagueIcon />,
//     path: "/leagues",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <NafesLeague />,
//     auth: true,
//     isShow: true,
//   },

//   {
//     label: "Add Partner",
//     icon: <NafesLeagueIcon />,
//     path: "/partner/add",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <AddPartners />,
//     auth: true,
//     isShow: false,
//   },

//   {
//     label: "Update Partner",
//     icon: <NafesLeagueIcon />,
//     path: "/partner/edit/:id",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <UpdatePartners />,
//     auth: true,
//     isShow: false,
//   },
//   {
//     label: "Add Rule",
//     icon: <NafesLeagueIcon />,
//     path: "/rules/add",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <AddRules />,
//     auth: true,
//     isShow: false,
//   },

//   {
//     label: "Update Rule",
//     icon: <NafesLeagueIcon />,
//     path: "/rules/edit/:id",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <UpdateRules />,
//     auth: true,
//     isShow: false,
//   },
//   {
//     label: "Add Badge",
//     icon: <NafesLeagueIcon />,
//     path: "/badges/add",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <AddBadges />,
//     auth: true,
//     isShow: false,
//   },

//   {
//     label: "Update Badge",
//     icon: <NafesLeagueIcon />,
//     path: "/badges/edit/:id",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <UpdateBadges />,
//     auth: true,
//     isShow: false,
//   },

//   {
//     label: "Add League",
//     icon: <NafesLeagueIcon />,
//     path: "/leagues/add",
//     dark_svg: downarr,
//     white_svg: white_arr,
//     component: <AddLeague />,
//     auth: true,
//     isShow: false,
//   },

//   // {
//   //   label: "Tournaments",
//   //   icon: <TournamentsIcon />,
//   //   path: "#",
//   //   dark_svg: downarr,
//   //   white_svg: white_arr,
//   //   component: <></>,
//   //   auth: true,
//   //   isShow: true,
//   // },

//   // {
//   //   label: "Blog",
//   //   icon: <BlogIcon />,
//   //   path: "#",
//   //   dark_svg: downarr,
//   //   white_svg: white_arr,
//   //   submenu: [],
//   //   component: <></>,
//   //   auth: true,
//   //   isShow: true,
//   // },

//   // {
//   //   label: "Registration Forms",
//   //   icon: <RegistrationFormsIcon />,
//   //   path: "#",
//   //   dark_svg: downarr,
//   //   white_svg: white_arr,
//   //   component: <></>,
//   //   auth: true,
//   //   isShow: true,
//   // },
// ];
