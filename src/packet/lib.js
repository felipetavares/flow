function Action (action) {
    this.action = action===undefined?[]:action;
}

function WorldState () {
    this.objects = [];
}

module.exports = {
    'WorldState': WorldState,
    'Action': Action
};
