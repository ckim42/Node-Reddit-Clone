const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

const User = require("../models/user");

describe("User", function() {

  // User shouldn't be able to login without having signed up
  it("should not be able to login if they have not registered", function(done) {
    agent.post("/login", {
      username: "wrong@soverywrong.com",
      password: "nopelol"
    }).end(function(err, res) {
      res.status.should.be.equal(401);
      done();
    });
  });

  // User should be able to sign up
  it("should be able to signup", function(done) {
    User.findOneAndRemove({
      username: "testone"
    }, function() {
      agent
        .post("/sign-up")
        .send({
          username: "testone",
          password: "password"
        })
        .end(function(err, res) {
          console.log(res.body);
          res.should.have.status(200);
          agent.should.have.cookie("nToken");
          done();
        });
    });
  });

  // Server started by the AGENT won't just close after testing, so we must close that agent with this after hook
  after(function () {
    agent.close()
  });

});
