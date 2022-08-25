//Plik centralny API z endpointami
const {Router} = require('express'); //Routing za pomocą expressa
const items = require('./items');


//Routing
const router = Router();
router.use('/items',items);

module.exports = router;