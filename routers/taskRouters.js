const express = require('express')
const router = new express.Router()
const Task = require('../models/taskModel')
const User = require('../models/userModel')
// const Cors = require('cors')

// TASK ROUTER
// CREATE TASK
// router.options('/task/:userid')

router.post('/task/:userid', async(req, res)=>{
    
    try {
        let user = await User.findById(req.params.userid)
        let task = new Task({
            ...req.body,
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
router.patch('/task/:taskid', async (req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['description', 'completed']
    let result = updates.every(update => allowedUpdates.includes(update))

    if(!result){
       return res.send({err: "Invalid Request"})
    }

    try {
        let task = await Task.findById(req.params.taskid)
        updates.forEach(update => { task[update] = req.body[update] })

        await task.save()

        res.send(task)
    } catch (error) {
        res.send(error)
    }

})

// DELETE TASK
router.delete('/task/delete/:taskid/', async (req, res)=>{
    try {
        let task = await Task.findByIdAndDelete(req.params.taskid)
        // task = {_id, owner, description, completed, owner}
        let user = await User.findById(task.owner)
        // Mencari posisi index dari task yang sudah di hapus
        let index = user.task.indexOf(req.params.taskid)
        // Hapus _id task berdasarkan index
        user.task.splice(index,1)

        await user.save()
        
        res.send(task)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router