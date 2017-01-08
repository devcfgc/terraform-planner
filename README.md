# Terraform Planner
Uses Terraform to calculate a plan, then posts it to either Github or a Slack Channel.

## Examples

### Github Pull Request
```
var config = {
  "github": {
    "userToken": 'abc123',
    "owner": "my-org",
    "repo": "my-terraform-repo",
    "sha": 'repo-sha-of-a-git-repo'
  },
  "terraform": {
    "executable": "terraform",
    "arguments": [ "plan", "-refresh=true", "-no-color", "-input=false" ],
    "options": {
      "env": process.env
    }
  },
  "blacklist": [
    "something"
  ],
  "environment": 'staging',
};

var github = require('./github');
planner.plan(config, function() {
  console.log('Plan posted to GitHub');
});
```

### Slack
```
var config = {
  "terraform": {
    "executable": "terraform",
    "arguments": [ "plan", "-refresh=true", "-no-color", "-input=false" ],
    "options": {
      "env": process.env
    }
  },
  "blacklist": [
    "something"
  ],
  "environment": 'staging',
  "slack": {
    "deploymentsRoom": '#deployments',
    "terraformRoom": '#terraform',
    "username": 'Terraform Deployment',
    "icon": 'https://github.com/hashicorp/terraform/raw/eeb80e06b76e859852251340f8819495be04001f/website/source/assets/images/logo_large.png',
    "sendDeploymentNotification": true,
    "webhookUri": 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX'
  }
};

var slack = require('./slack');
planner.plan(config, function() {
  console.log('Plan posted to Slack');
});
```

### Licence
MIT
