angular.module('App')
.factory('NavItems', function() {
  return [
    {name :"Wiki", selected: true},
    {name :"BBC", selected: false},
    {name :"adrianmejia", selected: false},
    {name :"TheVerge", selected: false}
  ];})
.factory('Selection', function() {
  selected = null;
  range = null
  var SetSelected = function(selected){
    this.selected = selected;
    if (selected) {
      this.range = selected.getRangeAt(0);
    } else {
      this.range = null;
    }
  }
  var GetSelected = function() {
    return this.selected;
  }
  var GetRange = function() {
    return this.range;
  }
  return {
    setSelected: SetSelected,
    getSelected: GetSelected,
    getRange: GetRange
  };})
.factory('SessionID', function() {
  var id = '00000000';
  var socket = null;

  var GetID = function () {
    return id;
  };

  var SetID = function (idVal) {
    this.id = idVal;
  }

  var GetSocket = function () {
    return socket;
  };

  var SetSocket = function (socketVal) {
    this.socket = socketVal;
  }

  return {
    getID: GetID,
    setID: SetID,
    getSocket: GetSocket,
    setSocket: SetSocket
  };
})
.factory('GenerateID', ['SessionID', function(SessionID) {
  var uuidv4 = function() {
    return SessionID.getID() + '-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  return {
    createUuid: uuidv4
  };}])
.factory('Annotation', ['GenerateID', 'SessionID', function(GenerateID, SessionID){

  var selected = {};

  var Add = function(test, color, selectionRange, onClickCallback) {
    highlightRange = function (uuid, range, color) {
      var newNode = document.createElement("div");
      newNode.setAttribute("style", "background-color: " + color + "; display: inline;");
      newNode.setAttribute("id", uuid);

      newNode.addEventListener('click', function(event) {
        if (onClickCallback) {
          onClickCallback(uuid, selected[this.id]);
        }
      }, true);

      try{
        range.surroundContents(newNode);
      } catch(error) {
        alert(error);
      };
    };

    if (selectionRange) {
      uuid = GenerateID.createUuid();
      highlightRange(uuid, selectionRange, color);
      selected[uuid] = {test: test, color: color, range: selectionRange};
      var socket = SessionID.getSocket();
      socket.emit('add', {page: $location, id: uuid, data: selected[uuid]});
    }
  };

  var Remove = function(uuid){
    delete selected[uuid];
  };

  var Update = function(uuid, color, text){
    selected[uuid].color = color;
    selected[uuid].text = text;
  };

  var SetSelected = function(values) {
    selected = values;
  }


  return {
    add: Add,
    remove: Remove,
    update: Update,
    setSelected: SetSelected
  };}]);
