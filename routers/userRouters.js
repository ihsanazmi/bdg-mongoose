const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const multer = require('multer')
const User = require('../models/userModel')

// MULTER CONF
const upload = multer({
    limits: {
        fileSize: 1000000 //1MB = 1024 kbytes = 1000000 bytes
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Format file harus jpg/jpeg/png'))
        }
        cb(null, true)
    }
})

// UPLOAD AVATAR
router.post('/user/avatar/:userid', upload.single('avatar') , async(req, res)=>{
    // File gambar nanti akan ada di req.file.buffer
    try {
        // Resize lebar gambar : 250px, extension .png
        let buffer = await sharp(req.file.buffer).resize({width:250}).png().toBuffer()
        let user = await User.findById(req.params.userid)
        user.avatar = buffer
        await user.save()
        res.send('Berhasil')
    } catch (error) {
        res.send(error.message)
    }
})

// READ AVATAR
router.get('/user/avatar/:userid', async (req, res)=>{
    try {
        let user = await User.findById(req.params.userid)

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.send(error.message)
    }
})

// CREATE ONE USER
router.post('/users', (req,res)=>{

    const user = new User(req.body)

    user.save()
        .then((resp)=>{res.send(resp)})
        .catch((err)=>{{res.send(err.message)}})
})

// READ ALL USER
router.get('/users', async(req, res)=>{
    try {
        const resp = await User.find({})
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// READ ONE USER BY ID
router.get('/users/:id', async (req, res)=>{
    
    try {
        const resp = await User.findById(req.params.id)
        res.send(resp)
    } catch (err) { 
        res.send(err)
    }
    
})

// UPDATE PROFILE
router.patch('/users/:userid', async (req, res)=>{
    let updates = Object.keys(req.body)
    let allowedUpdate = ['name', 'email', 'password', 'age']

    let result = updates.every(update => {return allowedUpdate.includes(update)})

    // Jika ada field yang akan di edit selain [ 'name', 'email', 'password', 'age' ]

    if(!result){
        return res.send({err: "Invalid Request"})
    }

    try {
        let user = await User.findById(req.params.userid)

        updates.forEach((val) => { user[val] = req.body[val] })

        await user.save()

        res.send(user)

        // Update user

            // user.name = req.body.name
            // user.email = req.body.email
            // user.password = req.body.password
            // user.age = req.body.age

        // updates = [ 'name', 'email', 'password', 'age' ]
        // user = {name, email, password, age}

    } catch (error) {
        res.send(error.message)
    }
})


// DELETE ONE USER BY ID
router.delete('/users/:id', async(req, res)=>{
    try {
        const resp = await User.findOneAndDelete(req.params.id)
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// UPDATE BY ID
router.put('/users/:id', async(req, res)=>{
    try {
        const resp = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                name: req.body.name,
                age: req.body.age
            }
        },
        {
            new: true
        })
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// LOGIN USER by EMAIL
router.post('/users/login', (req, res)=>{
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

module.exports = router