import { useState } from "react";
import { useRegisterMutation } from "../../services/userApi";
import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

function RegisterLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState([]);
  const [Register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if(email === "") setErrorMsg("Email is required")
    try {
      const res = await Register({ email }).unwrap();
      setErrorMsg([]);
      if (res.message === "OK" || res.new_user?.email) {
        navigate(`/auth/set_profile?email=${encodeURIComponent(res.new_user.email)}`);
      } else if (res.message === "OTP sent to your email" || res.message === "Check your email inbox or spam") {
        setNote(res.message);
        setTimeout(() => {
          navigate(`/auth/verify_otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (error) {
      if (error?.data?.errors) {
        console.log(error.data)
        setErrorMsg(error.data.errors);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <AuthLayout header="Register or Login with:">
      <form
        autoComplete="off"
        className="flex flex-col gap-4 w-full mx-auto p-5"
        onSubmit={handleSubmit}
      >
        <div className="relative mb-3">
          {isLoading ? (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <BeatLoader size="20px" color="#000011" />
            </div>
          ) : (
            <input
              className={`border rounded-md px-4 py-1 w-full ${errorMsg.length > 0 ? "border-red-500 text-red-800" : ""} focus:outline-none focus:border-blue-600`}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setErrorMsg([]); // Reset errors on input change
                setEmail(e.target.value);
              }}
            />
          )}
          {errorMsg.length > 0 && (
            <div className="absolute top-full left-0 text-red-500 mt-1">
              {errorMsg.map((error, index) => (
                <p key={index} className="text-xs">{`${error.field}: ${error.message}`}</p>
              ))}
            </div>
          )}
          {note && (
            <p className="text-xs text-yellow-600 select-none absolute right-0">
              {note}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="text-sm border cursor-pointer rounded-2xl py-1 bg-blue-600 text-white hover:shadow-lg w-full"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterLogin;
