import { useRoutes } from "react-router-dom";
import routes from "./IndexRoutes";

export default function ManageRoutes() {
  return useRoutes(routes);
}
