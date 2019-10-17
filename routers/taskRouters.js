const express = require('express')
const router = new express.Router()
const Task = require('../models/taskModel')
const User = require('../models/userModel')

// TASK ROUTER
// CREATE TASK
router.post('/task/:userid', async(req, res)=>{
    
    try {
        let user = await User.findById(req.params.userid)
        let task = new Task({
            description: req.body.description,
            owner: user._id
        })
        
        //simpan id task yang baru ke array task pada user
        user.task.push(task._id)
        // simpan user dan task ke database
        await user.save()
        await task.save()

        res.send(task)

    } catch (error) {
        res.send(error.message)
    }

})
// const Task = require('../models/taskModel')

// READ ALL OWN TASK
router.get('/task/:userid', async (req, res)=>{
    try {
        let resp = await User.find({_id : req.params.userid}).populate({
            path:'task'
        }).exec()
        res.send(resp[0].task)
    } catch (error) {
        res.send(error.message)
    }
})

// UPDATE DESCRIPTION OR COMPLETED   TASK
router.patch('/task/:taskid', async (req, res)=>{

    let updates = Object.keys(req.body)
    let allowedUpdate = ['description', 'owner']

    let result = updates.every(update => {return allowedUpdate.includes(update)})

    if(!result){
        return res.send({err: "Invalid Request"})
    }

    try {
        let task = await Task.findById(req.params.taskid)
        updates.forEach((val) => { task[val] = req.body[val] })

        await task.save()

        res.send(task)

    } catch (error) {
        res.send(error.message)
    }
})

// DELETE TASK
router.delete('task/:taskid', async (req, res)=>{
    try {
        let task = await Task.findByIdAndDelete(req.params.taskid)
        res.send({deletedTask: task})
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router