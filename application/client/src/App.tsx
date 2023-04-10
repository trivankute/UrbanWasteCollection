import "./index.css";
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

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {/* comments cua trivan */}
      <TestGraph/>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<Home/>} />
          <Route path="/login" element={<Home/>} />
          <Route path="/login/success" element={<Notification/>} />
          <Route path="/login/failure" element={<Notification/>} />

          <Route path="/user" element={<UserPageLayout/>}>
            <Route path="/" element={<UserPage/>} />
            {/* can perform query in url */}
            <Route path="/reviews" element={<ReviewsPage/>} />
            <Route path="/schedule" element={<UserSchedulePage/>} />
          </Route>

          <Route path="/admin" element={<AdminPageLayout/>
          }>
            <Route path="/" element={<UserPage/>} />
            <Route path="/vehicles" element={<VehiclesPage/>} />
            <Route path="/tasks" element={<TasksPage/>} />
            <Route path="/tasks/add" element={<TaskAddPage/>} />
          </Route>
          
          {/* testing route trivan*/}
          <Route path="/testing/trivan" element={<Home/>} />
          {/* testing route thinhchung*/}
          <Route path="/testing/thinhchung" element={<Home/>} />
          {/* testing route quangphuc*/}
          <Route path="/testing/thinhchung" element={<Home/>} />
          {/* testing route chungson*/}
          <Route path="/testing/thinhchung" element={<Home/>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
