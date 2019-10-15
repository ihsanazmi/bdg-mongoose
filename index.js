const express = require('express')
const mongoose = require('mongoose')

const User = require('./models/userModel')
const Task = require('./models/taskModel')

const app = express()
const port = 2020
const URL = 'mongodb://127.0.0.1:27017/bdg-mongoose'

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

// CREATE ONE USER
app.post('/users', (req,res)=>{

    const user = new User(req.body)

    user.save()
        .then((resp)=>{res.send(resp)})
        .catch((err)=>{{res.send(err.message)}})
})

// READ ALL USER
app.get('/users', async(req, res)=>{
    try {
        const resp = await User.find({})
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// READ ONE USER BY ID
app.get('/users/:id', async (req, res)=>{
    
    try {
        const resp = await User.findById(req.params.id)
        res.send(resp)
    } catch (err) { 
        res.send(err)
    }
    
})

// DELETE ONE USER BY ID
app.delete('/users/:id', async(req, res)=>{
    try {
        const resp = await User.findOneAndDelete(req.params.id)
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// UPDATE BY ID
app.put('/users/:id', async(req, res)=>{
    try {
        const resp = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                name: req.body.name,
                age: req.body.age
            }
        },
        {
            new: true
        } )
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// LOGIN USER by EMAIL
app.post('/users/login', (req, res)=>{
    User.login(req.body.email, req.body.password)
        .then(resp=>{
            res.send({
                kondisi: "Berhasil",
                pesan: resp
            })
        }).catch(err=>{
            res.send({
                kondisi: "Gagal",
                pesan: err.message
            })
        })
})

// TASK ROUTER

// CREATE TASK
app.post('/task', async(req, res)=>{
    
    try {
        let task = new Task(req.body)
        let resp = await task.save()
    
        res.send(resp)
        
    } catch (error) {
        res.send(error.message)
    }

})

// UPDATE TASK


















app.listen(port, ()=>{console.log(`Running at port ${port}`)})

