

import { useEffect } from "react";
import useUserStore from "../store/useUserStore"; 
import { checkUserAuth } from "../api/auth";


export default function AuthInit({ children }) {
  const { setUser, clearUser} = useUserStore();

  useEffect(() => {


    const verifyAuth = async () => {
      const result = await checkUserAuth();

     
      
      if (result.isAuthenticated) {
        setUser(result.user);
      } else {
        clearUser();
      }
       
    };

    verifyAuth();
  }, [ setUser, clearUser]);

  return children;
}
