const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
        minlength: 7, // Minimal 7 karakter,
        validate(val){
            let result = val.includes('password')
            if(result){
                throw new Error('Password tidak boleh mengandung kata "password"')
            }
        }
        
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

// Membuat function yang akan dijalankan sebelum proses user.save()
userSchema.pre('save', async function(next){
    // Mengubah password yang diinput menjadi bentuk lain
    let user = this
    user.password = await bcrypt.hash(user.password, 8)
    next()
})

// Membuat login function
userSchema.statics.login = async(email, password)=>{
    // Mencari user berdasarkan email
    let user = await User.findOne({email})

    // jika user tidak di temukan
    if(!user){
        throw new Error(`User dengan email ${email} tidak di temukan`)
    }
    // Bandingkan password dari input user dgn yg ada di database
    // result akan menghasilkan true or false
    let result = await bcrypt.compare(password, user.password)
    if(!result){
        throw new Error('Password belum benar')
    }

    return user
}

const User = mongoose.model('user', userSchema)

module.exports = User

// Latihan 
// Password tidak boleh mengandung kata 'password'