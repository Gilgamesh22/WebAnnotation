angular.module('App')
.factory('NavItems', function() {
  return [
    {name :"Wiki", selected: true},
    {name :"BBC", selected: false},
    {name :"Techspot", selected: false},
    {name :"TheVerge", selected: false}
  ];})


//the current selected region.
.factory('Selection', function() {
  selected = null;
  selectedID = null;
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

  var GetSelectedID = function() {
    return this.selectedID;
  }
  var SetSelectedID = function(value) {
    this.selectedID = value;
  }

  return {
    setSelected: SetSelected,
    getSelected: GetSelected,
    setSelectedID: SetSelectedID,
    getSelectedID: GetSelectedID,
    getRange: GetRange
  };})

//BuildRange converts the shared information to a javascript range.
.factory('BuildRange', function() {
  return {
    buildRange: function (startOffset, endOffset, nodeData, nodeHTML, nodeTagName){
    var cDoc = document.getElementById('website');
    var tagList = cDoc.getElementsByTagName(nodeTagName);

    // find the parent element with the same innerHTML
    for (var i = 0; i < tagList.length; i++) {
        if (tagList[i].innerHTML == nodeHTML) {
            var foundEle = tagList[i];
        }
    }

    if (!foundEle) {
      return null;
    }
    // find the node within the element by comparing node data
    var nodeList = foundEle.childNodes;
    for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i].data == nodeData) {
            var foundNode = nodeList[i];
        }
    }

    // create the range
    var range = document.createRange();

    range.setStart(foundNode, startOffset);
    range.setEnd(foundNode, endOffset);
    return range;
  }
};})

//server session information
.factory('SessionID', function() {
  var id = '00000000';
  var socket = null;

  var GetID = function () {
    return id;
  };

  var SetID = function (idVal) {
    id = idVal;
  }

  var GetSocket = function () {
    return socket;
  };

  var SetSocket = function (socketVal) {
    socket = socketVal;
  };

  return {
    getID: GetID,
    setID: SetID,
    getSocket: GetSocket,
    setSocket: SetSocket
  };
})


//generate UUID
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


  //Annotation class
.factory('Annotation', ['GenerateID', 'SessionID', '$state', function(GenerateID, SessionID, $state) {

  var HighlightRange = function (uuid, range, color, onClickCallback) {
    var newNode = document.createElement("div");
    newNode.setAttribute("style", "background-color: " + color + "; display: inline;");
    newNode.setAttribute("id", uuid);

    newNode.addEventListener('click', function(event) {
      if (onClickCallback) {
        onClickCallback(selected[this.id]);
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
      selected[uuid] = {uuid: uuid, text: text, color: color};
      selected[uuid]["range"] = selectionRange;
      var saveNode = selectionRange.startContainer;
      selected[uuid]["startOffset"] = selectionRange.startOffset;  // where the range starts
      selected[uuid]["endOffset"] = selectionRange.endOffset;      // where the range ends
      selected[uuid]["nodeData"] = saveNode.data;                       // the actual selected text
      selected[uuid]["nodeHTML"] = saveNode.parentElement.innerHTML;    // parent element innerHTML
      selected[uuid]["nodeTagName"] = saveNode.parentElement.tagName;
      HighlightRange(uuid, selectionRange, color, onClickCallback?onClickCallback:AnnotationClickCallback);
      if (transmit) {
        SessionID.getSocket().emit('add', {page: $state.current.url, id: uuid, data: selected[uuid]});
      }
    }
  };

  var Remove = function(uuid){
    delete selected[uuid];
    $('#'+ uuid).replaceWith(document.createTextNode($('#'+ uuid).html()));
    SessionID.getSocket().emit('update', {page: $state.current.url, id: uuid});
  };

  var Update = function(uuid, color, text){
    selected[uuid].color = color;
    selected[uuid].text = text;
    $('#' + uuid).css("background-color", color);
    SessionID.getSocket().emit('update', {page: $state.current.url, id: uuid, data: selected[uuid]});
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
