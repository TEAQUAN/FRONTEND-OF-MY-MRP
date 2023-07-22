import React, { useState } from "react";
import { forgetPassword } from "../../api/auth";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/Forminput";
import Submit from "../form/Submit";
import Title from "../form/Title";

function ForgetPassword() {

    const [email, setEmail] = useState("");
    const { updateNotification } = useNotification();
  
    const handleChange = ({ target }) => {
      const { value } = target;
      setEmail(value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isValidEmail(email))
        return updateNotification("error", "Invalid email!");
  
      const { error, message } = await forgetPassword(email);
      if (error) return updateNotification("error", error);
  
      updateNotification("error", message);
    };
    
    return (
        <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
            <Container>
                <form
                    onSubmit={handleSubmit} className="bg-secondary rounded p-6 w-96 space-y-6">
                    <Title>Please enter your Email</Title>
                    <FormInput label="Email" placeholder="ENTER EMAIL"
                        onChange={handleChange}
                        value={email}
                        name="email" />
                    <Submit value="Send Link" />

                    <div className="flex justify-between">
                        <CustomLink to="/auth/signin">Sign in</CustomLink>
                        <CustomLink to="/auth/signup">Sign up</CustomLink>
                    </div>
                </form>
            </Container>
        </div>
    )
}

export default ForgetPassword;
