import {Navigate} from 'react-router-dom';
import {useState} from 'react';
import Editor from '../Editor'

export default function CreatePost(){
    const [title,setTitle]=useState('')
    const [summary,setSummary]=useState('')
    const [content,setContent]=useState('')
    const [files,setFiles]=useState('')
    const [redirect,setRedirect]=useState(false)

    async function createNewPost(event){
        const data=new FormData()
        data.set('title',title)
        data.set('summary',summary)
        data.set('content',content)
        data.set('file',files[0])
        event.preventDefault()
        const response=await fetch("http://localhost:4000/post",{
            method:'POST',
             body:data,
             credentials:'include'
        })
        if(response.ok)
        {
            setRedirect(true)
        }
    }
    
    if(redirect)
    {
      return <Navigate to={'/'}/>
    }
    return (
        <form onSubmit={(event)=>createNewPost(event)}>
            <input type="title" placeholder='Title' value={title}
            onChange={(event)=>setTitle(event.target.value)}/>

            <input type="summary" placeholder='Summary' value={summary}
            onChange={(event)=>setSummary(event.target.value)}/>
            
            <input type="file" 
             onChange={(event)=>setFiles(event.target.files)}/>


            <Editor onChange={setContent} value={content}/>
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    )
}