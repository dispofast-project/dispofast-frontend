import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import LoginPage from "../modules/iam/pages/LoginPage";

const NotFound = (): ReactElement => <div>Not Found</div>;

const AppRouter = (): ReactElement => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/users" element={<div>Users</div>} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;