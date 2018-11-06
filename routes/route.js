const express=require('express');
const router=express.Router();
module.exports=router;
const userModel=require('../model/model').userModel;
router.post('/card', (res,req) => {
    if (req.body.data) {
        const user = userModel({
             creditCard: req.body.data.creditCard,
             debitCard: req.body.data.debitCard,
        });
        user.save((err, result) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: err.message
                });
            } else if (result) {
                res.status(201).send({ success: true, message: "Data added successfully", result });
            }
        });
    } else {
        res.status(400).json({
            message: 'Please Enter any DATA!'
        });
    }
});


