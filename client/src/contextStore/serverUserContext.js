import {createContext, useState, useContext, useEffect} from "react";
import {getCookie} from "../miniFunctions/cookie-parser";

const SUserContext = createContext(undefined);

export const ServerUserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getCookie("token");

        if (token) {
            fetch('http://localhost:8000/user/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <SUserContext.Provider value={user}>{children}</SUserContext.Provider>
    );
};

export const useServerUser = () => useContext(SUserContext);
