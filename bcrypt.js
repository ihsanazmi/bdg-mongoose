const bcrypt = require('bcrypt')

let password = "Hello123password"
let hash = "$2b$08$J6D/MOly0ieb1X1p..k/wecPzsOBi9M9j5uq4uhfSvmbgsJwMlKay"

let result = password.includes('password')
console.log(result)

// Hashing
// bcrypt.hash(password, 8)
//     .then(res=>{
//         console.log({
//             password, res
//         })
//     })

// Compare
// bcrypt.compare(password, hash)
//     .then(res=>{
//         console.log(res)
//     })