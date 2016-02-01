function Action (action, token) {
  this.action = action===undefined?[]:action;
  this.token = token===undefined?'':token;
}

function WorldState (token) {
  if (token !== undefined)
    this.token = token;
  this.objects = [];
  this.error = false;
}

module.exports = {
    'WorldState': WorldState,
    'Action': Action
};
