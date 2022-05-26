const bcrypt = require('bcrypt')


const encryptPassword  = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const comparePassword = function (password, savedPassword) {
    return bcrypt.compareSync(password, savedPassword)
}


module.exports = {
    encryptPassword,
    comparePassword
}