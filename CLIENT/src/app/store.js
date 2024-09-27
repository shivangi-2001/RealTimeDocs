import { configureStore } from "@reduxjs/toolkit";
import pageStateReducer from "../feature/pageState";
import docStateReducer from "../feature/docState";
import AuthStateReducer from "../feature/AuthState";
import { docApi } from "../services/docApi";
import { userApi } from "../services/userApi";
import { GoogleOAuthApi } from "../services/googleOAuth";
import {GithubOAuthApi} from "../services/githubOAuth";

export const store = configureStore({
  reducer: {
    pageState: pageStateReducer,
    docState: docStateReducer,
    AuthState: AuthStateReducer,
    [docApi.reducerPath]: docApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [GoogleOAuthApi.reducerPath]: GoogleOAuthApi.reducer,
    [GithubOAuthApi.reducerPath]: GithubOAuthApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      docApi.middleware,
      userApi.middleware,
      GoogleOAuthApi.middleware,
      GithubOAuthApi.middleware
    ),
});
