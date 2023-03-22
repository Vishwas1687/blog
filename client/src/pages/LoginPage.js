import {useState,useContext} from 'react';
import {UserContext} from '../UserContext'
import {Navigate} from 'react-router-dom'
export default function LoginPage(){
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const {setUserInfo,userInfo}=useContext(UserContext)
    const [redirect,setRedirect]=useState(false)
    async function login(event){
          event.preventDefault()
          const response=await fetch('http://localhost:4000/login',{
            method:'POST',
            body:JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
            credentials:'include'
          })
          if(response.ok){
            response.json().then(userInfo=>{
               setUserInfo(userInfo)
               setRedirect(true)
            })
               
          }
          else{
            alert("Wrong credentials")
          }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }
    return(
        <form className="login" onSubmit={(event)=>login(event)}>
            <h1>Login</h1>
              <input type="text" placeholder="username" value={username}  
              onChange={(event)=>setUsername(event.target.value)}/>

              <input type="password" placeholder="password" value={password}
              onChange={(event)=>setPassword(event.target.value)}/>
              <button type="submit">Login</button>
        </form>
    )
}