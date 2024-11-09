import { createContext, useState, useContext, useEffect } from "react";
import { getCookie } from "../miniFunctions/cookie-parser";

const SUserContext = createContext(undefined);

export const ServerUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // User state to hold fetched user data
    const [loading, setLoading] = useState(true);  // Loading state to control rendering during fetch

    // Check if token is available and fetch user data
    useEffect(() => {
        const token = getCookie("token");

        if (token){
            // Fetch user data if token is found
            fetch('http://localhost:8000/user/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data);  // Set user data if fetch is successful
                    setLoading(false);  // Set loading to false after data is fetched
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);  // Set loading to false even in case of error
                });
        } else {
            setLoading(false);  // No token, stop loading
        }
    }, []);  // Add navigate as a dependency to prevent any stale closure issues

    // If loading, show nothing or a loading spinner
    if (loading) {
        return <div>Loading...</div>;  // Optionally replace with a spinner or loader
    }

    console.log(user);

    // If user is fetched, provide it to the rest of the app, else redirect
    return (
        <SUserContext.Provider value={user}>{children}</SUserContext.Provider>
    );
};

// Hook to access the user context
export const useServerUser = () => useContext(SUserContext);