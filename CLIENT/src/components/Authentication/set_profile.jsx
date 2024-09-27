import { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useSetProfileMutation,
  useSkipSetProfileMutation,
} from "../../services/userApi";
import { BeatLoader } from "react-spinners";
import { ScaleLoader } from "react-spinners";

const SetProfile = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState([]);

  const [profilesetup, { isLoading: setprofileLoading }] =
    useSetProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await profilesetup({ email, username }).unwrap();
      console.log(res);
      if (res.message) {
        navigate(`/auth/verify_otp?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      if (error.data && error.data.errors) {
        setErrorMsg(error.data.errors);
      } else {
        if (
          error.error_message === "You are already in queue. Please verify OTP."
        ) {
          navigate(`/auth/verify_otp?email=${encodeURIComponent(email)}`);
        }
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const [skipSetProfile, {isLoading:skipLoading}] = useSkipSetProfileMutation();

  const handleSkip = async () => {
    try {
      const res = await skipSetProfile({ email }).unwrap();
      console.log(res)
      if (res.message)
        navigate(`/auth/verify_otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setErrorMsg(error.data?.error_message);
    }
  };

  return (
    <AuthLayout header="Verify OTP">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-4 w-full mx-auto p-5"
      >
        {setprofileLoading ? (
          <div className=" items-center text-center">
            <BeatLoader size="20px" />
          </div>
        ) : (
          <>
            <div className="relative mb-3">
            {skipLoading && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <ScaleLoader size="28px" color="#0000aa" />
            </div>
          )}
              <div className="flex mx-1 justify-between text-xxs-xs font-bold text-gray-500">
                <label htmlFor="username" className="select-none">
                  Username:
                </label>

                <Link
                  onClick={() => handleSkip()}
                  className="underline underline-offset-2 cursor-pointer"
                >
                  skip
                </Link>
              </div>{" "}
              <input
                className={`border rounded-md px-4 py-1 w-full ${
                  errorMsg.length > 0
                    ? "border-red-500 text-red-800"
                    : "text-black"
                } focus:outline-none focus:border-blue-600 focus-visible:bg-sea-5`}
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => {
                  setErrorMsg([]);
                  setUsername(e.target.value);
                }}
                placeholder="username"
              />
              {errorMsg.length > 0 && (
                <div className="absolute top-full right-0 text-red-500 mt-1">
                  {errorMsg.map((error, index) => (
                    <p
                      key={index}
                      className="text-xxs "
                    >{`${error.message}`}</p>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="text-sm border cursor-pointer rounded-2xl py-1 bg-blue-600 text-white hover:shadow-lg w-full"
            >
              Submit
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );
};

export default SetProfile;
