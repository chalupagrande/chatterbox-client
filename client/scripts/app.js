
var app = {};
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

app.update = function(data){
	data = data.results;
	for(var i = 0; i < data.length; i++){
		var curObject = data[i];
		var $message = $('<div class = "chat"></div>');
		var escaped = app.escapeRegExp(curObject.text);
		$message.html('<span class = "username">' + curObject.username + ':</span>' + 
			'</br> <div class = "text">' + escaped + '</div>' );
		$('.feed').append($message);
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
	    window.location.reload();
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});

};// END SEND

app.fetch = function(){
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: app.server,
	  type: 'GET',
	  contentType: 'application/json',
	  data :{
	  	order : "-createdAt"
	  },
	  success: function (data) {
	  	
	  	app.update(data);
	  	//update the DOM function
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
		  roomname: "rooms"
		}
		app.send(message);
		$('#mess').val('');

	});

	$('#refresh').on('click', function(event){
	  event.preventDefault();
      window.location.reload();
	 })


});
