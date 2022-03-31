const { Router } = require('express');
const { getAllByUserId, getAllByAssignedToId } = require('../controllers/services.controllers');

const router = Router();


router.get('/history/depto/:id', getAllByUserId);

router.get('/history/site/:id', getAllByAssignedToId);





module.exports = router;