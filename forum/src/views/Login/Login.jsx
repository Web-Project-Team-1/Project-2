import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import './Login.css';

export default function Login() {

  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const { setAppState } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()

  const login = () => {

    if(!user.email || !user.password) {
      return alert('Please enter a username')
    }

    loginUser(user.email, user.password)
      .then((credentials) => {
        setAppState({
          user: credentials.user,
          userData: null
        })
        navigate(location.state?.from.pathname ?? '/')
      })
      .catch((error) => {
        alert(error.message)
      });
  }

  
  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value
    })
  } 

  return (
    <div>
      <h1>Login</h1>
      <label htmlFor="email">Email: </label>
      <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" />
      <br /><br />
      <label htmlFor="password">Password: </label>
      <input value={user.password} onChange={updateUser('password')} type="text" name="password" id="password" />
      <button onClick={login}>Login</button>
    </div>
  )

}