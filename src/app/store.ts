import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import partnerReducer from "./features/partners/partnerSlice";
import trophyReducer from "./features/trophies/trophiesSlice";
import badgeReducer from "./features/badge/badgeSlice";
import deviceReducer from "./features/devices/deviceSlice";
import gameReducer from "./features/games/gameSlice";
import leaguesReducer from "./features/league/leagueSlice";
import adminReducer from "./features/admins/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    partner: partnerReducer,
    trophy: trophyReducer,
    badge: badgeReducer,
    device: deviceReducer,
    game: gameReducer,
    leagues: leaguesReducer,
    admins: adminReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
