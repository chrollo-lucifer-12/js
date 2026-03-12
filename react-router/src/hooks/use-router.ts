import { useContext } from "react";
import { RouterContext } from "../components/contexts";

export const useRouter = () => {
  const { navigate, params } = useContext(RouterContext)!;
  return { navigate, params };
};
