    var socket = io('0.0.0.0:8000');

    socket.on('connect', function() { 
      console.log('Connected to server'); 
      //socket.emit("client_msg", "Hello from client " + socket.id); 
    });
    socket.on('disconnect', function() { console.log('Disconnected from server'); });

    function send_source_code_file() {
      var file = document.getElementById('source_code_file_input');
      var file_name = file.value;
      var editor = ace.edit("editor");
      if (file.files[0]) {
        var reader = new FileReader();
        reader.readAsText(file.files[0], "UTF-8");
        reader.onload = function (evt) {
          //var editor = ace.edit("editor");
          editor.setValue(evt.target.result);
        }
        reader.onerror = function (evt) {
          //var editor = ace.edit("editor");
          editor.setValue("Error reading the file.");
        }
      }
      var t_n = file_name.search("C:");
      if (t_n > -1) {
        file_name = file_name.replace(/^.*\\/, "");
        socket.emit('upload_source_code_file_to_server', file.files[0], file_name);
      } else {
        socket.emit('upload_source_code_file_to_server', file.files[0], file_name);
      }
      document.getElementById('source_code_file_input').value = "";
      editor.focus();
      session = editor.getSession();
      //Get the number of lines
      var count = session.getLength();
      editor.gotoLine(1, count);
    }

    var suggested_fixes     = [];
    var try_suggested_fixes = [];

    var testcases_uploaded  = [];
    var no_of_tc            = 0;
    var testcase_numbers    = [];
    function send_test_case_file() {
      var file = document.getElementById('test_case_file_input');
      var testcase_name = document.getElementById('test_case_file_input').value;
      var t_n = testcase_name.search("C:");
      if (t_n > -1) {
        testcase_name = testcase_name.replace(/^.*\\/, "");
        add_testcase_element(testcase_name.substring(0,3));    // Google chrome
        socket.emit('upload_test_case_file_to_server', file.files[0], testcase_name);
      } else {
        add_testcase_element(testcase_name.substring(0,3));
        socket.emit('upload_test_case_file_to_server', file.files[0], testcase_name);
      }
      ++no_of_tc;
      document.getElementById('test_case_file_input').value = "";
    }

    function run() {
      suggested_fixes.forEach(function(suggested_fix) {
        if(document.getElementById(suggested_fix).checked) {
          try_suggested_fixes.push(suggested_fix);
        }
      });
      socket.emit('run', try_suggested_fixes);
    }

    function tarantula() {
      socket.emit('get_tarantula_results');
    }

    function is_user_guided() {
      socket.emit('is_user_guided');
    }

    function default_repair_process() {
      socket.emit('default_repair_process');
    }

    var line_colors_ace = {};

    function reset() {
      socket.emit('reset_tc');
      var testcase_num = 1;
      var editor = ace.edit("editor");
      var Range = ace.require('ace/range').Range;
      var count = session.getLength();
      editor.gotoLine(1, count);
      session = editor.getSession();
      for (var testcase_name in testcases_uploaded) {
        document.getElementById(testcases_uploaded[testcase_name]).style.border = "gray";
        document.getElementById(testcases_uploaded[testcase_name]).style.backgroundColor = 'gray';
        ++testcase_num;
      }

      [line_colors_ace].forEach(function(obj) {
        Object.keys(obj).forEach( function(key) {
          var marker_style = "myMarker" + key.toString();
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '.' + marker_style + ' {position:absolute; background:' + 'white' + '; z-index: 5;}';
          document.getElementsByTagName('head')[0].appendChild(style);
          editor.session.addMarker(new Range(key-1,0,key-1,1), marker_style, "fullLine"); 
        });
      });
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

      label.appendChild(document.createTextNode(text));
      suggested_fixes.push(name);
      return label;
    }

    socket.on('display_fixes_options', function(fix) {
      fix.forEach(function (suggested_fix) {
        var checkbox = makeCheckbox(suggested_fix, false, suggested_fix);
        checkbox_home.appendChild(checkbox);
        checkbox_home.appendChild(document.createElement("br"));
      });
    });

    function send_faulty_line_number() {
      var editor = ace.edit("editor");
      var faulty_line_number = editor.selection.getCursor();
      socket.emit('send_faulty_line_number', JSON.stringify(1+ +faulty_line_number["row"]));
    }
 
    var faulty_line_num = -1;
    socket.on('faulty_line_number', function(line_num) {
      //line_num = 7;
      
      document.getElementById("error_fix_sugg").style.visibility = "visible";
      document.getElementById('faulty_line_fix').innerHTML = "Faulty line number is " +
        document.getElementById('faulty_line_fix').innerHTML  + line_num + ", ";
      var editor = ace.edit("editor");
      var Range = ace.require('ace/range').Range;
      //To focus the ace editor
      //if (isNumber(line_num)) {
      faulty_line_num = line_num;
      editor.focus();
      session = editor.getSession();
      //Get the number of lines
      //count = session.getLength();
      count = session.getLine(line_num).length;
      //Go to end of the last line
      //editor.gotoLine(line_num, count);
      editor.gotoLine(line_num, line_num);
      //alert(count);
      //editor.session.addMarker(new Range(line_num-1, 0, 1, 0), "myMarker", "fullLine");
        
      //editor.session.addMarker(new Range(line_num-1,0,1), "myMarker", "fullLine"); 
      //}
      faulty_line_num = line_num;
    });

    

    socket.on('likely_repair', function(data) {
      document.getElementById('faulty_line_fix').innerHTML = document.getElementById('faulty_line_fix').innerHTML +
      "suggested fix is " + data;
       // document.getElementById('suggestion_popover').setAttribute("data-content", data);
      var editor = ace.edit("editor");
      //if (isNumber(faulty_line_num)) {
      if (faulty_line_num >= 0 ) {
        editor.getSession().setAnnotations([{ row: faulty_line_num-1, text: data, type: "error" }]);   
      }
      //}
    });

    var max_color = 120.0;
    var color_ranges = {"20.0": "#00ff00", "40.0": "#ffff1a", "60.0": "#ffcc00", "80.0": "#ff6600", "100.0": "#ff3300", "120.0": "#ff0000"};

    var green_color = "#00ff00";
    function get_color(color_value) {
      for (var key in color_ranges) {
        if (color_ranges.hasOwnProperty(key)) {
          //alert(key + " -> " + color_ranges[key]);
          if (color_value == -120.0)  return "#ffffff";
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

    
  
    socket.on('line_colors', function(line_colors) {
      var editor = ace.edit("editor");
      var Range = ace.require('ace/range').Range;
      session = editor.getSession();
      var count = session.getLength();
      editor.gotoLine(1, count);
      var iterations = 1;
      [JSON.parse(line_colors)].forEach(function(obj) {
        Object.keys(obj).forEach( function(key) {
          var color_value = obj[key];
          var color_float = parseFloat(color_value);
          var color = get_color(color_float);
          line_colors_ace[key] = color;
          if (color != "") {
            //alert(iterations);
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
    });

    socket.on('tc_cov_result', function(tc_result) {
      var results = JSON.parse(tc_result);
      var tc_key = Object.keys(results);
      var name_tc = "TC" + tc_key;
      if (JSON.stringify(results[tc_key]) == JSON.stringify("P")) document.getElementById(name_tc).style.backgroundColor = 'green';
      else if (JSON.stringify(results[tc_key]) == JSON.stringify("F")) document.getElementById(name_tc).style.backgroundColor = 'red';
                  
    });

    var testcase_results_and_fixes = null;

    socket.on('testcase_results_with_fixes', function (TC_results_with_fixes) {
      testcase_results_and_fixes = TC_results_with_fixes;
      [JSON.parse(TC_results_with_fixes)].forEach(function(obj) {
        Object.keys(obj).forEach( function(key) {
          var node =obj[key];
          document.getElementById('detailed_info').innerHTML =
            document.getElementById('detailed_info').innerHTML + "Fix: " + key + " \n";  
          [node].forEach(function(obj1) {
            Object.keys(obj1).forEach( function(key1) {
              var node1 = obj1[key1];
              if (key1 != "fix") {
                var testcase_name = "TC" + key1;
                document.getElementById('detailed_info').innerHTML =
                  document.getElementById('detailed_info').innerHTML + testcase_name + " => " + node1 + ", ";  //JSON.stringify(node1)
                //if (key == 1) {
                  if (JSON.stringify(node1) == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                  else if (JSON.stringify(node1) == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
                //}
              } else {
                document.getElementById('detailed_info').innerHTML =
                  document.getElementById('detailed_info').innerHTML  + key1 + " => " + JSON.stringify(node1) + ", "; 
              }
            });
            document.getElementById('detailed_info').innerHTML =
              document.getElementById('detailed_info').innerHTML + " \n";  
          });
        });
      });
      
    });
    

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
            var testcase_result = JSON.stringify(test_suite[testcase_numbers[curr_tc_num-1]]);
            var testcase_name = "TC" + testcase_numbers[curr_tc_num-1];
            //alert("testcase_result: " + testcase_result + " testcase_name: " + testcase_name);
            if (testcase_result == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
            else if (testcase_result == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
          }
        }
      }
    }

    function demo_go_back() {
      if (testcase_results_and_fixes) {
        var testcase_info = JSON.parse(testcase_results_and_fixes);
        var goes_back_iteration = false;
        var at_start = false;
        if (curr_tc_num-1 < 0) {
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
                  if (!isNaN(key)) {
                  var testcase_result = JSON.stringify(test_suite[key]);
                  var testcase_name = "TC" + key;
                  ++tc_count;
                  if (testcase_result !== undefined) {
                    if (testcase_result == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                    else if (testcase_result == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
                  }
                }
              });
            });
            curr_tc_num = no_of_tc;
          } else {
            if (curr_tc_num == no_of_tc && update_fix == true) update_fix = false;
            --curr_tc_num;
            var testcase_name = "TC" + testcase_numbers[curr_tc_num];
            make_testcase_gray(testcase_name);
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

    

    function demo_backward() {
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
                        testcase_count = no_of_tc; 
                        if (tc_count != Object.keys(node).length) {
                          if (JSON.stringify(testcase_result) == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                          else if (JSON.stringify(testcase_result) == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'red';
                        }
                      } else {
                        if (testcase_count == tc_count) {
                          if (testcase_count == no_of_tc && update_text == true) update_text = false;
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
    // ====================================================================================================


    document.body.onload = add_testcase_element;

    function add_testcase_element(testcase_name) {
      testcases_uploaded.push(testcase_name);
      testcase_numbers.push(testcase_name.substring(2,3));
      var tc_elem = document.createElement("div");
      tc_elem.className = "TC";
      tc_elem.id = testcase_name;
      tc_elem.onclick = function() { 
        document.getElementById(testcase_name).style.border = "thick solid #ffff00";
        socket.emit('show_coverage', testcase_name)
      };
      var tc_names = document.createElement("span");
      var new_content = document.createTextNode(testcase_name); 

      tc_names.className = "TCNames";
      //new_content.style.color = "magenta";
      tc_names.appendChild(new_content); 
      tc_elem.appendChild(tc_names);
      var current_div = document.getElementById("testcases"); 
      // alert("1");
      // document.getElementById(tc_elem.id).onClick = run;
      // alert("2");
      current_div.appendChild(tc_elem); 
    }
  