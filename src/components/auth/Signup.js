import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormInput from "../form/Forminput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import createUser from "../../api/auth";
import { useNotification } from "../../hooks";
import { useAuth } from "../../hooks";
import { isValidEmail } from "../../utils/helper";


const validateUserInfo = ({ name, email, password }) => {
    const isValidName = /^[a-z A-Z]+$/;
  
    if (!name.trim()) return { ok: false, error: "Name is missing!" };
    if (!isValidName.test(name)) return { ok: false, error: "Invalid name!" };
  
    if (!email.trim()) return { ok: false, error: "Email is missing!" };
    if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };
  
    if (!password.trim()) return { ok: false, error: "Password is missing!" };
    if (password.length < 8)
      return { ok: false, error: "Password must be 8 characters long!" };
  
    return { ok: true };
  };
export default function Signup() {

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: ""
    })

    const navigate = useNavigate()
    const { updateNotification } = useNotification();
    const {  authInfo } = useAuth();
    const {isLoggedIn} = authInfo;

    function handleChange({ target }) {
        const { value, name } = target;
        setUserInfo({ ...userInfo, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);
    if (response.error) return console.log(response.error);

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
    };

    useEffect(() => {
        // we want to move our user to somewhere else
        if (isLoggedIn) navigate("/");
      }, [isLoggedIn]);
    const { name, email, password } = userInfo;
    return (
        <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
            <Container>
                <form onSubmit={handleSubmit} className="bg-secondary rounded p-6 w-72 space-y-6">
                    <Title>Sign up</Title>
                    <FormInput onChange={handleChange}
                        value={name}
                        label="Name"
                        placeholder="John Doe"
                        name="name" />
                    <FormInput
                        onChange={handleChange}
                        value={email}
                        label="Email"
                        placeholder="john@email.com"
                        name="email" />
                    <FormInput
                        onChange={handleChange}
                        type="password"
                        value={password}
                        label="Password"
                        placeholder="********"
                        name="password" />
                    <Submit value="Sign up" />

                    <div className="flex justify-between">
                        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
                        <CustomLink to="/auth/signin">Sign in</CustomLink>
                    </div>
                </form>
            </Container>
        </div>
    );
}
