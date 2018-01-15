function PageCtrl($scope, $http) {

}


function ToolCtrl($scope, $http, $location) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/lazy");
  editor.getSession().setMode("ace/mode/c_cpp");
  //script(src='js/tool.js');
}


function MedSampleCtrl($scope, $http) {
   var editor = ace.edit("editor");
   editor.setTheme("ace/theme/lazy");
   editor.getSession().setMode("ace/mode/c_cpp");
   editor.setValue(
   "#include <stdio.h>" + "\n" + 
   "int mid(int x,int  y, int z) {" + "\n" + 
   "    int m;" + "\n" +
   "    m = z;" + "\n" +
   "    if (y < z) {" + "\n" +
   "        if (x <y) {"  + "\n" +
   "            m = y;" + "\n" +
   "        } else if (x < z) {" + "\n" +
   "            m = y;"  + "\n" +
   "        }" + "\n" +
   "    } else {" + "\n" +
   "        if (x > y) {"  + "\n" +
   "            m = y;"  + "\n" +
   "        } else if (x > z) {" + "\n" +
   "            m = x;"  + "\n" +
   "        }" + "\n" +
   "    }" + "\n" +
   "    return m;" + "\n" +
   "}");
   var faulty_line_num = 9;
   var Range = ace.require('ace/range').Range;
   session = editor.getSession();
   //editor.gotoLine(faulty_line_num, faulty_line_num);  
   //editor.session.addMarker(new Range(faulty_line_num-1,0,1), "myMarker", "fullLine"); 
   //editor.getSession().setAnnotations([{ row: faulty_line_num-1, text: "Replace the value of variable m with x", type: "error" }]);  
}

function GreaterRootSampleCtrl($scope, $http) {
   var editor = ace.edit("editor");
   editor.setTheme("ace/theme/lazy");
   editor.getSession().setMode("ace/mode/c_cpp");
   editor.setValue(
   "#include <stdio.h>" + "\n" +
   "#include <math.h>" + "\n" +
   "\n" + 
   "int greater_root(int a,int  b, int c) {" + "\n" + 
   "    int larger_root;" + "\n" +
   "    int determinant = (b*b) - (4*a*c);" + "\n" +
   "    if (determinant >= 0) {" + "\n" +
   "        int root1 = ((-b) + sqrt(determinant))/(2*a);"  + "\n" +
   "        int root2 = ((-b) - sqrt(determinant))/(2*a);" + "\n" +
   "        if (root1>root2) {" + "\n" +
   "            larger_root = root2;"  + "\n" +
   "        } else {" + "\n" +
   "            larger_root = root2;" + "\n" +
   "        }"  + "\n" +
   "     }" + " \n" +
   "     return larger_root;" + "\n" +
   "}");
 }

 function AvgSampleCtrl($scope, $http) {
   var editor = ace.edit("editor");
   editor.setTheme("ace/theme/lazy");
   editor.getSession().setMode("ace/mode/c_cpp");
   editor.setValue(
   "#include <stdio.h>" + "\n" +
   "#include <math.h>" + "\n" +
   "\n" + 
   "int average(int array[]) {" + "\n" + 
   "    int i;" + "\n" +
   "    int sum = 0;" + "\n" +
   "    int length = 5;" + "\n" +
   "    for (i = 0; i < length; ++i) {"  + "\n" +
   "        sum = sum * array[i];" + "\n" +
   "    }" + "\n" +
   "    int avg = sum / length;"  + "\n" +
   "    return avg;" + "\n" +
   "}");
 }

  function FibSampleCtrl($scope, $http) {
   var editor = ace.edit("editor");
   editor.setTheme("ace/theme/lazy");
   editor.getSession().setMode("ace/mode/c_cpp");
   editor.setValue(
   "#include <stdio.h>" + "\n" +
   "\n" + 
   "int fib(int n) {" + "\n" + 
   "    if (n == 0 || n == 1) {" + "\n" + 
   "        return n;" + "\n" + 
   "    }" + "\n" + 
   "    int prev = 0;" + "\n" +
   "    int curr = 1;" + "\n" +
   "    int next = 0;" + "\n" +
   "    int i;" + "\n" + 
   "    for (i = 1; i < n; ++i) {"  + "\n" +
   "        next = curr - prev;" + "\n" +
   "        prev = curr;" + "\n" +
   "        curr = next;" + "\n" +
   "    }" + "\n" +
   "    return next;" + "\n" +
   "}");
 }

function SwapSampleCtrl($scope, $http, $location) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/c_cpp");
  editor.setValue(
   "#include <stdio.h>" + "\n" + 
   "\n" +
   "int swap(int a, int b) {" + "\n" + 
   "    int temp = a;" + "\n" +
   "    b = temp;" + "\n" +
   "    a = b;" + "\n" +
   "    return a;"  + "\n" +
   "}");
   var faulty_line_num = 4;
   var Range = ace.require('ace/range').Range;
   session = editor.getSession();
   editor.gotoLine(faulty_line_num, faulty_line_num);  
   editor.session.addMarker(new Range(faulty_line_num-1,0,1), "myMarker", "fullLine"); 
   editor.getSession().setAnnotations([{ row: faulty_line_num-1, text: "Replace the value of variable m with x", type: "error" }]);  
}

function FeedbackCtrl($scope, $http, $location) {
  script(src='js/feedback.js');
  /*$scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        //$location.path('/');
      });
  };*/
}




function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}