// const { verifyToken } = require("../services/userService");

// module.exports = () => (req, res, next) => {
//     const token = req.cookies.token;

//     if (token) {
//         try {
//             const userData = verifyToken(token);
//             req.user = userData;
//         } catch (err) {
//             res.clearCookie('token');
//             res.redirect('/auth/login');
//             return;
//         }
//     }

//     next();
// };



function userSession() {
    return function (req, res, next) {
        // if we have logged in User -->> req.session.user
        if(req.session.user) {
            res.locals.user = req.session.user;
            res.locals.hasUser = true; 

            // console.log(res.locals.user);
            // console.log(req.session.user);
            // {
            //     _id: '646930844befe24e549459d3',
            //     email: 'niki@abv.bg',
            //     hashedPassword: '$2b$10$hRdLhhXVCLdMPcwTaFZngepqklA3WvQYn3AzFVQ.lZbMqjMGOKXcq',
            //     gender: 'male',
            //     trips: [],
            //     __v: 0
            // }

        }
        next();
    };
}


module.exports = userSession;