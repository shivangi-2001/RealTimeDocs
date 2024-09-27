import { useState } from "react";
import AuthLayout from "./AuthLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useResendOTPMutation,
  useVerifyOTPMutation,
} from "../../services/userApi";
import { DotLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../feature/AuthState";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOTP({ email, otp }).unwrap();
      if (res.message === "Login") {
        dispatch(setAccessToken(res.token));
        navigate("/");
      }
    } catch (error) {
      setMsg("");
      if (error.data?.error_message === "No OTP record found") {
        navigate("/auth/register");
      }
      setErrorMsg(error.data?.error_message);
    }
  };

  const [ResendOTP, { isLoading: resendLoading }] = useResendOTPMutation();

  const resend_otp = async () => {
    try {
      const res = await ResendOTP({ email }).unwrap();
      setErrorMsg("");
      setMsg(res.message);
    } catch (error) {
      setMsg("");
      setErrorMsg(error.data?.error_message);
    }
  };

  return (
    <AuthLayout header="Verify OTP">
      <form
        autoComplete="off"
        className="flex flex-col gap-4 w-full mx-auto p-5"
        onSubmit={handleSubmit}
      >
        <div className="relative mb-5">
          {resendLoading && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <DotLoader size="28px" color="#0000aa" />
            </div>
          )}
          {msg && <p className="text-xxs-xs ml-1.5 text-yellow-500">{msg}</p>}
          {errorMsg && (
            <p className="text-xxs-xs ml-1.5 text-red-500">{errorMsg}</p>
          )}
          <input
            className="border rounded-md px-4 py-1 w-full focus:outline-none focus:border-blue-600"
            type="text"
            name="otp"
            id="otp"
            value={otp}
            placeholder="OTP"
            maxLength={6}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <div
            className="absolute top-full right-0 text-blue-500 mt-1"
            onClick={() => resend_otp()}
          >
            <p className="text-xxs-xs cursor-pointer underline underline-offset-2">
              Resend OTP
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="text-sm border cursor-pointer rounded-2xl py-1 bg-blue-600 text-white hover:shadow-lg w-full"
        >
          Submit
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
