const express = require('express');
const exerciseRouter = express.Router();

const Exercise = require('../models/exercise');
const User = require('../models/user');

exerciseRouter.route('/exercise/add')
    .post((req, res) => {
        if(req.body.userId === ''){
            res.send('unknown _id');
        }
        else if(req.body.description === ''){
            res.send('Path `description` is required.');
        }
        else if(req.body.duration === ''){
            res.send('Path `duration` is required.');
        }
        else if(req.body.date === ''){
            var date = new Date();
            var username;

            User.find({userId: req.body.userId}, (err, data) => {
                if(err) res.send(err);
                else{
                    username = data[0].userName;
                    
                    Exercise.create({
                        username: username,
                        description: req.body.description,
                        duration: req.body.duration,
                        date: date.toDateString()
                    }, (err, data) => {
                        if(err) res.send(err);
                        res.json(data);
                    });
                }
            });
        }
        else{
            if(isNaN(Date.parse(req.body.date)) === true) 
                res.send(`Cast to Date failed for value "${req.body.date}" at path "date"`);
            
            else{
                var date = new Date(req.body.date);
                var username;
                
                User.find({userId: req.body.userId}, (err, data) => {
                    if(err) res.send(err);
                    else{
                        username = data[0].userName;
                        
                        Exercise.create({
                            username: username,
                            userId: req.body.userId,
                            description: req.body.description,
                            duration: req.body.duration,
                            date: date.toDateString()
                        }, (err, data) => {
                            if(err) res.send(err);
                            res.json({
                                username: data.username,
                                description: data.description,
                                duration: data.duration,
                                _id: data.userId,
                                date: new Date(data.date).toDateString()
                            });
                        });
                    }
                });
            }
        }
    })

exerciseRouter.route('/exercise/:log')
    .get((req, res) => {
        const query = {};

        if(req.query.userId === undefined) 
            res.send('Required Field are missing.')
        else if(req.query.userId === '') 
            res.send('Required Field are blank.');
        else if(req.query.from !== undefined && isNaN(Date.parse(req.query.from)) === true)
            res.send('From is not a valid date');
        else if (req.query.to !== undefined && isNaN(Date.parse(req.query.to)) === true)
            res.send('To is not a valid date');
        else if (req.query.limit !== undefined && isNaN(req.query.limit) === true)
            res.send('Limit is not a valid number');
        else if (req.query.limit !== undefined && Number(req.query.limit) < 1)
            res.send('Limit should be greater than 0'); 
        else{
            User.find({userId: req.query.userId}, (err, user) => {
                if(err) 
                    res.send(err);
                else if(!user)
                    res.send('User not found');
                else{
                    var limit, from, to;

                    query.username = user[0].userName;

                    if(req.query.from !== undefined){
                        from = new Date(req.query.from);
                        query.date = {$gte: from.toDateString()};
                    }
            
                    if(req.query.to !== undefined){
                        to = new Date(req.query.to);
                        to.setDate(to.getDate() + 1); // Add 1 day to include date
                        query.date = {$lte: to.toDateString()};
                    }

                    if (req.query.limit !== undefined)
                        limit = Number(req.query.limit);

                    Exercise.find(query)
                            .select('username description date duration')
                            .limit(limit)
                            .exec((err, data) => {
                        if(err) res.send(err);

                        res.json({
                            username: data.username,
                            description: data.description,
                            duration: data.duration,
                            _id: data.userId,
                            date: new Date(data.date).toDateString()
                        });
                    });
                }
            });
        }
    })

module.exports = exerciseRouter