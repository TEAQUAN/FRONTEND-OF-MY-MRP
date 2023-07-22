import Container from "../Container";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormInput from "../form/Forminput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { useState } from "react";
import { ImSpinner3 } from "react-icons/im"
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";
import { useEffect } from "react";




export default function ConfirmPassword() {

  const [password, setPassword] = useState({
    one: '',
    two: '',
  })
  const [isValid, setisValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const { updateNotification } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    isValidToken()
  }, [])

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id)
    if (error) {
      navigate('/auth/reset-password', { replace: true })
      return updateNotification("error", error)
    }

    if (!valid) {
      setisValid(false)
      setIsVerifying(false)
      console.log("rara")
      return navigate('/auth/reset-password', { replace: true })

    }
    setisValid(true)
    setIsVerifying(false)
  }

  const handleChange = ({ target }) => {
    const { name, value } = target
    setPassword({ ...password, [name]: value })
  }

  const handleSubmit = async (e) => {
     e.preventDefault()
    if(password.one.trim().length < 8) return updateNotification('error','passwords must be 8 characters long')

     if(password.one !== password.two) return updateNotification('error','passwords do not match')
    const {error, message} = await resetPassword({newPassword: password.one,
       userId: id, 
        token})

    if (error)   return updateNotification("error", error)
    
    updateNotification("success", message)
    navigate('auth/signin', {replace: true})
    }


  if (isVerifying) return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <div className="flex space-x-2 items-center">
          <h1 className="text-4xl font-semibold text-white ">Please wait</h1>
          <ImSpinner3 className="animate-spin text-4xl text-white" />
        </div>

      </Container>
    </div>
  )
  if (!isValid) return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <h1 className="text-4xl font-semibold text-white ">Sorry the token is invalid!</h1>

      </Container>
    </div>

  )
  return (
    <div onSubmit={handleSubmit} className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-96 space-y-6">
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            placeholder="********"
            name="one"
            type="password"
            value={password.one}
            onChange={handleChange}
          />
          <FormInput
           value={password.two}
           onChange={handleChange}
            label="Confirm Password"
            placeholder= "********"
            name="two"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </div>
  );
}
