import "./index.css";
import { useEffect } from "react";
import TestGraph from './Components/TestGraph/TestGraph';
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Notification from "./Components/Notification/Notification";
import UserPageLayout from "./layout/UserPageLayout/UserPageLayout";
import UserPage from "./pages/UserPage/UserPage";
import ReviewsPage from "./pages/ReviewsPage/ReviewsPage";
import UserSchedulePage from "./pages/UserSchedulePage/UserSchedulePage";
import AdminPageLayout from "./layout/AdminPageLayout/AdminPageLayout";
import VehiclesPage from "./pages/VehiclesPage/VehiclesPage";
import TasksPage from "./pages/TasksPage/TasksPage";
import TaskAddPage from "./pages/TaskAddPage/TaskAddPage";
import Graph from "./Components/Graph/Graph";
import Header from "./Components/Header/Header";
import HomePageLayout from "./layout/HomePageLayout/HomePageLayout";
import SignUpForm from "./Components/SignUpForm/SignUpForm";
import SignInForm from "./Components/SignInForm/SignInForm";
import WorkersPage from "./pages/WorkersPage/WorkersPage";
import ResponsiveSlice from "./redux/slices/ResponsiveSlice";
import { useDispatch, useSelector } from "react-redux";
import { SmallNotificationStore, UserStore } from "./redux/selectors";
import { getAllMcps, getMcpById } from "./redux/slices/McpSlice";
import { getMe, login, registeUser } from "./redux/slices/UserSlice";
import { assignWorkersToVehicle, getAllVehicles, getVehicleById } from "./redux/slices/VehiclesSlice";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Loggedin from "./middlewares/Loggedin";
import CheckMe from "./middlewares/CheckMe";
import BackofficerOnly from "./middlewares/BackofficerOnly";
import SmallNotification from "./Components/SmallNotification/SmallNotification";

function App() {
  const location = useLocation();
  const dispatch = useDispatch<any>();
  const errorIsShow = useSelector(SmallNotificationStore).show
  useEffect(() => {
    // dispatch(login({
    //   "email": "trivan@gmail.com",
    //   "password":"123456"
    // }))
    // dispatch(assignWorkersToVehicle({
    //   "vehicleId":"6433815df9807950d0ce5809",
    //   "workerIds":[
    //       {
    //           "id":"64323e21f8eef17b5dfe144d"
    //       }
    //   ],
    //   "typeVehicle":"janitor"
    // }))
    //   .then((res: any) => {
    //     console.log(res)
    //   })
    if (window.innerWidth < 1024) {
      dispatch(ResponsiveSlice.actions.responsiveYesHandle({ data: true }))
    }
    else {
      dispatch(ResponsiveSlice.actions.responsiveNoHandle({ data: false }))
    }
    function handleResponsive() {
      if (window.innerWidth < 1024) {
        dispatch(ResponsiveSlice.actions.responsiveYesHandle({ data: true }))
      }
      else {
        dispatch(ResponsiveSlice.actions.responsiveNoHandle({ data: false }))
      }
    }
    window.addEventListener('resize', handleResponsive)
    return () => {
      window.removeEventListener('resize', handleResponsive)
    }
  }, [])
  return (
    <div className="App min-h-screen">
      {/* comments cua trivan */}
      {/* <TestGraph/> */}
      <Header />
      <div className="w-full h-headerSm lg:h-headerLg"></div>
      <AnimatePresence mode="wait">
        {
          errorIsShow &&
          <SmallNotification />
        }
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route path="" element={<CheckMe />} >
            <Route path="/" element={<HomePageLayout />} >
              <Route path="" element={<Home />} />
              <Route path="" element={<Loggedin />}>
                <Route path="signup" element={
                  <div className="w-full h-full flex justify-center pt-20">
                    <SignUpForm />
                  </div>} />
                <Route path="signin" element={
                  <div className="w-full h-full flex justify-center pt-32">
                    <SignInForm />
                  </div>
                } />
              </Route>
            </Route>
            {/* <Route path="/login/success" element={<Notification />} />
              <Route path="/login/failure" element={<Notification />} /> */}

            <Route path="/user" element={<UserPageLayout />}>
              <Route path="profile" element={<UserPage />} />
              {/* can perform query in url */}
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="schedule" element={<UserSchedulePage />} />
              <Route path="" element={<PageNotFound />} />
            </Route>

            <Route path="" element={<BackofficerOnly />} >
              <Route path="/admin" element={<AdminPageLayout />
              }>
                <Route path="profile" element={<UserPage />} />
                <Route path="overview" element={<OverviewPage />} />
                <Route path="workers" element={<WorkersPage />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="tasks/add" element={<TaskAddPage />} />
                <Route path="" element={<PageNotFound />} />
              </Route>
            </Route>


            {/* testing route trivan*/}
            <Route path="/testing/trivan" element={<Home />} />
            {/* testing route thinhchung*/}
            <Route path="/testing/thinhchung" element={<Home />} />
            {/* testing route quangphuc*/}
            <Route path="/testing/thinhchung" element={<Home />} />
            {/* testing route chungson*/}
            <Route path="/testing/thinhchung" element={<Home />} />
            <Route path="/notification" element={<HomePageLayout />} >
              <Route path="" element={
                <div className="w-full h-full flex justify-center pt-32">
                  <Notification />
                </div>
              } />
            </Route>
            <Route path="/*" element={<PageNotFound />} />
          </Route>
        </Routes>
        {/* <button onClick={() => {
            // dispatch(logout())
            console.log(user)
          }}>Click me</button> */}
      </AnimatePresence>
    </div>
  );
}

export default App;
