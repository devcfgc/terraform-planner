'use strict';

var GitHubApi = require("github");

var filterOutput = function(input, blacklist) {
  var result = input.replace('Refreshing Terraform state in-memory prior to plan...\n', '')
              .replace('The refreshed state will be used to calculate this plan, but\n', '')
              .replace('will not be persisted to local or remote state storage.\n\n', '')
              .replace('Note: You didn\'t specify an "-out" parameter to save this plan, so when\n', '')
              .replace('"apply" is called, Terraform can\'t guarantee this is what will execute.', '')
              .replace('The Terraform execution plan has been generated and is shown below.\n', '')
              .replace('Resources are shown in alphabetical order for quick scanning. Green resources\n', '')
              .replace('will be created (or destroyed and then created if an existing resource\n', '')
              .replace('exists), yellow resources are being changed in-place, and red resources\n', '')
              .replace('will be destroyed. Cyan entries are data sources to be read.\n', '')
              .replace(/\n\n\n/, '');

  // TODO: remove any lines containing "Refreshing state..."
  for (var i = 0; i < blacklist.length; i++) {
    var word = blacklist[i];
    var replacement = '';
    for (var c = 0; c < word.length; c++) {
      replacement += '*';
    }
    var regex = new RegExp(word, "g");
    result = result.replace(regex, replacement);
  }

  return result;
};

module.exports = {
  plan: function (config, done) {
    var childProcess = require('child_process');
    console.log('Generating the Terraform Plan..');
    var output = childProcess.execFile(config.terraform.executable, config.terraform.arguments, config.terraform.options, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        console.log(stderr);
        return;
      }

      var filteredOutput = filterOutput(stdout, config.blacklist);
      done(filteredOutput);
    });
  }
}
