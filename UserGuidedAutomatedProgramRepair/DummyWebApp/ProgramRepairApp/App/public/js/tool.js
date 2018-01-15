/*    var socket = io('0.0.0.0:8000');

    socket.on('connect', function() { console.log('Connected to server'); });
    socket.on('disconnect', function() { console.log('Disconnected from server'); });

    function send_source_code_file() {
      var file = document.getElementById('source_code_file_input');
      var file_name = file.value;
      if (file.files[0]) {
        var reader = new FileReader();
        reader.readAsText(file.files[0], "UTF-8");
        reader.onload = function (evt) {
          var editor = ace.edit("editor");
          editor.setValue(evt.target.result);
        }
        reader.onerror = function (evt) {
          var editor = ace.edit("editor");
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
    }

    var testcases_uploaded = [];
    var no_of_tc = 0;
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
      socket.emit('run');
    }
    var faulty_line_num = -1;
    socket.on('faulty_line_number', function(line_num) {
      //line_num = 7;
      faulty_line_num = line_num;
      document.getElementById("error_fix_sugg").style.visibility = "visible";
      document.getElementById('faulty_line_fix').innerHTML = "Faulty line number is " +
        document.getElementById('faulty_line_fix').innerHTML  + line_num + ", ";
      var editor = ace.edit("editor");
      var Range = ace.require('ace/range').Range;
      //To focus the ace editor
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

      editor.session.addMarker(new Range(line_num-1,0,1), "myMarker", "fullLine"); 

    });



    socket.on('likely_repair', function(data) {
      document.getElementById('faulty_line_fix').innerHTML = document.getElementById('faulty_line_fix').innerHTML +
      "suggested fix is " + data;
       // document.getElementById('suggestion_popover').setAttribute("data-content", data);
      var editor = ace.edit("editor");
      if (faulty_line_num >= 0 ) {
        editor.getSession().setAnnotations([{ row: faulty_line_num-1, text: data, type: "error" }]);   
      }
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
            var testcase_result = JSON.stringify(test_suite[curr_tc_num]);
            var testcase_name = "TC" + curr_tc_num;
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
            curr_tc_num = no_of_tc;
          } else {
            if (curr_tc_num == no_of_tc && update_fix == true) update_fix = false;
            var testcase_name = "TC" + curr_tc_num;
            make_testcase_gray(testcase_name);
            --curr_tc_num;
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
  */