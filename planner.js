var GitHubApi = require("github");

var filterOutput = function(input) {
  return input.replace('Refreshing Terraform state in-memory prior to plan...\n', '')
              .replace('The refreshed state will be used to calculate this plan, but\n', '')
              .replace('will not be persisted to local or remote state storage.\n\n', '')
              .replace('Note: You didn\'t specify an "-out" parameter to save this plan, so when\n', '')
              .replace('"apply" is called, Terraform can\'t guarantee this is what will execute.', '')
              .replace('The Terraform execution plan has been generated and is shown below.\n', '')
              .replace('Resources are shown in alphabetical order for quick scanning. Green resources\n', '')
              .replace('will be created (or destroyed and then created if an existing resource\n', '')
              .replace('exists), yellow resources are being changed in-place, and red resources\n', '')
              .replace('will be destroyed. Cyan entries are data sources to be read.\n', '')
              .replace(/\n\n/g, '');
};

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
  plan: function (config) {
    const execFile = require('child_process').execFile;
    const child = execFile(config.terraform.executable, config.terraform.arguments, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }

      console.log('Plan is:\n\n' + stdout);
      var filteredOutput = filterOutput(stdout);
      postToGithub(config.github, filteredOutput);
    });
  }
}
