import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormInput from "../form/Forminput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { useAuth } from "../../hooks";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";


const validateUserInfo = ({ email, password }) => {
  

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};
export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const {isPending, isLoggedIn} = authInfo
  console.log(authInfo);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    console.log(name);
    setUserInfo({ ...userInfo, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);
    handleLogin(userInfo.email, userInfo.password);
  };

  // useEffect(() => {
  //   // we want to move our user to somewhere else
  //   if (isLoggedIn) navigate("/");
  // }, [isLoggedIn]);

  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form onSubmit={handleSubmit} className="bg-secondary rounded p-6 w-72 space-y-6">
          <Title>Sign in</Title>
          <FormInput
          value={userInfo.email}
            label="Email"
            placeholder="john@email.com"
            onChange={handleChange}
            name="email" />
          <FormInput
            label="Password"
            placeholder="********"
            onChange={handleChange}
            name="password"
            value={userInfo.password}
            type="password"
             />

          <Submit value="Sign in"
          busy={isPending} />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </div>
  );
}