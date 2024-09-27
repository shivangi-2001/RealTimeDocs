import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const AuthToken = localStorage.getItem("_eid");
  const result = await baseQuery(
    {
      ...args,
      headers: {
        ...args.headers,
        "Content-Type": "application/json",
        authorization: AuthToken ? `Bearer ${AuthToken}` : "",
      },
    },
    api,
    extraOptions
  );

  return result;
};

export const docApi = createApi({
  reducerPath: "docApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    initDoc: builder.mutation({
      query: (title) => ({
        url: "/init",
        method: "POST",
        body: title,
      }),
    }),
    AllDoc: builder.mutation({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
    }),
    getDoc: builder.mutation({
      query: (id) => ({
        url: `docs/${id}`,
        method: "GET",
      }),
    }),
    renameTitle: builder.mutation({
      query: ({ id, title }) => ({
        url: `docs/${id}`,
        method: "PATCH",
        body: { title },
      }),
    }),
    deleteDoc: builder.mutation({
      query: (id) => ({
        url: `docs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useInitDocMutation,
  useAllDocMutation,
  useGetDocMutation,
  useRenameTitleMutation,
  useDeleteDocMutation
} = docApi;
