import { Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import UserDetailPage from "./pages/UserDetailPage";

const IamRoutes = () => {
  return (
    <Routes>
      <Route index element={<UsersPage />} />
      <Route path="nuevo" element={<RegisterUserPage />} />
      <Route path=":id" element={<UserDetailPage />} />
    </Routes>
  );
};

export default IamRoutes;
