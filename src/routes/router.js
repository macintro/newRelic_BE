// Node packages
const express = require('express');
const router = express.Router();


//somehwere I should define an API rate limiter to control how quickly someone can call the API with the given API key 
//That would help prevent against DDoS attacks


const apiKeyCheck = require('../middleware/key_check');

// Controllers
const customers = require('../controllers/customers');


router.get(  '/customers/getCustomerInfo'                           , [apiKeyCheck                ,customers.getCustomerByName]);


module.exports = router;
