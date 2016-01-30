function Action (action, token) {
  this.action = action===undefined?[]:action;
  this.token = token===undefined?'':token;
}

function WorldState (token) {
  this.token = token===undefined?'':token;
  this.objects = [];
  this.error = false;
}

module.exports = {
    'WorldState': WorldState,
    'Action': Action
};
