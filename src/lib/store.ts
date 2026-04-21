import { configureStore } from "@reduxjs/toolkit";
import { agentReducer } from "@/features/agent/agentSlice";
import { postsApi } from "@/features/posts/postsApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      agent: agentReducer,
      [postsApi.reducerPath]: postsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [],
        },
      }).concat(postsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
