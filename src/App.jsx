import ManageRoutes from "./routers/ManageRoutes";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <ManageRoutes />
    </ThemeProvider>
  );
}
