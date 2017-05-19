var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const path = require('path');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/libs', express.static('node_modules'));


mongoose.connect(config.DATABASE_URL);
app.listen(config.PORT, function() {
  console.log('Listening on localhost:' + config.PORT);
});

var fruits = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Kiwi' }, { id: 3, name: 'Orange' }];
var Item = require('./models/item');

app.get('/items', function(req, res) {
  Item.find(function(err, items){
     if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
  });
});

app.post('/items', function(req, res) {
 Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});


//update with id
app.put('/items/:id', function(req,res){
  var id = req.params.id;
    if(req.body && req.body._id && id != req.body._id){
    return res.sendStatus(400);
  }
  
  if(!('name' in req.body) && (!('complete' in req.body))){
    return res.sendStatus(400);
  }
 
    Item.update({ _id: req.params.id }, {$set: req.body},
    {},
    function(err, raw) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.sendStatus(204);
    });
});

app.delete('/items/:id', function(req, res){
    Item.remove({_id: req.params.id}, function(err){
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.sendStatus(204);
    });
});

app.all('*', function(req, res) {
  res.status(200).sendFile(path.resolve(__dirname, './public/index.html'));
}); // always the last endpoint


