
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
    var line_colors_2 = JSON.stringify({"2":"0.000000","3":"0.000000","4":"0.000000","5":"0.000000","6":"0.000000","7":"0.000000","8":"0.000000","9":"-120.000000","10":"-120.000000","11":"0.000000","12":"-120.000000","13":"-120.000000","14":"-120.000000","15":"-120.000000","16":"-120.000000","19":"0.000000"});
    var line_colors_4 = JSON.stringify({"2":"0.000000","3":"0.000000","4":"0.000000","5":"0.000000","6":"-120.000000","7":"-120.000000","8":"-120.000000","9":"-120.000000","10":"-120.000000","11":"-120.000000","12":"0.000000","13":"-120.000000","14":"-120.000000","15":"-120.000000","16":"-120.000000","19":"0.000000"});
    var line_colors_6= JSON.stringify({"2":"120.000000","3":"120.000000","4":"120.000000","5":"120.000000","6":"120.000000","7":"-120.000000","8":"-120.000000","9":"120.000000","10":"120.000000","11":"120.000000","12":"-120.000000","13":"-120.000000","14":"-120.000000","15":"-120.000000","16":"-120.000000","19":"120.000000"});
    var line_colors_reset = JSON.stringify({"2":"-120.000000","3":"-120.000000","4":"-120.000000","5":"-120.000000","6":"-120.000000","7":"-120.000000","8":"-120.000000","9":"-120.000000","10":"-120.000000","11":"-120.000000","12":"-120.000000","13":"-120.000000","14":"-120.000000","15":"-120.000000","16":"-120.000000","19":"-120.000000"});
    
    var show_line_colors_full_cov = true;
    var show_line_colors_2 = false;
    var show_line_colors_4 = false;
    var show_line_colors_6 = false;
    var show_line_color_reset = false;
    var tc_cov_to_show;
    var if_reset = false;

    function color_lines() {
      var Range = ace.require('ace/range').Range;
      session = editor.getSession();
      var iterations = 1;
      var use_line_colors;
      if (show_line_color_reset) {use_line_colors = line_colors_reset;}
      else if (show_line_colors_full_cov) {use_line_colors = line_colors;}
      else if (show_line_colors_2) {use_line_colors = line_colors_2;}
      else if (show_line_colors_4) {use_line_colors = line_colors_4;}
      else if (show_line_colors_6) {use_line_colors = line_colors_6;}

      [JSON.parse(use_line_colors)].forEach(function(obj) {
        Object.keys(obj).forEach( function(key) {
          var color_value = obj[key];
          var color_float = parseFloat(color_value);
          var color = get_color(color_float);
          if (color != "") {
            
            var marker_style = "myMarker" + iterations.toString();
            iterations++;
            var style = document.createElement('style');
            style.type = 'text/css';
            if (if_reset) color = "white";
            style.innerHTML = '.' + marker_style + ' {position:absolute; background:' + color + '; z-index: 5;}';
            document.getElementsByTagName('head')[0].appendChild(style);
            editor.session.addMarker(new Range(key-1,0,key-1,1), marker_style, "fullLine"); 
          } else {
            var marker_style = "myMarker" + iterations.toString();
            iterations++;
            var style = document.createElement('style');
            style.type = 'text/css';
            if (if_reset) color = "white";
            style.innerHTML = '.' + marker_style + ' {position:absolute; background:' + color + '; z-index: 5;}';
            document.getElementsByTagName('head')[0].appendChild(style);
            editor.session.addMarker(new Range(key-1,0,key-1,1), marker_style, "fullLine"); 
          }
        });
      });
      if_reset = false;
      show_line_color_reset = false;
    }

    function tc_cov_result(name_tc, result) {
      if (JSON.stringify(result) == JSON.stringify("P")) document.getElementById(name_tc).style.backgroundColor = 'green';
      else if (JSON.stringify(result) == JSON.stringify("F")) document.getElementById(name_tc).style.backgroundColor = 'red';
        
    }

    function show_coverage() {
      if (tc_cov_to_show == "TC2") {
        show_line_colors_full_cov = false;
        show_line_colors_2 = true;
        show_line_colors_4 = false;
        show_line_colors_6 = false;
        tc_cov_result("TC2", "P");
      } else if (tc_cov_to_show == "TC4") {
        show_line_colors_full_cov = false;
        show_line_colors_2 = false;
        show_line_colors_4 = true;
        show_line_colors_6 = false;
        tc_cov_result("TC4", "P");
      } else if (tc_cov_to_show == "TC6") {
        show_line_colors_full_cov = false;
        show_line_colors_2 = false;
        show_line_colors_4 = false;
        show_line_colors_6 = true;
        tc_cov_result("TC6", "F");
      }
      color_lines();
    }

    var curr_sugg_num = 1;
    var curr_tc_num = 0;
    var update_fix = true;

    function reset() {
      var testcase_num = 1;
      var Range = ace.require('ace/range').Range;
      var count = session.getLength();
      editor.gotoLine(1, count);
      session = editor.getSession();
      for (var testcase_name in testcases_uploaded) {
        document.getElementById(testcases_uploaded[testcase_name]).style.border = "gray";
        document.getElementById(testcases_uploaded[testcase_name]).style.backgroundColor = 'gray';
        ++testcase_num;
      }
      curr_sugg_num = 1;
      curr_tc_num = 0;
      update_fix = true;

      show_line_color_reset = true;
      show_line_colors_full_cov = true;
      show_line_colors_2 = false;
      show_line_colors_4 = false;
      show_line_colors_6 = false;

      if_reset = true;
      color_lines();
    }

    var checkbox_home = document.getElementById("checkbox_home");

    function makeCheckbox(name, value, text) {

      var label   = document.createElement("label");
      var checkbox   = document.createElement("input");
      checkbox.type  = "checkbox";
      checkbox.name  = name;
      checkbox.value = value;
      checkbox.id    = name;
      label.appendChild(checkbox);
      checkbox.disabled = true;
      if (name == "x" || name == "z") {
        checkbox.checked = true;
      }
      label.appendChild(document.createTextNode(text));
      return label;
    }


    $( document ).ready(function() {
      checkbox_home.appendChild(makeCheckbox("x", false, "x"));
      checkbox_home.appendChild(document.createElement("br"));
      checkbox_home.appendChild(makeCheckbox("z", false, "z"));
      checkbox_home.appendChild(document.createElement("br"));
      checkbox_home.appendChild(makeCheckbox("m", false, "m"));
      checkbox_home.appendChild(document.createElement("br"));
    });
    

    function tarantula() {
      color_lines();
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
      editor.getSession().setAnnotations([{ row: faulty_line_num-1, text: "Replace the value of variable m with x", type: "error" }]);  
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
      tc_elem.onclick = function() { 
        if (testcase_name == "TC2" || testcase_name == "TC4" || testcase_name == "TC6") {
          document.getElementById(testcase_name).style.border = "thick solid #ffff00";
          tc_cov_to_show = testcase_name;
          show_coverage();
        }
      };
      var tc_names = document.createElement("span");
      var new_content = document.createTextNode(testcase_name); 

      tc_names.className = "TCNames";
      //new_content.style.color = "magenta";
      tc_names.appendChild(new_content); 
      tc_elem.appendChild(tc_names);
      var current_div = document.getElementById("testcases"); 
      current_div.appendChild(tc_elem); 
    }
  