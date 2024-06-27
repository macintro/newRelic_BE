const logger = require('../utilities/logger')(module);
const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
const { v4: uuid4 } = require('uuid');

const mysql = require('../utilities/mysqlClient');


//Find customer by either firstName or lastName
  const getCustomerByName = async (req, res) => {

    const requiredBody = joi
      .object({
        searchTerm: joi.string().allow(''),
      }).required();
    //validate the incoming request against what is expected. if it does not match throw an error...
    const validBody = requiredBody.validate(req.query);
    if (validBody.error) {
      return res.status(400).json({message: validBody.error.details[0].message});
    }

    // Replace all non-alphanumeric characters with % 
    // This also helps a little bit against injection attacks
    const sanitizedSearchTerm = req.query.searchTerm.replace(/[^a-zA-Z]/g, '%') ; 
    try {
      const customers = await mysql.fetchArray('Customer_GetByFNameOrLName', [sanitizedSearchTerm]);
      if(customers){
        res.status(200).json(customers);
        
      }
      else{
        res.status(204).json("No data");
      }
      res.end();
      return;
     
    } catch (err) {
      logger.error('getCustomerByName() exception: %o', err);
      res.sendStatus(500);
    }
  
  
  };

  


  module.exports = {
    getCustomerByName
  };
  