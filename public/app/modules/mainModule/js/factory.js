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
    return this.socket;
  };

  var SetSocket = function (socketVal) {
    this.socket = socketVal;
  };

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
.factory('Annotation', ['GenerateID', 'SessionID', function(GenerateID, SessionID) {

  var HighlightRange = function (uuid, range, color, onClickCallback) {
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

  var selected = {};
  var Add = function(text, color, selectionRange, onClickCallback, uuid = "") {
    if (selectionRange) {
      if (uuid.length === 0) {
        uuid = GenerateID.createUuid();
        var transmit = true;
      }
      selected[uuid] = {text: text, color: color};
      selected[uuid]["range"] = selectionRange;
      var saveNode = selectionRange.startContainer;
      selected[uuid]["startOffset"] = selectionRange.startOffset;  // where the range starts
      selected[uuid]["endOffset"] = selectionRange.endOffset;      // where the range ends
      selected[uuid]["nodeData"] = saveNode.data;                       // the actual selected text
      selected[uuid]["nodeHTML"] = saveNode.parentElement.innerHTML;    // parent element innerHTML
      selected[uuid]["nodeTagName"] = saveNode.parentElement.tagName;
      HighlightRange(uuid, selectionRange, color, onClickCallback?onClickCallback:AnnotationClickCallback);
      if (transmit) {
        SessionID.getSocket().emit('add', {page: location.href, id: uuid, data: selected[uuid]});
      }
    }
  };

  var Remove = function(uuid){
    delete selected[uuid];
    $('#'+ $scope.uuid).replaceWith(document.createTextNode($('#'+ $scope.uuid).html()));
  };

  var Update = function(uuid, color, text){
    selected[uuid].color = color;
    selected[uuid].text = text;
    $('#' + $scope.uuid).css("background-color", $scope.color);
  };

  var ResetSelected = function(){
    this.selected = {}
  };

  var dataFromUuid = function(uuid) {
    return this.selected[uuid];
  }

  return {
    add: Add,
    remove: Remove,
    update: Update,
    highlightRange: HighlightRange,
    resetSelected: ResetSelected,
    getDataFromUuid: dataFromUuid
  };
}]);
/*
function ObjtoJSON(obj) {
  var jsonString = "{";
  for (var key in obj) {
    if (key == "__proto__") {
      continue;
    }

    if (typeof obj[key] == 'object') {
      var value = ObjtoJSON(obj[key]);
    } else {
      var value = obj[key];
    }
    jsonString += '"' + key +'":"'+  value + '",';
  }
  jsonString[jsonString.length - 1 ] = '}';
  jsonString += "}";
  return jsonString;
}*/
