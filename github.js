'use strict';

var GitHubApi = require('github');
var planner = require('./planner');

var postToGithub = function(config, plan) {
  var github = new GitHubApi({
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "Terraform-Planner"
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
  });
  github.authenticate({
    type: "token",
    token: config.userToken,
  });
  var metaData = {
    owner: config.owner,
    repo: config.repo,
    sha: config.sha,
    body: plan,
  };
  github.repos.createCommitComment(metaData, function(err, res) {
    if (err) {
      throw err;
    }

    console.log('Posted to Github!');
  });
}

module.exports = {
  plan: function (config, done) {
    planner.plan(config, function (plan) {
      var outputToPost = 'Generated Plan for **' + config.environment.toUpperCase() + ' Environment**:\n```\n' + plan + '\n```';
      console.log('Plan is:\n\n' + outputToPost);
      postToGithub(config.github, outputToPost);
      done();
    });
  }
}
