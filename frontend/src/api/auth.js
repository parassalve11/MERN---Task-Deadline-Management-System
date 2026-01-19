//frontend/src/api/auth.js
import axiosInstance from "../lib/axios";





export const checkUserAuth = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
   
    
    return {
      isAuthenticated: true,
      user: res.data,
    };
  } catch (error) {
    console.log(error);
    
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};
