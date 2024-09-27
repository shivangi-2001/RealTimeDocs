import { createSlice } from "@reduxjs/toolkit";

function getExpirationTime(token) {
  if (!token) {
    return null;
  }
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const expirationTimeInSeconds = payload.exp;
    if (!expirationTimeInSeconds) return null;
    const expirationTimeInMilliseconds = expirationTimeInSeconds * 1000;
    return expirationTimeInMilliseconds;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token) {
  const expireDate = getExpirationTime(token);
  return expireDate ? new Date(expireDate).getTime() < Date.now() : true;
}

const initialState = {
  accessToken: localStorage.getItem("_eid") || "",
  authenticated: !!localStorage.getItem("_eid") && !isTokenExpired(localStorage.getItem("_eid")),
};

export const AuthState = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      localStorage.setItem("_eid", action.payload);
      state.accessToken = action.payload;
      state.authenticated = !isTokenExpired(action.payload);
    },
    logout: (state) => {
      localStorage.removeItem("_eid");
      state.accessToken = "";
      state.authenticated = false;
    },
  },
});

export const { setAccessToken, logout } = AuthState.actions;

export default AuthState.reducer;
