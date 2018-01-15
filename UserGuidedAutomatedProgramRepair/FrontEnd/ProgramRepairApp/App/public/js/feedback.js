var socket = io('0.0.0.0:8000');
socket.on('connect', function() { console.log('Connected to server'); });
socket.on('disconnect', function() { console.log('Disconnected from server'); });
function send_feedback() {
  var all_fields_filled = true;
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var comment = document.getElementById('comments').value;
  if (name == "") {alert("Please enter your name."); all_fields_filled = false;}
  if (email == "") {alert("Please enter your email ID."); all_fields_filled = false;}
  if (comment == "") {alert("Please enter a comment."); all_fields_filled = false;}
  if (all_fields_filled) {
   socket.emit('send_feedback_to_server', name, email, comment);
   document.getElementById('email').value = ""; 
   document.getElementById('name').value = "";
   document.getElementById('comments').value  = "";
  } 
}