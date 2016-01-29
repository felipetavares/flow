function Action (action, token) {
  this.action = action===undefined?[]:action;
  this.token = token===undefined?'':token;
}

function WorldState (token) {
  this.token = token===undefined?'':token;
  this.objects = [];
}

module.exports = {
    'WorldState': WorldState,
    'Action': Action
};
