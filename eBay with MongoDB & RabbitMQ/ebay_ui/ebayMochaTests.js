var server=require('./app');

var chai = require('chai');
var chaihttp = require('chai-http');

chai.use(chaihttp);

var should = require('chai').should();


var assert = require('assert');
/*
//var signInCredentials={"email":"a@b.com","password":"213"}
describe('signup', function() {
    it('should signup', function (done) {
        chai.request(server)
            .post('/signup')
            //.send(signInCredentials)
            .end(function (err, res) {
                //console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
});
*/
/*
//var signInCredentials={"email":"a@b.com","password":"213","req.session.email":"a@b.com"}
describe('getAllItemsforUser', function() {
    it('should get all items for user', function (done) {
        chai.request(server)
            .post('/getAllItemsforUser')
           // .send(signInCredentials)
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
});


//var signInCredentials={"email":"a@b.com","password":"213","req.session.email":"a@b.com"}
describe('getUserCart', function() {
    it('should get all cart items for user', function (done) {
        chai.request(server)
            .post('/getUserCart')
            //.send(signInCredentials)
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
});


//var signInCredentials={"email":"a@b.com","password":"213","req.session.email":"a@b.com"}
describe('purchaseHistory', function() {
    it('should get all purchases by user', function (done) {
        chai.request(server)
            .post('/purchaseHistory')
//            .send(signInCredentials)
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
});
*/

//var signInCredentials={"email":"a@b.com","password":"213","req.session.email":"a@b.com"}
describe('getProfileDetails', function() {
    it('should get all details of user', function (done) {
        chai.request(server)
            .post('/getProfileDetails')
//            .send(signInCredentials)
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
});