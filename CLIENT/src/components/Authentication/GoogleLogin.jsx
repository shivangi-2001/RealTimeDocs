import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useGetGoogleCodeMutation } from "../../services/googleOAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../feature/AuthState";

function GoogleLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [GoogleQuery] = useGetGoogleCodeMutation();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        let code = authResult.code;
        const result = await GoogleQuery(code).unwrap();
        if (result.message === "Login") {
          dispatch(setAccessToken(result.token));
          navigate("/"); 
        }
      }
    } catch (error) {
      console.log("Error during Google login:", error);
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      className="p-3 shadow rounded-full hover:bg-gray-200"
      onClick={googlelogin} 
    >
      <img src="/google.png" alt="Google Login" className="w-6" />
    </button>
  );
}

export default GoogleLogin;
