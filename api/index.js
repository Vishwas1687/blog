const express=require("express")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcrypt=require("bcrypt")
const cors=require("cors")
const multer=require("multer")
const Post=require("./models/post")
const mongoose=require("mongoose")
const method=require('method-override')
const User=require('./models/user')
const fs=require("fs")
const app=express()
const uploadMiddleWare=multer({dest:'uploads/'})

const secret='asdnadfsbdfsibidfsnifadskjkadsfn';


app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'))
mongoose.connect('mongodb+srv://gpvishwas1687:RV1iqOGIeVQdOcvl@cluster0.prkgrkq.mongodb.net/?retryWrites=true&w=majority')



app.post('/register',async (req,res)=>{
    const {username,password}=req.body
    try{
        const userDoc=await User.create({
            username,
            password:await bcrypt.hash(password,10)})
    res.json(userDoc)
    } catch(error){
        res.status(400).json(error)
    }
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body
    const userDoc=await User.findOne({username})
    const passOk=await bcrypt.compare(password,userDoc.password)
    if(passOk)
    {
        jwt.sign({username,id:userDoc._id},secret,{},(error,token)=>{
              if(error) throw error;
              res.cookie('token',token).json({
                    id:userDoc._id,
                    username,
              }
              )
        })
    } else{
        res.status(400).json("Wrong credentials")
    }
})

app.get('/profile',(req,res)=>{
    const {token}=req.cookies
    jwt.verify(token,secret,{},(error,info)=>{
       if(error) throw error;
       res.json(info)
    })
    res.json(req.cookies)
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})

app.post('/post',uploadMiddleWare.single('file'),async(req,res)=>{
    const {originalname,path}=req.file;
    const parts=originalname.split('.');
    const ext=parts[parts.length-1]
    const newPath=path+'.'+ext
    fs.renameSync(path,newPath)

    const {token}=req.cookies
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;

        const {title,summary,content}=req.body
        const postDoc=await Post.create({
          title,
          summary,
          content,
          cover:newPath,
          author:info.id
        })
        res.json(postDoc)
    })
    
})

app.get('/post',async(req,res)=>{
    const posts=await Post.find().populate('author',['username'])
    .sort({createdAt:-1}).limit(20).exec()
    res.json(posts)
})

app.get('/post/:id',async (req,res)=>{
    const {id}=req.params
    const postDoc=await Post.findById(id).populate('author',['username'])
    res.json(postDoc)
})

app.put('/post', uploadMiddleWare.single('file'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;

    try {
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newPath ? newPath : postDoc.cover;

      await postDoc.save(); // use save() instead of update()

      res.json(postDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json('An error occurred while updating the post.');
    }
  });
});
app.listen(4000)

