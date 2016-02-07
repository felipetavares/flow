function Message (text, user) {
  this.text = text===undefined?'':text;
}

function Action (action, token) {
  this.action = action===undefined?[]:action;
  this.token = token===undefined?'':token;
}

function WorldState (token) {
  this.token = token;
  this.objects = {};
  this.messages = [];
  this.error = false;
  this.time = new Date().getTime();
}

module.exports = {
    'WorldState': WorldState,
    'Action': Action,
    'Message': Message
};
