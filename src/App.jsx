import "./App.css";
import { RouterProvider } from "react-router-dom";
import ThemeWrapper from "./providers/ThemeWrapper";
import { router } from "./routes/router";
import { CustomToastContainer } from "./components/Notifications/ToastDemo";
import { useSelector } from "react-redux";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  
  return (
    <>
      <ThemeWrapper>
        <div className="app">
          <CustomToastContainer darkMode={darkMode} />
          <RouterProvider router={router} />
        </div>
      </ThemeWrapper>
    </>
  );
}

export default App;
