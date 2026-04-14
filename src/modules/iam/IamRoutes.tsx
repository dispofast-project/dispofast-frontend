import { Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";

const IamRoutes = () => {
  return (
    <Routes>
      <Route index element={<UsersPage />} />
    </Routes>
  );
};

export default IamRoutes;
