import React from "react";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../store/slicers/themeSlice";

const DashboardHome = () => {
  const darkMode = useSelector(selectDarkMode);

  return (
    <div className="px-4 py-6 w-full h-full">
      <header className="mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Dashboard
        </h1>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          Welcome to the dashboard.
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 ">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Dashboard Content</h2>
        <p className="dark:text-gray-300">
          This is a placeholder dashboard. In a full application, this would show various metrics and data visualizations.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;