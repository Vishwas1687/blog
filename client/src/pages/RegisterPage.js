import {useState} from 'react';
export default function RegisterPage(){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    async function register(event)
    {
        event.preventDefault()
             const response= await fetch('http://localhost:4000/register',{
            method:"POST",
            body:JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'}
        })
        if(response.status===200)
        {
            alert("registeration successful")
        }
        else{
             alert("Registration failed")
        }
    }
    return(
        <form className='register' onSubmit={(event)=>register(event)}>
            <h1>Register</h1>
              <input type="text" 
              placeholder="username"
              onChange={(event)=>setUsername(event.target.value)}/>

              <input type="password" 
              placeholder="password"
              onChange={(event)=>setPassword(event.target.value)}/>
              <button type="submit">Register</button>
        </form>
    )
}