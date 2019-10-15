const mongoose = require('mongoose')
const validator = require('validator')

const userSchema =  new mongoose.Schema({
    username:{
        type: String,
        set: (val)=>{ return val.replace(/ /g, '') }, // val = data dari user, menghapus semua spasi
        validate(val){
            // val = "maxx"
            val = parseInt(val)
            // val = NaN

            // Akan bernilai true jika inputan dari user merupakan sebuah angka
            if(!isNaN(val)){
                throw new Error('Username harus merupakan sebuah string')
            }
        }  
    },
    name:{
        type: String,
        required: true, // Wajib diisi oleh user
        trim: true, // akan menghapus spasi diawal dan di akhir kalimat saja
        validate(val){
            // val = "maxx"
            val = parseInt(val)
            // val = NaN

            // Akan bernilai true jika inputan dari user merupakan sebuah angka
            if(!isNaN(val)){
                throw new Error('Username harus merupakan sebuah string')
            }
        }  
    },
    password:{
        type: String,
        required:true,
        trim: true,
        minlength: 7 // Minimal 7 karakter,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(val){
            let result = validator.isEmail(val)

            if(!result){
                throw new Error('Format email salah')
            }
        }
    },

    age:{
        type: Number,
        set: val => parseInt(val),
        default:0   //Jika user tidak memberikan informasi umur
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User