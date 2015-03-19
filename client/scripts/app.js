
var app = {};
app.rooms = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
// $('.refresh').on('click', function(){
// 	app.fetch();
// });
app.refresh = function(){
	$('#refresh').on('click', function(event){
		event.preventDefault();
		window.location.reload();
	})
}
app.init = function(){
	app.fetch();
	app.username = window.location.search.substr(10);
};// END INIT

app.escapeRegExp = function(string){
	if(string){
      return string.replace(/<script>.*<\/script>/g, "");
    }
}

app.filter = function(data){
    data = data.results;
    app.rooms['All'] = [];
    for(var i = 0; i < data.length; i++){
		var curObject = data[i];

		var $message = $('<div class = "chat"></div>');

		//ESCPING XSS
		var escaped = app.escapeRegExp(curObject.text);

		$message.html('<span class = "username">' + curObject.username + ':</span>' + 
		  '</br> <div class = "text">' + escaped + '</div>' );
		//Updates rooms
        if(!app.rooms.hasOwnProperty(curObject.roomname)){
        	var $option = $("<option value='" +curObject.roomname+ "'>" + curObject.roomname + "</option>")
        	$("#roomlist").append($option);
        	app.rooms[curObject.roomname] = [$message]
        	app.rooms.All.push($message);
        }
        else{
        	app.rooms[curObject.roomname].push($message);
        	app.rooms.All.push($message);
        }
    }
}

app.update = function(theRoomName){
  app.clearMessages();

  //ROOM USER WANTS
  var messageList = app.rooms[theRoomName] || app.rooms['All'];

  //repopulates dom
  for(var i = 0; i < messageList.length; i++){
	$('.feed').append(messageList[i]);
  }
}

app.send = function(message){


	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: app.server,
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	    // app.update($('#roomlist').val());
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});

};// END SEND

app.fetch = function(roomName){
	roomName || $('#roomlist').val()
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: app.server,
	  type: 'GET',
	  contentType: 'application/json',
	  data :{
	  	order : "-createdAt"
	  },
	  success: function (data) {
	  	console.log(data)
	  	app.filter(data);
	  	app.update($('#roomlist').val());
	    console.log('chatterbox: Message recieved');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});

	
};// END FETCH

app.clearMessages = function(){
	$('#chat').remove();
	$('.chat').remove();
}
app.init();


$(document).ready(function(){
	$('#messageForm').on('submit', function(event){
		event.preventDefault()
		var message = {
		  username:  app.username,
	      text: $('#mess').val(),
		  roomname: $('#roomlist').val()
		}
		app.send(message);
		app.fetch();
		$('#mess').val('');

	});

	$('#refresh').on('click', function(event){
	  event.preventDefault();
      window.location.reload();
	 })

	$('#room').on('click', function(event){
	  event.preventDefault();
      var newRoom = prompt('Name your room!');
      var $option = $("<option value='" +newRoom+ "'>" + newRoom + "</option>")
      $("#roomlist").prepend($option);
      var message = {
		  username: "System",
	      text: "Welcome to " + newRoom,
		  roomname: newRoom
		}
	  app.send(message);
	  app.fetch()




	 })
    
    $('#roomlist').change(function(){
    	app.update($('#roomlist').val());
    })



});
