import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/orders/Orders";
import Positions from "./pages/positions/Positions";
import Account from "./pages/account/Account";
import Signup from "./pages/authentication/signup/Signup";
import Signin from "./pages/authentication/signin/Signin";
import Tools from "./pages/tools/Tools";
import TradingChart from "./pages/tradingChart/TradingChart";
import LandingPage from "./pages/landing/LandingPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Home />} >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="positions" element={<Positions />} />
            <Route path="account" element={<Account />} />
            <Route path="tools" element={<Tools />} />
            <Route path="chart" element={<TradingChart />} />
          </Route>
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
          <Route path="/positions" element={<Navigate to="/app/positions" replace />} />
          <Route path="/account" element={<Navigate to="/app/account" replace />} />
          <Route path="/tools" element={<Navigate to="/app/tools" replace />} />
          <Route path="/chart" element={<Navigate to="/app/chart" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
