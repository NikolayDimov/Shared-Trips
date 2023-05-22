const router = require('express').Router();

const { isUser } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { getAllTrips, getTripsByUser } = require('../services/tripService');


//TODO replace with real controller by assignment
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',

        // user: req.user  

        // -->> не трябва да се пише реда с 'user: req.user', понеже main.hbs взема данни от res.locals.user
        // а ако има тук 'user: req.user', няма да вземе email-a 
        // виж middleware -> userSession
    });
});


// router.get('/catalog') -->> /catalog -> вземаме от main.hbs // browser address bar 
router.get('/catalog', async (req, res) => {
    const trips = await getAllTrips();
    // рендерираме res.render('catalog') -->> вземамe от views -> catalog.hbs
    res.render('catalog', { title: 'Shared Trips', trips });

    // test with empty array
    // res.render('catalog', { title: 'Shared Trips', trips: [] });
});


router.get('/catalog/:id', preload(true), (req, res) => {
    // console.log(res.locals.trip);    // see below

    const trip = res.locals.trip;
    trip.remainingSeats = trip.seats - trip.buddies.length;
    trip.buddiesList = trip.buddies.map(b => b.email).join(', ');

    if (req.session.user) {
        trip.hasUser = true;
        trip.isOwner = req.session.user._id == trip.owner._id;

        if (trip.buddies.some(b => b._id == req.session.user._id)) {
            trip.isJoined = true;
        }
    }

    // if(req.session.user?._id == res.locals.trip.owner._id) {
    //     res.locals.trip.isOwner = true;
    // }
    // same as
    // res.locals.trip.isOwner = req.session.user?._id == res.locals.trip.owner._id

    res.render('details', { title: 'Trip Details' });
});


router.get('/profile', isUser(), async (req, res) => {
    const tripsByUser = await getTripsByUser(res.locals.user._id);
    res.locals.user.tripCount = tripsByUser.length;
    res.locals.user.trips = tripsByUser;
    res.render('profile', { title: 'Profile Page' });
});



module.exports = router;




// console.log(res.locals.trip);
// {
//     _id: new ObjectId("6469d45ed364c5477c7848d7"),
//     start: 'Varna',
//     end: 'Burgas',
//     date: '22.05.2023',
//     time: '8:00',
//     carImage: '/static/images/cars/infy_4.jpg',
//     carBrand: 'Infy',
//     seats: 2,
//     price: 50,
//     description: 'Luxury trip to Burgas.',
//     owner: {
//       _id: new ObjectId("646930844befe24e549459d3"),
//       email: 'niki@abv.bg',
//       hashedPassword: '$2b$10$hRdLhhXVCLdMPcwTaFZngepqklA3WvQYn3AzFVQ.lZbMqjMGOKXcq',
//       gender: 'male',
//       trips: [],
//       __v: 0
//     },
//     buddies: [],
//     __v: 0
//   }