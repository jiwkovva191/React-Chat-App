import { useState } from "react"
import { useAuth } from "../utils/AuthContext"
import { Link } from "react-router-dom"

export default function Register(){
    const {handleUserRegister} = useAuth()
    const [credentials, setCredentials] = useState({
        name:'',
        email:'',
        password1:'',
        password2:''
    })
    const handleInputChange = (e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setCredentials({...credentials, [name]:value});
    }
    return(
        <div>
      <div>
        <form onSubmit={(e)=>{handleUserRegister(e,credentials)}}>
        <div>
            <label htmlFor="">Name:</label>
            <input
              type="text"
              required
              name="name"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="">Email:</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="">Password:</label>
            <input
              type="password"
              required
              name="password1"
              placeholder="Enter your password"
              value={credentials.password1}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="">Confirm Password:</label>
            <input
              type="password"
              required
              name="password2"
              placeholder="Confirm your password"
              value={credentials.password2}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input type="submit" value="Register" />
          </div>
        </form>
       <p>Already have an account? <Link to ="/login">Login</Link></p>
      </div>
    </div>
    )
}