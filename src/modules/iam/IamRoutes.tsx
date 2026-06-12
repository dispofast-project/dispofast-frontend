import { Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import RegisterUserPage from "./pages/RegisterUserPage";

const IamRoutes = () => {
  return (
    <Routes>
      <Route index element={<UsersPage />} />
      <Route path="nuevo" element={<RegisterUserPage />} />
    </Routes>
  );
};

export default IamRoutes;
