
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('express-error-handler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */
var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').renderFile);
// all environments
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */
/** app init & config... */

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

/*app.get('/api/posts', api.posts);

app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);*/

/* ... */
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


// handling client requests
// =============================================================
var fs = require('fs');
//var server = require('http').Server(app);
var io = require('socket.io')(server);
var jsonfile = require('jsonfile');
//server.listen(8000); // LOOK UPPP I'M PRESENT

var directory_path = "/home/aynoor/Documents/SProj/App/UI/ProgramRepairApp/Files/ClientFiles/";
var uploaded_source_code_files_path = "/home/aynoor/Documents/SProj/App/UI/ProgramRepairApp/Files/SourceCodeFiles/";
var uploaded_test_case_files_path = "/home/aynoor/Documents/SProj/App/UI/ProgramRepairApp/Files/TestCasesFiles/";

var clients = [];
var no_of_clients = 0;
var backend_socket;
var request_client_socket;
var mkdirp = require('mkdirp');

/*function make_new_directory(_path) {
  mkdirp(_path, function (error) {
    if (error) {
      console.log("The directory " + _path + " could not be made due to the following error: \n" ); 
      console.log(error);
    }
  });
}*/

function add_client (socket) {
  ++no_of_clients;
  client_map = {};
  client_map['socket'] = socket;
  client_map['client_id'] = no_of_clients;                          // needed to get directory name and perhaps it might be useful in future
  client_map['dir_path'] = directory_path + no_of_clients + "/";
  //make_new_directory(client_map['dir_path']);
  client_map['source_code_path'] = client_map['dir_path'] + "SourceCodeFiles/";
  //make_new_directory(client_map['source_code_path']);
  client_map['testcase_path'] = client_map['dir_path'] + "TestCasesFiles/";
  //make_new_directory(client_map['testcase_path']);
  clients.push(client_map);
}

function find_client_by_id(socket) {
  var id_of_client = -1;
  clients.forEach( function loop (client, index) {
    if (loop.stop) return;
    if (client.socket == socket) {
      id_of_client = client.client_id;
      loop.stop = true;
    }
  });
  return id_of_client;
}


var client_not_found = "Client not found.";

function find_client_file_path (socket, source_or_testcase) {
  var path_found = false;
  var _path = "";
  clients.forEach( function loop(client, index) {
    if (loop.stop) return;
    if (client.socket == socket) {
      if (source_or_testcase == "source") {         // make sure it's source in the code below too
        _path = client.source_code_path; 
        path_found = true; 
        loop.stop = true;
      } else if (source_or_testcase == "testcase") {
        _path = client.testcase_path;
        path_found = true; 
        loop.stop = true;
      }                   
    }
  });
  if (path_found) return _path;
  else return "Client not found." // I CHANGED THIS "Path for client not found.";                                                            
}

// Write a new feedback.txt file when server reopens or keep the original file?
/*fs.readFile('feedback.json', function (error, data) {
  if (error) {
    fs.writeFile("feedback.json", "", function(error) {
      if (error)  console.log('Feedback file could not be made, error: ' + error);
      else  console.log('Feedback file made.')
    });
  }
});*/


io.sockets.on('connection', function (socket) {
    add_client(socket);
    //console.log('A user connected, ' + 'Id of client connected: ' + no_of_clients);
    socket.on('disconnect', function () {
      console.log('User disconnected'); 
    });

    /*socket.on('upload_source_code_file_to_server', function (file, file_name) {
        console.log('Source code file received: ' + file_name);
        var _path = find_client_file_path(socket, "source"); 
        if (_path != client_not_found) {          // no need to check for null
          fs.writeFile(_path + file_name, file, function(error) {
            if (error)  console.log('Source code file could not be saved, error: ' + error);
            else  {
              console.log('Source code file saved.');
              if (backend_socket.connected) {
                id_client = find_client_by_id(socket);
                console.log("Send client " + id_client+ " source code file to server backend.");
                if (id_client > 0)  backend_socket.emit("source_code_file", file, file_name, id_client);
              }
            }
          });
        } else {
          console.log("Client no longer connected.");
        }                  
    });

    socket.on('upload_test_case_file_to_server', function (file, file_name) {
        console.log('Test case file received: ' + file_name);
        var _path = find_client_file_path(socket, "testcase"); 
        if (_path != client_not_found) {
          fs.writeFile(_path + file_name, file, function(error) {
            if (error)  console.log('Test case file could not be saved, error: ' + error);
            else  {
              console.log('Test case file saved.');
              if (backend_socket.connected) {
                id_client = find_client_by_id(socket);
                console.log("Send client " + id_client+ " testcase file to server backend.");
                if (id_client > 0)  backend_socket.emit("testcase_file", file, file_name, id_client);
              }
            }
          });
        } else {
          console.log("Client no longer connected.");
        }  
    });

    socket.on('send_feedback_to_server', function (_name, _email, _comment) {
      var _feedback = {name: _name, email: _email, comment: _comment};
      var old_file = [];
      var old_file_opened = false;
      fs.readFile('feedback.json', function (err, data) {
        if (!err) {
          if (data != "") {
            console.log("data: " + data);
            old_file = JSON.parse(data);
          }
          old_file.push(_feedback);
          jsonfile.writeFile('feedback.json', old_file, function (error) {
            if (error)  console.log('Feedback file could not be saved, error: ' + error);
            else  console.log('Feedback file saved.');
          });
        } else {
          console.log("Error reading file: " + err);
        }
      });
    });

    socket.on('server_llvm', function (msg) {
      console.log("Message from backend: " + msg);
      backend_socket = socket;
    });

    var heartbeats = require('heartbeats');
    var heart = heartbeats.createHeart('1000');

    heart.createEvent(3, function (heartbeat, last) {
      backend_socket.emit('alive');
    });

    socket.on('run', function () {
      if (backend_socket.connected) {
        clients.forEach(function (client, index) {
          //console.log(client.socket.id + " ============== " + socket.id);
          if (socket == client.socket) {
            request_client_socket = client.socket;
            id_client = find_client_by_id(socket);
            if (id_client > 0) backend_socket.emit('send_data', id_client);
          }
        });
      } else {
        console.log("Connection with backend server lost.");
      }
    });

    socket.on('faulty_line_num', function (faulty_line_num) {
      console.log(faulty_line_num);
      //console.log(request_client_socket.id);
      request_client_socket.emit('faulty_line_number', faulty_line_num);
    });

    socket.on('suggested_fix', function (suggested_repair) {
      console.log("suggested fix: " +suggested_repair);
      //console.log(request_client_socket.id);
      request_client_socket.emit('likely_repair', suggested_repair)
    });

    socket.on('tc_results_with_fixes', function (TC_results_with_fixes) {
      console.log(TC_results_with_fixes);
      //console.log(request_client_socket.id);
      request_client_socket.emit('testcase_results_with_fixes', TC_results_with_fixes);
    });*/
});




