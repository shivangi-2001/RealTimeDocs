import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./GoogleLogin";
import GithubLogin from "./GithubLogin";

function AuthLayout({ header, children }) {
  return (
    <div className="bg-sea-200 h-screen flex items-center justify-center">
      <div className="bg-white p-5 w-10/12 sm:w-3/5 lg:w-2/6 mx-auto border rounded-2xl shadow-xl">
        <div className="container mx-auto">
          <h4 className="text-xs text-center text-gray-400 font-semibold mb-4">
            {header}
          </h4>
          <div className="flex items-center justify-center gap-4 mb-5">
            <GoogleOAuthProvider clientId="1068114928708-77klo83salu6m00j3j822nmjmo7c1gka.apps.googleusercontent.com"><GoogleLogin/></GoogleOAuthProvider>
            <GithubLogin/>
          </div>
          <div className="flex flex-1 items-center">
            <div className="border-b border-gray-300 w-36 mx-auto"></div>
            <span className="mx-1.5 text-gray-300">OR</span>
            <div className="border-b border-gray-300 w-36 mx-auto"></div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
