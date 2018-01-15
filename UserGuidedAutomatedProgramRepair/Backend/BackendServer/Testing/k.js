var iterations = 1;
var lineReader = require('line-reader');
				testcase_results_with_fixes = {};
				results_data = {};
				var iteration;
				first_time = true;
				iteration_count = 1;
				toggle = 1;
				fixes = [];
				lineReader.eachLine('replace_with_variables.txt', function (line, last_line) {
					if (toggle % 2 == 0) {
						fixes.push(line);
					}
					++toggle;
				});
				lineReader.eachLine('testcase_results.txt', function(line, last_line) { 
					if (line.length == 1 && first_time) {
						iteration = iteration_count;
						first_time = false;
					} else if (line.length == 1 && !first_time) {
						results_data["fix"] = fixes[iteration-1];
						testcase_results_with_fixes[iteration] = results_data;
						results_data = {};
						iteration_count++;
						iteration = iteration_count;
					} else {
						var splitted_line = line.split(" ");
						results_data[splitted_line[0]] = splitted_line[1];
					}
					if (last_line) {
						results_data["fix"] = fixes[iteration-1];
						testcase_results_with_fixes[iteration] = results_data;
						console.log(JSON.stringify(testcase_results_with_fixes));
						
					}
				});