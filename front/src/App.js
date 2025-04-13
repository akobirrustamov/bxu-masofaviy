import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// My pages
import Home from "./pages/home/Home";
import PageNotFound from "./pages/404/404";


import AdminHome from "./admin/AdminHome";
import LoginAdmin from "./admin/LoginAdmin";
import ApiCall from "./config/index";

// App admin
import { useTranslation } from "react-i18next";
import AdminDirection from "./admin/AdminDirection";
import AdminSemester from "./admin/AdminSemester";
import AdminSubject from "./admin/AdminSubject";
import Subject from "./admin/Subject.js";

function App() {
  const { t } = useTranslation();

  const blockedPages = ["/dashboard", "/app"];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // checkSecurity();
  }, [blockedPages, location.pathname, navigate]);

  async function checkSecurity() {
    if (blockedPages.some((blockedPage) => location.pathname.startsWith(blockedPage))) {
      let accessToken = localStorage.getItem("access_token");
      const res = await ApiCall("/api/v1/security", "GET");
      if (res?.data == 401) {
        navigate("/admin/login");
      }
      if (accessToken !== null) {
        if (res?.data !== 401 && res?.error) {
          console.log("Hello");
          if (res?.data[0]?.name !== "ROLE_ADMIN") {
            navigate("/404");
          }
        }
      } else {
        navigate("/admin/login");
      }
    }
  }

  return (
      <div>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/admin/login"} element={<LoginAdmin />} />
          <Route path={"/dashboard"} element={<AdminHome />} />
          {/* Updated route to include direction ID as a parameter */}
          <Route path={"/dashboard/direction/:id"} element={<AdminDirection />} />
          <Route path={"/dashboard/semester/:id"} element={<AdminSemester />} />
          <Route path={"/dashboard/subject/:id"} element={<AdminSubject />} />
          <Route path={"/dashboard/subject/"} element={<Subject />} />
          <Route path={"/*"} element={<PageNotFound />} />
        </Routes>
      </div>
  );
}

export default App;