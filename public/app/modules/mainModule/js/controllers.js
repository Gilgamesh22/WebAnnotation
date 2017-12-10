validSelection = null;

angular.module('App')
.controller('NavItemController',['$scope', 'NavItems',  function($scope, NavItems) {
  $scope.navItems = NavItems;

  $scope.Annotate = function() {
    highlightRange = function (range, color) {
      var newNode = document.createElement("div");
      newNode.setAttribute(
         "style",
         "background-color: " + color + "; display: inline;"
      );
      range.surroundContents(newNode);
    }

    if (validSelection) {
      var userSelection = validSelection.getRangeAt(0);
      $('#myModal').modal('show')
    }
    else
    {

    }
  }

}])
.controller('IframeUpdate', ['$scope', function($scope){



  annotatable = document.getElementById('annotatable');

  annotatable.onmouseup = annotatable.onkeyup = annotatable.onselectionchange = function() {
    function Annotatable (element) {
      if (element.id == "annotatable") {
        return true;
      }
      else if(element.localName =="body") {
        return false;
      }
      Annotatable(element.parentNode);
    }

    //isValid = window.getSelection && Annotatable(document.activeElement)
    //if (isValid)
    //{
      validSelection = window.getSelection()
    //}
//else
    //{
    //  validSelection = null
   // }
  };
}])
;

