const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/User');


const JWT_SECRET = 'jwt-secret123';


async function register(email, password, gender) {
    const existing = await getUserByEmail(email);
    if (existing) {
        throw new Error('Email is taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        hashedPassword,
        gender,
    });

    await user.save();
    return user;

    // TODO see assignments if registration create user session
    // const token = createSession(user);
    // return token;
}


async function login(email, password) {
    const user = await getUserByEmail(email);
    
    if (!user) {
        throw new Error('Email doesn\'t exist');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect email or password');
    }

    return user;

    // const token = createSession(user);
    // return token;
}

// TODO identify user by given identifier
async function getUserByEmail(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    return user;
}

// function createSession(user) {
//     const payload = {
//         _id: user._id,
//         username: user.username,
//     };

//     const token = jwt.sign(payload, JWT_SECRET);
//     return token;
// }

// function verifyToken(token) {
//     return jwt.verify(token, JWT_SECRET);
// }


module.exports = {
    register,
    login,
    //verifyToken
}