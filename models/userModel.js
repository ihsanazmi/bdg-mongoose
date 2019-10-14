const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    username:{
        type: String,
        set: (val)=>{ val.replace(/ /g, '') }, // val = data dari user, menghapus semua spasi
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
    age:{
        type: Number,
        set: val => parseInt(val),
        default:0   //Jika user tidak memberikan informasi umur
    }
})