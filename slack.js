'use strict';
var Slack = require('slack-node');
var planner = require('./planner');

function checkTime(i) {
  return (i < 10) ? "0" + i : i;
}

function buildFormattedTime() {
  var now = new Date();
  var hours = now.getHours();
  var mins = now.getMinutes();
  var time = checkTime(hours) + ':' + checkTime(mins);
  return time;
}

module.exports = {
  plan: function (config, done) {
    planner.plan(config, function (plan) {
      var slack = new Slack();
      slack.setWebhook(config.slack.webhookUri);

      if (config.slack.sendTerraformNotification) {
        slack.webhook({
          channel: config.slack.terraformRoom,
          username: config.slack.username,
          icon_emoji: config.slack.icon,
          text: 'Deploying to ' + config.environment + ' now - details in #deployments',
        }, function(err, response) {
          console.log(response);
        });
      }

      if (config.slack.sendDeploymentNotification) {
        var time = buildFormattedTime();
        var outputToPost = 'NEW TERRAFORM DEPLOYMENT PLANNED FOR (' + time + ')*.\n Terraform Plan of Changes:\n```\n' + plan + '\n```';
        slack.webhook({
          channel: config.slack.deploymentsRoom,
          username: config.slack.username,
          icon_emoji: config.slack.icon,
          mrkdwn: true,
          link_names: 1,
          text: outputToPost
        }, function(err, response) {
          console.log(response);
        });
      }

      done();
    });
  }
}
