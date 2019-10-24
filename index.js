const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouters')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 2020
const URL_LOCAL = 'mongodb://127.0.0.1:27017/bdg-mongoose'
const URL = 'mongodb+srv://ihsanazmi:kumis@bdg-mongoose-eavq2.gcp.mongodb.net/bdg-mongoose?retryWrites=true&w=majority'

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

mongoose.connect(
    URL,
    {
        // Menggunakan url parser yang baru
        useNewUrlParser: true,
        // Menggunakan method baru 'CreateIndex' untuk membuat index setiap kali kita input sebuah data
        useCreateIndex:true,
        // Menggunakan method baru untuk proses findOneAndUpdate()
        useFindAndModify: true,
        // Menggunakan engine mongoDB baru
        useUnifiedTopology:true

    }
)

// Agar API dapat memproses json
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res)=>{
    res.send(`<h1>API Running at ${port}</h1>`)
})

// app.post()

app.listen(port, ()=>{console.log(`Running at port ${port}`)})

