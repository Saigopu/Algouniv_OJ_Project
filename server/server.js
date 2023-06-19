import express from "express";
import router from "./routes/routes.js";
// i didnt mention the .js extension here and i the app was crashing. extensions are important in the backend
const app = express();
const port = 8000;

/*
app.use('/',(req,res)=>{
    res.send('hello world');
})
// the client react is running on port 3000 and the server is running on port 8000, the above route is working when we open localhost at port 8000 as soon as page loads an api call is happening with the route http://localhost:8000/ where the respone is hello world which is directly displayed on the page. 
//Whereas when we open localhost at port 3000, as soon as loads an api call is happening with the route http://localhost:3000/ and the response is index.html
*/

app.use('/',router);
app.listen(port,()=>{
    console.log(`Server running successfully on port ${port}`);
})

