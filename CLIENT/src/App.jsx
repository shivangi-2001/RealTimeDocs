import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import Index from "./components/Index";
import Document from "./components/Documents/Document";
import Title from "./components/Title";
import RegisterLogin from "./components/Authentication/Auth";
import VerifyOTP from "./components/Authentication/VerifyOTP";
import SetProfile from "./components/Authentication/set_profile";
import { useSelector } from "react-redux";
import TextEditor from "./components/TextExample";
import RichTextEditor from "./components/RichTextEditor";
import GithubCallback from "./components/Authentication/GithubLoginCallback";

function App() {
  const {authenticated} = useSelector(state => state.AuthState)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
      children: [
        { path: "/", element: authenticated? <Index />: <Navigate to="/auth/register"/> },
        { path: "/:id", element: authenticated? <Document />: <Navigate to="/auth/register"/> },
        { path: "/auth/github", element: <GithubCallback/>}
      ],
    },
    {
      path: "/auth",
      element: <Outlet />,
      children: [
        { path: "register", element: authenticated? <Navigate to="/"/>:<RegisterLogin/> },
        { path: "verify_otp", element: authenticated? <Navigate to="/"/>: <VerifyOTP /> },
        { path: "set_profile", element: authenticated? <Navigate to="/"/>: <SetProfile /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
