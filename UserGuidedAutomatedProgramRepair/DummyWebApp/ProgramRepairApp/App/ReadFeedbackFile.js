var fs = require('fs');

fs.readFile('feedback.json', function(err, data) {
	if (err) {

	} else {
		console.log(JSON.parse(data));
	}
});