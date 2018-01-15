
    var testcases_uploaded = [];
    var no_of_test_cases = 6;
    var testcase_name_start = "TC";
    for (var testcase_id = 1; testcase_id <= no_of_test_cases; ++testcase_id ) {
      add_testcase_element(testcase_name_start.concat(testcase_id));
    }

    var start_demo = false;
    var editor = ace.edit("editor");
    var faulty_line_num;
    var testcase_results_and_fixes;

    // variables and function for coloring lines
    var max_color = 120.0;
    var color_ranges = {"20.0": "#00ff00", "40.0": "#ffff1a", "60.0": "#ffcc00", "80.0": "#ff6600", "100.0": "#ff3300", "120.0": "#ff0000"};

    var green_color = "#00ff00";
    function get_color(color_value) {
      for (var key in color_ranges) {
        if (color_ranges.hasOwnProperty(key)) {
          //alert(key + " -> " + color_ranges[key]);
          var lower_range = key - 20.0;
          if (color_value == 0.0) {
            return green_color;
          } else if (color_value > lower_range && color_value <= key) {
            return color_ranges[key];
          }
        }
      }
      return "";
    }

    var line_colors = JSON.stringify({"2":"60.000000","3":"60.000000","4":"60.000000","5":"60.000000","6":"74.999999","7":"0.000000","8":"0.000000","9":"100.000000","10":"100.000000","11":"74.999999","12":"0.000000","13":"0.000000","14":"0.000000","15":"-120.000000","16":"-120.000000","19":"60.000000"});

    function color_lines() {
      var Range = ace.require('ace/range').Range;
      session = editor.getSession();
      var iterations = 1;
      [JSON.parse(line_colors)].forEach(function(obj) {
        Object.keys(obj).forEach( function(key) {
          var color_value = obj[key];
          var color_float = parseFloat(color_value);
          var color = get_color(color_float);
          if (color != "") {
            var marker_style = "myMarker" + iterations.toString();
            iterations++;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.' + marker_style + ' {position:absolute; background:' + color + '; z-index: 5;}';
            document.getElementsByTagName('head')[0].appendChild(style);
            //alert(marker_style + "      " + style.innerHTML)
            editor.session.addMarker(new Range(key-1,0,key-1,1), marker_style, "fullLine"); 
            //editor.session.addMarker(new Range(9-1,0,1), "myMarker", "fullLine"); 
          }
        });
      });
    }

    function run() {
      start_demo = true;
      document.getElementById('detailed_info').innerHTML = 
      "Fix: 1 \n" + 
      "TC1 => P, TC2 => P, TC3 => P, TC4 => P, TC5 => P, TC6 => F, fix => 'z' \n" +  
      "Fix: 2 \n" + 
      "TC1 => P, TC2 => P, TC3 => P, TC4 => P, TC5 => P, TC6 => P, fix => 'x'";
      document.getElementById("error_fix_sugg").style.visibility = "visible";
      faulty_line_num = 9;    
      testcase_results_and_fixes = '{"1":{"1":"P","2":"P","3":"P","4":"P","5":"P","6":"F","fix":"z"},"2":{"1":"P","2":"P","3":"P","4":"P","5":"P","6":"P","fix":"x"}}';
      document.getElementById('faulty_line_fix').innerHTML = "Faulty line number is 9, Suggested fix is: Replace the value of variable at line number 9 with the value of variable x.";
      var Range = ace.require('ace/range').Range;
      editor.gotoLine(faulty_line_num, faulty_line_num); 
      /*document.getElementById('myMarker').style.backgroundColor = 'grey';
      var xxxx = document.getElementById('myMarker');
      alert("helllo");
      xxxx.style.backgroundColor = 'red';
      alert("ok -_-");
      var to_use_class = "myMarker1";*/
      /*var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = '.myMarker1 {position:absolute; background:#ff99cc; z-index: 5;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      alert("hello");*/
      //document.getElementById('someElementId').className = 'cssClass';
      var style = document.createElement('style');
      style.type = 'text/css';
      var iterations = 1;
      var marker_style = "myMarker" + iterations.toString();
      var color = "#ff0000";
      style.innerHTML = '.'+marker_style + ' {position:absolute; background:' + color + '; z-index: 5;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      //alert(marker_style + "      " + style.innerHTML)
      //editor.getSession().addMarker(new Range(faulty_line_num-1,0,1), ".myMarker1", "fullLine"); 
      //editor.getSession().addMarker(new Range(faulty_line_num-1,0,1), marker_style, "fullLine"); 
      editor.getSession().setAnnotations([{ row: faulty_line_num-1, text: "Replace the value of variable m with x", type: "error" }]);  
      color_lines();
    }

    function make_all_testcases_gray() {
      testcases_uploaded.map(function (testcase_name) {
        document.getElementById(testcase_name).style.backgroundColor = 'gray';
      });
    }

    function make_testcase_gray(testcase_name) {
      document.getElementById(testcase_name).style.backgroundColor = 'gray';
    }

    // Use key values to access map, assuming keys for testcases are always 1, 2, 3, ... ,n
    // ====================================================================================================
    var curr_sugg_num = 1;
    var curr_tc_num = 0;
    var update_fix = true;
    function demo_go_forward() {
      if (start_demo) {
      change_tc_color = true;
      if (testcase_results_and_fixes) {
        var testcase_info = JSON.parse(testcase_results_and_fixes);
        if (curr_sugg_num <= Object.keys(testcase_info).length) {
          var test_suite = testcase_info[curr_sugg_num];
          if (curr_tc_num == Object.keys(test_suite).length-1) {
            ++curr_sugg_num;
            if (curr_sugg_num <= Object.keys(testcase_info).length ) curr_tc_num = 1;
            test_suite = testcase_info[curr_sugg_num];
            if (curr_sugg_num <= Object.keys(testcase_info).length)  update_fix = true;
            if (curr_sugg_num > Object.keys(testcase_info).length)  change_tc_color = false;
            if (curr_sugg_num > Object.keys(testcase_info).length) --curr_sugg_num;
          } else {
            ++curr_tc_num;
          }
          if (update_fix) {
            document.getElementById('demo_fix').innerHTML = "Suggested fix no." + curr_sugg_num  + ": Replace value of variable at line " + faulty_line_num + " with value of variable " + test_suite["fix"];
            update_fix = false;
            make_all_testcases_gray();
          }
          if (change_tc_color) {
            var testcase_result = JSON.stringify(test_suite[curr_tc_num]);
            var testcase_name = "TC" + curr_tc_num;
            if (testcase_result == JSON.stringify("P")) {document.getElementById(testcase_name).style.backgroundColor = 'green';}
            else if (testcase_result == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
          }
        }
      }
      }
    }

    function demo_go_back() {
      if (start_demo) {
      if (testcase_results_and_fixes) {
        var testcase_info = JSON.parse(testcase_results_and_fixes);
        var goes_back_iteration = false;
        var at_start = false;
        if (curr_tc_num-1 == 0) {
          goes_back_iteration = true;
          if (curr_sugg_num-1 <= 0) {
            at_start = true;  
            curr_sugg_num = 1;
          } else {
            --curr_sugg_num;
          }

        }
        if (!at_start) {
          var test_suite = testcase_info[curr_sugg_num];
          if (goes_back_iteration) {
            document.getElementById('demo_fix').innerHTML = "Suggested fix no." + curr_sugg_num  + ": Replace value of variable at line " + faulty_line_num + " with value of variable " + test_suite["fix"];
            update_fix = false; /////////////////
            var tc_count = 1;
            [test_suite].forEach(function (obj) {
              Object.keys(obj).forEach(function (key) {
                var testcase_result = JSON.stringify(test_suite[tc_count]);
                var testcase_name = "TC" + tc_count;
                ++tc_count;
                if (testcase_result !== undefined) {
                  if (testcase_result == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                  else if (testcase_result == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
                }
              });
            });
            curr_tc_num = 6;
          } else {
            if (curr_tc_num == 6 && update_fix == true) update_fix = false;
            var testcase_name = "TC" + curr_tc_num;
            make_testcase_gray(testcase_name);
            --curr_tc_num;
          }
        }
      }
      }
    }
    // ====================================================================================================
    // demo forward backwards function without an assumption that the key values of testcases are known
    var suggestion_count = 1;
    var testcase_count = 1;
    var update_text = true;
    function demo_forward() {
      if (start_demo) {
      var stop = false;
      if (testcase_results_and_fixes) {
        var testcase_info = JSON.parse(testcase_results_and_fixes);
        [testcase_info].forEach(function(obj) {
          Object.keys(obj).forEach( function(key) {
            var node =obj[key];
            var tc_count = 0;
              [node].forEach(function(testcase_obj) { 
                Object.keys(testcase_obj).forEach( function(testcase_key) {
                  if (stop) return;
                  if (key == suggestion_count) {
                    if (update_text) {
                      document.getElementById('demo_fix').innerHTML = "Suggested fix no." + key  + ": Replace value of variable at line " + faulty_line_num + " with value of variable " + testcase_obj["fix"];
                      make_all_testcases_gray();
                      update_text = false;
                    }
                    var testcase_name = "TC" + testcase_key;
                    ++tc_count;

                    if (testcase_count == tc_count && testcase_count != Object.keys(node).length) {
                      if (testcase_count == Object.keys(node).length-1) {
                        ++suggestion_count; 
                        testcase_count = 1;
                        if (suggestion_count <= Object.keys(testcase_info).length)  update_text = true;
                      } else {
                        ++testcase_count;
                      }
                      var testcase_result = testcase_obj[testcase_key];
                      if (JSON.stringify(testcase_result) == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                      else if (JSON.stringify(testcase_result) == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
                      stop = true;
                    }
                  }
                });
              });
            if (stop) return;
          });
        });
      }
      }
    }

    
    function demo_backward() {
      if (start_demo) {
      if (testcase_results_and_fixes) {
        var stop = false;
        var at_start = false;
        var goes_back_iteration = false;
        if (testcase_count-1 == 0) {
          goes_back_iteration = true;
          if (suggestion_count-1 <= 0) {
            at_start = true;
            suggestion_count = 1;
          } else {
            --suggestion_count;
          }
        }
        if (!at_start) {
          var _updated_text = false;
          [JSON.parse(testcase_results_and_fixes)].forEach(function(obj) {
            Object.keys(obj).forEach( function(key) {
              var node =obj[key];
              var tc_count = 0;
                [node].forEach(function(testcase_obj) { 
                  Object.keys(testcase_obj).forEach( function(testcase_key) {
                    if (stop) return;
                    ++tc_count;
                    var testcase_name = "TC" + testcase_key;
                    if (key == suggestion_count) {
                      if (goes_back_iteration) {
                        var testcase_result = testcase_obj[testcase_key];
                        if (_updated_text == false) {
                          _updated_text = true;
                          document.getElementById('demo_fix').innerHTML = "Suggested fix no." + key  + ": Replace value of variable at line " + faulty_line_num + " with value of variable " + testcase_obj["fix"];
                        }
                        testcase_count = 6; 
                        if (tc_count != Object.keys(node).length) {
                          if (JSON.stringify(testcase_result) == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                          else if (JSON.stringify(testcase_result) == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
                        }
                      } else {
                        if (testcase_count == tc_count) {
                          if (testcase_count == 6 && update_text == true) update_text = false;
                          make_testcase_gray(testcase_name);
                          testcase_count--;
                          stop = true;
                        }
                      }
                    }
                  });
                });
              if (stop) return;  
            });
          });
        }
      }
      }
    }
    // ====================================================================================================

    document.body.onload = add_testcase_element;

    function add_testcase_element(testcase_name) {
      testcases_uploaded.push(testcase_name);
      var tc_elem = document.createElement("div");
      tc_elem.className = "TC";
      tc_elem.id = testcase_name;
      var tc_names = document.createElement("span");
      var new_content = document.createTextNode(testcase_name); 

      tc_names.className = "TCNames";
      //new_content.style.color = "magenta";
      tc_names.appendChild(new_content); 
      tc_elem.appendChild(tc_names);
      var current_div = document.getElementById("testcases"); 
      current_div.appendChild(tc_elem); 
    }
  