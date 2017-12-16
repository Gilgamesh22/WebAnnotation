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
.factory('GenerateID', function() {
  uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  return {
    createUuid: uuidv4
  };})
.factory('Annotation', ['GenerateID', function(GenerateID){

  var selected = {};

  var Add = function(test, color, selectionRange, onClickCallback) {
    highlightRange = function (uuid, range, color) {
      var newNode = document.createElement("div");
      newNode.setAttribute("style", "background-color: " + color + "; display: inline;");
      newNode.setAttribute("id", uuid);

      newNode.onclick = function(event) {
        if (onClickCallback) {
          onClickCallback(uuid, selected[this.id]);
        }
      };

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
    }
  };

  var Remove = function(uuid){
    delete selected[uuid];
  };

  var Update = function(uuid, color, text){
    selected[uuid].color = color;
    selected[uuid].text = text;
  };


  return {
    add: Add,
    remove: Remove,
    update: Update
  };}]);
