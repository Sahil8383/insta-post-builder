import { configureStore } from "@reduxjs/toolkit";
import { agentReducer } from "@/features/agent/agentSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      agent: agentReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [],
        },
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
