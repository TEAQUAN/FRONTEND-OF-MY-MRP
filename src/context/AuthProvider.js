import { useEffect, createContext, useState } from "react";
import { getIsAuth,signInUser } from "../api/auth";
import { useNotification } from "../hooks";
import { useNavigate,BrowserRouter } from "react-router-dom";


export const AuthContext = createContext();

const defaultAuthInfo = {
    profile: null,
    isLoggedIn: false,
    isPending: false,
    error: "",
};

function AuthProvider({ children }) {
    const navigate =  useNavigate()
    const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

    const { updateNotification } = useNotification()

 
    
    const handleLogin = async (email, password) => {
        setAuthInfo({ ...authInfo, isPending: true });
        const { error, user } = await signInUser({ email, password });
        if (error) {
            updateNotification('error', error)
            return setAuthInfo({ ...authInfo, isPending: false, error });
        }
        navigate('/',{replace:true})
        setAuthInfo({
            profile: { ...user },
            isPending: false,
            isLoggedIn: true,
            error: "",
        });

        localStorage.setItem("auth-token", user.token);
    };

    const isAuth = async () => {
        const token = localStorage.getItem('auth-token')
        if (!token) return;
        setAuthInfo({ ...authInfo, isPending: true });

        const { error, user } = await getIsAuth(token)
        if (error) {
            updateNotification('error', error)
            return setAuthInfo({ ...authInfo, isPending: false, error });
        }

        setAuthInfo({
            profile: { ...user },
            isPending: false,
            isLoggedIn: true,
            error: "",
        });
    }
    //   handleLogout, isAuth
    const handleLogout = () => {
        localStorage.removeItem('auth-token')
        setAuthInfo({
            profile: { ...defaultAuthInfo }
        });
    }
    useEffect(() => {
        isAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ authInfo, handleLogin, handleLogout, isAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider