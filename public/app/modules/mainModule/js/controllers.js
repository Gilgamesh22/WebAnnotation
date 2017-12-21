validSelection = null;

angular.module('App')
.controller('MainController', ['$scope', 'SessionID', function(sessionID){
  $scope.init = function () {
    var socket = io.connect(location.origin);
    sessionID.setSocket(socket);
    socket.on('connectionID', function (data) {
      sessionID.setID(data);
    });
  }
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
.controller('Annotate',['$scope', 'Annotation', 'Selection', function($scope, Annotation, Selection) {
  $scope.color = "#aaf442";
  $scope.clearAnnotationText = true;
  var socket = Selection.getSocket();
  socket.emit('join', {page: $location});
  socket.on('init', function(data){
    Annotation.setSelected(data);
  });


  $("#addAnnotation").on('show.bs.modal', function () {
    if ($scope.clearAnnotationText) {
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

  var AnnotationClickCallback = function(uuid, data){
    $('#AnnotationDeleteBtn').css("visibility", "visible");
    $('#AnnotationUpdateBtn').css("visibility", "visible");
    $('#AnnotationAddBtn').css("visibility", "collapse");

    $scope.$apply(function() {
      $scope.color = data.color;
      $('#cp').colorpicker('setValue', data.color);
      $scope.annotationText = data.test;
      $scope.uuid = uuid;
      $scope.clearAnnotationText = false;
    });
    $('#addAnnotation').modal();
    $scope.clearAnnotationText = true;
  };

  $scope.Add = function() {
    Annotation.add($scope.annotationText, $scope.color, Selection.getRange(), AnnotationClickCallback);
  };

  var DeleteAnnotation = function(){
    Annotation.remove($scope.uuid);
    $('#'+ $scope.uuid).replaceWith(document.createTextNode($('#'+ $scope.uuid).html()));
  };

  $scope.Delete = DeleteAnnotation;

  $scope.Update = function(){
    Annotation.update($scope.uuid, $scope.color, $scope.annotationText);
    $('#' + $scope.uuid).css("background-color", $scope.color);
  };

}])
.controller('IframeUpdate', ['$scope', 'Selection', function($scope, Selection){

  annotatable = $('#website');
  annotatable.on('mouseup mouseup', function() {
    Selection.setSelected(window.getSelection());
  });
}])
;

