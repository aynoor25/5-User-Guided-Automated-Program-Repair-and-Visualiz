
    var testcases_uploaded = [];
    var no_of_test_cases = 5;
    var testcase_name_start = "TC";
    for (var testcase_id = 1; testcase_id <= no_of_test_cases; ++testcase_id ) {
      add_testcase_element(testcase_name_start.concat(testcase_id));
    }

    document.getElementById('detailed_info').innerHTML = 
    "Fix: 1 \n" + 
    "TC1 => F, TC2 => F, TC3 => F, TC4 => F, TC5 => F, fix => 'temp' \n" +  
    "Fix: 2 \n" + 
    "TC1 => F, TC2 => P, TC3 => P, TC4 => F, TC5 => F, fix => 'a.addr' \n" +
    "Fix: 3 \n" + 
    "TC1 => P, TC2 => P, TC3 => P, TC4 => P, TC5 => P, fix => 'b.addr' \n";


    var start_demo = false;

    function run() {
      start_demo = true;
    }


    var faulty_line_num = 9;    
    var testcase_results_and_fixes = '{"1":{"1":"F","2":"F","3":"F","4":"F","5":"F","fix":"temp"},"2":{"1":"F","2":"P","3":"P","4":"F","5":"F","fix":"a.addr"},"3":{"1":"P","2":"P","3":"P","4":"P","5":"P","fix":"b.addr"}}';
    var editor = ace.edit("editor");
   


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
            if (testcase_result == JSON.stringify("P")) {document.getElementById(testcase_name).style.backgroundColor = 'green';}
            else if (testcase_result == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'blue';
          }
        }
      }
    }

    document.getElementById('faulty_line_fix').innerHTML = "Faulty line number is 4, suggested fix is Replace the value of variable at line number 4 with b.";

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
                  else if (testcase_result == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'blue';
                }
              });
            });
            curr_tc_num = no_of_test_cases;
          } else {
            if (curr_tc_num == no_of_test_cases && update_fix == true) update_fix = false;
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
                      else if (JSON.stringify(testcase_result) == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'blue';
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
                        testcase_count = no_of_test_cases; 
                        if (tc_count != Object.keys(node).length) {
                          if (JSON.stringify(testcase_result) == JSON.stringify("P")) document.getElementById(testcase_name).style.backgroundColor = 'green';
                          else if (JSON.stringify(testcase_result) == JSON.stringify("F")) document.getElementById(testcase_name).style.backgroundColor = 'blue';
                        }
                      } else {
                        if (testcase_count == tc_count) {
                          if (testcase_count == no_of_test_cases && update_text == true) update_text = false;
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
  