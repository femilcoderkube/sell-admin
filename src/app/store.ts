import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import partnerReducer from "./features/partners/partnerSlice";
import trophyReducer from "./features/trophies/trophiesSlice";
import badgeReducer from "./features/badge/badgeSlice";
import deviceReducer from "./features/devices/deviceSlice";
import gameReducer from "./features/games/gameSlice";
import leaguesReducer from "./features/league/leagueSlice";
import tournamentReducer from "./features/tournament/tournamentSlice";
import bulkJoinReducer from "./features/tournament/bulkJoinSlice";
import tournamentStageSlice from "./features/tournament/tournamentStageSlice";
import teamReducer from "./features/team/teamSlice";
import adminReducer from "./features/admins/adminSlice";
import newadminReducer from "./features/admins/newadminSlice";
import adminAccessReducer from "./features/admins/adminAccessSlice";
import booleanReducer from "./features/sidebar/booleanSlice";
import usersReducer from "./features/users/usersSlice";
import fileUploadReducer from "./features/fileupload/fileUploadSlice";
import bannedUsersReducer from "./features/bannedusers/bannedUsersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    partner: partnerReducer,
    trophy: trophyReducer,
    badge: badgeReducer,
    device: deviceReducer,
    game: gameReducer,
    leagues: leaguesReducer,
    tournaments: tournamentReducer,
    tournamentStage: tournamentStageSlice,
    teams: teamReducer,
    admins: adminReducer,
    newadmin: newadminReducer,
    boolean: booleanReducer,
    adminAccess: adminAccessReducer,
    users: usersReducer,
    fileUpload: fileUploadReducer,
    bannedUsers: bannedUsersReducer,
    bulkJoin: bulkJoinReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
