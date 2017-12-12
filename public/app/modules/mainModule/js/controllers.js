validSelection = null;

angular.module('App')
.controller('NavItemController',['$scope', 'NavItems', function($scope, NavItems, Selection) {
  $scope.navItems = NavItems;
}])
.controller('Annotate',['$scope', 'Selection', function($scope, Selection) {
  $scope.color = "#aaf442";
  $scope.annotationText = "";
  $scope.Annotate = function() {
    highlightRange = function (range, color) {
      var newNode = document.createElement("div");
      newNode.setAttribute(
         "style",
         "background-color: " + color + "; display: inline;"
      );
      try{
        range.surroundContents(newNode);
      } catch(error) {
        alert(error);
      };
    };

    if (Selection.selected) {
      highlightRange(Selection.selected.getRangeAt(0), $scope.color);
    }
  };
}])
.controller('IframeUpdate', ['$scope', 'Selection', function($scope, Selection){

  annotatable = $('#website');
  annotatable.on('mouseup mouseup', function() {
    Selection.selected = window.getSelection();
  });

}])
;

