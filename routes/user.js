const express = require('express');
const userRouter = express.Router();

const User = require('../models/user');

const randomRange = require('../tasks/random').randomRange;

userRouter.route('/exercise/new-user')
    .post((req, res) => {

        User.find((err, data) => {
            if(err) res.send(err);
            else{
                if(req.body.username === '') res.send('Path `username` is required.');
                else{
                    var userNameList = data.map((obj) => {
                        return obj.userName;
                    });
        
                    if(userNameList.includes(req.body.username)) res.send("error");
                    else{
                        var userId = randomRange(10);
                        var userIdList = data.map((obj) => {
                            return obj.userId;
                        });
    
                        while(userIdList.includes(userId)){
                            userId = randomRange(10);
                        }
    
                        User.create({userName: req.body.username, userId: userId}, (err, data) => {
                            if(err){
                                console.log(err);
                            }
                            res.json({
                                username: data.userName,
                                _id: data.userId
                            });
                        });
                    }
                }
            }
        });

    })

module.exports = userRouter;