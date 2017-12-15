validSelection = null;

angular.module('App')
.controller('NavItemController',['$scope', 'NavItems', function($scope, NavItems) {
  $scope.navItems = NavItems;

  $('#annotateBtn').on('click', function(){
    $('#AnnotationDeleteBtn').css("visibility", "collapse");
    $('#AnnotationUpdateBtn').css("visibility", "collapse");
    $('#AnnotationAddBtn').css("visibility", "visible");
    $('#addAnnotation').modal();
  })
}])
.controller('Annotate',['$scope', 'Annotation', function($scope, Annotation) {
  $scope.color = "#aaf442";
  $scope.clearAnnotationText = true;

  $("#addAnnotation").on('show.bs.modal', function () {
    if ($scope.clearAnnotationText) {
      $scope.annotationText = "";
    }
  });

  $scope.$watch(function () {
    return $scope.annotationText;
  },
  function (newValue, oldValue) {
      if(newValue == oldValue){return;}
      $scope.annotationText = newValue;
  }, true);

  var AddAnnotation = function(){
    Annotation.Add($scope.annotationText, $scope.color, function(uuid, data){
      $('#AnnotationDeleteBtn').css("visibility", "visible");
      $('#AnnotationUpdateBtn').css("visibility", "visible");
      $('#AnnotationAddBtn').css("visibility", "collapse");

      $scope.$apply(function() {
        $scope.color = data.color;
        $scope.annotationText = data.test;
        $scope.uuid = uuid;
        $scope.clearAnnotationText = false;
      });
      $('#addAnnotation').modal();
      $scope.clearAnnotationText = true;
    });
  };
  $scope.Add = AddAnnotation;

  var DeleteAnnotation = function(){
    Annotation.Remove($scope.uuid);
    $('#'+ $scope.uuid).replaceWith(document.createTextNode($('#'+ $scope.uuid).html()));
  };

  $scope.Delete = DeleteAnnotation;

  $scope.Update = function(){
    DeleteAnnotation();
    AddAnnotation();
  };

}])
.controller('IframeUpdate', ['$scope', 'Selection', function($scope, Selection){

  annotatable = $('#website');
  annotatable.on('mouseup mouseup', function() {
    Selection.setSelected(window.getSelection());
  });
}])
;

