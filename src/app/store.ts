import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import partnerReducer from "./features/partners/partnerSlice";
import ruleReducer from "./features/rules/ruleSlice";
import badgeReducer from "./features/badge/badgeSlice";
import deviceReducer from "./features/devices/deviceSlice";
import gameReducer from "./features/games/gameSlice";
import gameIdReducer from "./features/gameId/gameIdSlice";
import leaguesReducer from "./features/league/leagueSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    partner: partnerReducer,
    rule: ruleReducer,
    badge: badgeReducer,
    device: deviceReducer,
    game: gameReducer,
    gameId: gameIdReducer,
    leagues: leaguesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
