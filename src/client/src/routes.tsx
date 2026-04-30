import { createBrowserRouter, Navigate } from "react-router"
import Layout from "./components/Layout"
import ErrorPage from "./pages/ErrorPage"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Meeting from "./pages/Meeting"
import { authLoader } from "./loaders/auth.loader"
import { userLoader } from "./loaders/user.loader"
import { homeLoader } from "./loaders/home.loader"
import { profileLoader } from "./loaders/profile.loader"
import { meetingLoader } from "./loaders/meeting.loader"
import { signUpAction } from "./actions/signUp.action"
import { signInAction } from "./actions/signIn.action"
import { profileFormAction } from "./actions/profileForm.action"
import { createMeetingAction } from "./actions/createMeeting.action"
import { sendInvitesAction } from "./actions/sendInvites.action"

const router = createBrowserRouter([
  {
    id: "root",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: userLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { path: "home", element: <Navigate to="/" replace /> },
          { path: "index", element: <Navigate to="/" replace /> },
          {
            path: "/",
            element: <Home />,
            loader: homeLoader,
            action: createMeetingAction,
          },
          {
            path: "sign-up",
            element: <SignUp />,
            loader: authLoader,
            action: signUpAction,
          },
          {
            path: "sign-in",
            element: <SignIn />,
            loader: authLoader,
            action: signInAction,
          },
          {
            path: "profile",
            element: <Profile />,
            loader: profileLoader,
            action: profileFormAction,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "*",
            element: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "meeting",
    element: <Meeting />,
    errorElement: <ErrorPage />,
    loader: meetingLoader,
    action: sendInvitesAction,
  },
])

export default router
