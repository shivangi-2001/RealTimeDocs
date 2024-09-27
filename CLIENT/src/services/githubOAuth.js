import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // use '/react' to generate hooks

export const GithubOAuthApi = createApi({
  reducerPath: "GithubOAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/auth" }),
  endpoints: (builder) => ({
    getGithubCode: builder.mutation({
      query: (code) => ({
        url: `github/callback?code=${code}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetGithubCodeMutation } = GithubOAuthApi;
