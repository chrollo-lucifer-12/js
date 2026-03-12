import { useContext } from "react";
import { RouterContext } from "../components/contexts";

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext)!;
  return navigate;
};
