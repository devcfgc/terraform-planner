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

function postToSlack(channel, config, title, attachment) {
  var slack = new Slack();
  slack.setWebhook(config.slack.webhookUri);

  var attachments = [
    {
      fallback: title,
      pretext: title,
      fields: [
        {
          title: "Environment",
          value: config.environment.toUpperCase(),
          short: true
        }
      ]
    }
  ];

  if (attachment != null) {
    attachments[0].fields.push(attachment);
  }

  slack.webhook({
    channel: channel,
    username: config.slack.username,
    icon_emoji: config.slack.icon,
    link_names: 1,
    attachments: attachments
  }, function(err, response) {
    console.log(response);
  });
}

module.exports = {
  plan: function (config, done) {
    planner.plan(config, function (plan) {

      if (config.slack.sendTerraformNotification) {
        var title = 'Terraform Deployment Started..'
        var attachment = {
            title: "Plan available in",
            value: config.slack.deploymentsRoom,
            short: false
        };
        postToSlack(config.slack.terraformRoom, config, title, attachment);
      }
      if (config.slack.sendDeploymentNotification) {
        var time = buildFormattedTime();
        var title = 'NEW TERRAFORM DEPLOYMENT PLANNED FOR ' + time + ' (UTC)'
        var attachment = {
            title: "Terraform Plan of Changes:",
            value: plan,
            short: false
        };
        postToSlack(config.slack.deploymentsRoom, config, title, attachment);
      }

      done();
    });
  }
}
