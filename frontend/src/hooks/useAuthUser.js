import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  // Query (get request) to get request of authUser to check user is authenticated or not then navigate user based on it
  const authUser = useQuery({
    
    queryKey: ["authUser"], // fetching authentication user data queryKey
    queryFn: getAuthUser,
    retry: false, // auth check only one time otherwise tanstack query send request again and again untill it gets proper conformation regarding data
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;

// authData.user because we send data in user as we previously set in backend under routes folder in auth.route.js file
// ?. if authData not found return undefine or null without throughing an error
