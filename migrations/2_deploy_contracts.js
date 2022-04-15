const Voting = artifacts.require('Voting');

// for testing
module.exports = function (deployer) {
  deployer.deploy(Voting);
};
