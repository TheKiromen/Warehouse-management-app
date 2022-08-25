const {Router} = require('express');
const {create,search,show,update,destroy} = require('./controller');

const router = Router();

//Routing dla konkretnych akcji
router.get('/',show);
router.get('/:badge/:handler',search);
router.post('/',create);
router.put('/:id',update);
router.delete('/:id',destroy);

module.exports = router;