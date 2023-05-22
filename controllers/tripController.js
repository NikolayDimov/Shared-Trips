const router = require('express').Router();

const { isUser, isOwner } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { createTrip, updateTrip, deleteById, joinTrip } = require('../services/tripService');
const mapErrors = require('../util/mapError');



router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Trip Offer', data: {} });
});

router.post('/create', isUser(), async (req, res) => {
    const trip = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
        owner: req.session.user._id,
    };


    try {
        await createTrip(trip);
        res.redirect('/catalog');

    } catch (err) {
        // re-render create page
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Trip Offer', data: trip, errors });
    }
});


router.get('/edit/:id', preload(), isOwner(), (req, res) => {
    res.render('edit', { title: 'Edit Offer' });
});

router.post('/edit/:id', preload(), isOwner(), async (req, res) => {
    // console.log(req.body);  -> see below
    
    const id = req.params.id;

    const trip = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
    };

    try {
        await updateTrip(id, trip);
        res.redirect('/catalog/' + id);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        trip._id = id;
        res.render('edit', { title: 'Create Trip Offer', trip, errors });
    }
});


router.get('/delete/:id', preload(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/catalog');
});

router.get('/join/:id', isUser(), async (req, res) => {
    const id = req.params.id;   

    try {
        await joinTrip(id, req.session.user._id);
        // res.redirect('/catalog/' + id);      // finally replace both rows

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        // res.redirect('/catalog/' + id);      // finally replace both rows
    } finally {
        res.redirect('/catalog/' + id);
    }
});


module.exports = router;


// router.post('/edit/:id'...
// console.log(req.body);
// {
//     start: 'Sofia',
//     end: 'Pamporovo',
//     date: '21.05.2023',
//     time: '18:00',
//     carImage: 'https://mobistatic3.focus.bg/mobile/photosmob/711/1/big1/11684336382439711_41.jpg',
//     carBrand: 'Infinity',
//     seats: '3',
//     price: '35',
//     description: 'Ski trip for the weekend.'
// }