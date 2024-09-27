import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/auth" }),
  endpoints: (builder) => ({
    register: builder.mutation({
        query: ({email}) => ({
            url: '/register',
            method: "POST",
            body: {email}
        })
    }),
    setProfile: builder.mutation({
      query: ({email, username}) => ({
        url: `/set_profile?email=${email}`,
        method: 'POST',
        body: {username}
      })
    }),
    skipSetProfile: builder.mutation({
      query: ({email}) => ({
        url: `/skip_set_profile?email=${email}`,
        method: 'GET'
      })
    }),
    verifyOTP: builder.mutation({
      query: ({email, otp}) => ({
        url: `/verify_otp?email=${email}`,
        method: 'POST',
        body: {user_otp: otp}
      })
    }),
    ResendOTP: builder.mutation({
      query: ({email}) => ({
        url: `/resend_otp?email=${email}`,
        method: 'GET'
      })
    })
  }),
});

export const { useRegisterMutation, useSetProfileMutation, useSkipSetProfileMutation, useVerifyOTPMutation, useResendOTPMutation } = userApi;
