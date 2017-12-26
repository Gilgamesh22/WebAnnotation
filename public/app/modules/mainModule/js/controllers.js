angular.module('App')
.controller('MainController', ['$scope', 'SessionID', function($scope, sessionID){
  $scope.init = function () {
    var socket = io.connect(location.href);
    sessionID.setSocket(socket);
    socket.on('connectionID', function (data) {
      sessionID.setID(data.sesstionID);
    });
  };
}])

.controller('NavItemController',['$scope', 'NavItems', function($scope, NavItems) {
  $scope.navItems = NavItems;

  $('#annotateBtn').on('click', function(){
    $('#AnnotationDeleteBtn').css("visibility", "collapse");
    $('#AnnotationUpdateBtn').css("visibility", "collapse");
    $('#AnnotationAddBtn').css("visibility", "visible");
    $('#addAnnotation').modal();
  })
}])

.controller('Annotate',['$scope', 'Annotation', 'Selection', 'SessionID', function($scope, Annotation, Selection, SessionID) {
  $scope.color = "#aaf442";

  $("#addAnnotation").on('show.bs.modal', function () {
    var data = Selection.getSelectedID()
    if (data) {
      $('#AnnotationDeleteBtn').css("visibility", "visible");
      $('#AnnotationUpdateBtn').css("visibility", "visible");
      $('#AnnotationAddBtn').css("visibility", "collapse");

      $scope.$apply(function() {
        $scope.color = data.color;
        $('#cp').colorpicker('setValue', data.color);
        $scope.annotationText = data.text;
        $scope.uuid = data.uuid;
      });
    } else {
      $scope.$apply(function() {
        $scope.annotationText = "";
      });
    }
  });

  $scope.$watch(function () {
    return $scope.annotationText;
  },
  function (newValue, oldValue) {
      if(newValue == oldValue){return;}
      $scope.annotationText = newValue;
  }, true);

  var AnnotationClickCallback = function(data){
    Selection.setSelectedID(data);
    $('#addAnnotation').modal();
    Selection.setSelectedID(null);
  };

  $scope.Add = function() {
    Annotation.add($scope.annotationText, $scope.color, Selection.getRange(), AnnotationClickCallback);
  };

  $scope.Delete = function(){
    Annotation.remove($scope.uuid);
  };

  $scope.Update = function(){
    Annotation.update($scope.uuid, $scope.color, $scope.annotationText);
  };

}])

.controller('IframeUpdate', ['$scope', 'Selection', 'SessionID', 'Annotation', 'BuildRange', function($scope, Selection, SessionID, Annotation, BuildRange){

  var AnnotationClickCallback = function(data){
    Selection.setSelectedID(data);
    $('#addAnnotation').modal();
    Selection.setSelectedID(null);
  };

  var socket = SessionID.getSocket();
  socket.emit('join', {page: location.href});
  socket.on('init', function(values){
    Annotation.resetSelected();
    for (var item in values) {
      Annotation.add(values[item].text, values[item].color, BuildRange.buildRange(values[item]["startOffset"], values[item]["endOffset"], values[item]["nodeData"], values[item]["nodeHTML"], values[item]["nodeTagName"]), AnnotationClickCallback, item);
    }
  });

  socket.on('add', function(data){
    Annotation.add(data.data.text, data.data.color, BuildRange.buildRange(data.data["startOffset"], data.data["endOffset"], data.data["nodeData"], data.data["nodeHTML"], data.data["nodeTagName"]), AnnotationClickCallback, data.id);
  });


  socket.on('update', function(data){
    Update(data.id, data.data.color, data.data.text);
  });

  socket.on('remove', function(data){
    Remove(data.id);
  });

  annotatableSection = $('#website');
  annotatableSection.on('mouseup mouseup', function() {
    Selection.setSelected(window.getSelection());
  });
}])
;

