import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/check-auth.jsx";
import ErrorBoundary, { NotFound } from "./components/ErrorBoundary.jsx";
import Navbar from "./components/navbar.jsx";
import Tickets from "./page/tickets.jsx";
import TicketDetailsPage from "./page/ticket.jsx";
import Login from "./page/login.jsx";
import Signup from "./page/signup.jsx";
import Admin from "./page/admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Navbar />
        <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protected={true}>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protected={true}>
              <TicketDetailsPage />
            </CheckAuth>
          }
        />
        <Route
          path="/login"
          element={
            <CheckAuth protected={false}>
              <Login />
            </CheckAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <CheckAuth protected={false}>
              <Signup />
            </CheckAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <CheckAuth protected={true}>
              <Admin />
            </CheckAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);