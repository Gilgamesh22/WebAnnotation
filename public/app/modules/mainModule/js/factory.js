angular.module('App')
.factory('NavItems', function(){
  return [
    {name :"Wiki", selected: true},
    {name :"BBC", selected: false},
    {name :"adrianmejia", selected: false}
  ]
})
