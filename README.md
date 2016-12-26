# Terraform Planner
Calculates a Terraform Plan - then posts it as a comment on a GitHub Pull Request.

### Example Usage
```
var planner = require('./planner');

var config = {
  github: {
    userToken: 'my-token',
    owner: 'my-org',
    repo: 'some-repo',
    sha: 'sha'
  },
  terraform: {
    executable: 'terraform',
    arguments: [ 'plan -refresh=true -no-color' ]
  }
}

planner.plan(config);
```

### Licence
MIT
