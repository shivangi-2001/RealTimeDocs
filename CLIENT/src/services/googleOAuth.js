import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // use '/react' to generate hooks

export const GoogleOAuthApi = createApi({
  reducerPath: "OAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/auth" }),
  endpoints: (builder) => ({
    getGoogleCode: builder.mutation({
      query: (code) => ({
        url: `google?code=${code}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetGoogleCodeMutation } = GoogleOAuthApi;
