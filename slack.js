'use strict';

var planner = require('./planner');
var Slack = require('slack-node');

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

function postToSlack(channel, config, body) {
  var slack = new Slack();
  slack.setWebhook(config.slack.webhookUri);
  slack.webhook({
    channel: channel,
    username: config.slack.username,
    icon_emoji: config.slack.icon,
    link_names: 1,
    text: body,
  }, function(err, response) {
    console.log(response);
  });
}

module.exports = {
  plan: function (config, done) {
    planner.plan(config, function (plan) {

      if (config.slack.sendTerraformNotification) {
        var message = 'Deploying to ' + config.environment + ' now - details in #deployments';
        postToSlack(config.slack.terraformRoom, config, message);
      }

      if (config.slack.sendDeploymentNotification) {
        var time = buildFormattedTime();
        var message = 'NEW TERRAFORM DEPLOYMENT PLANNED FOR ' + time + ' (UTC)*.\n Terraform Plan of Changes:\n```\n' + plan + '\n```';
        postToSlack(config.slack.deploymentsRoom, config, message);
      }

      done();
    });
  }
}
