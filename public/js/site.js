Array.prototype.containsId = function(v) {
	if (v == null)
		return false;
	for (var i = 0; i < this.length; i++) {
		if (this[i]._id == v)
			return true;
	}
	return false;
};
var _URL = "https://fq-api.bovendorp.org/queue/";
var _APIKEY = "testkeytoeveryone";
var user = null;
var queue = null;

var leaveImg = 'https://cdn4.iconfinder.com/data/icons/outline-style-1/512/exit-128.png';
var enterIMG = 'https://cdn4.iconfinder.com/data/icons/outline-style-1/512/enter-128.png';

// editable

function setKey(x) {
	window._APIKEY = x;
}

// End editable

function leaveQueue(queueId, userId, cb) {
	$.ajax({
		type: "delete",
		beforeSend: function(request) {
			request.setRequestHeader("API-KEY", _APIKEY);
		},
		url: _URL + queueId + '/players/' + userId,
		success: function(msg) {
			cb(null);
		},
		error: function(xhr) {
			cb(xhr)
		}
	});
}

function joinQueue(id, obj, cb) {
	$.ajax({
		type: "post",
		beforeSend: function(request) {
			request.setRequestHeader("API-KEY", _APIKEY);
			request.setRequestHeader("Content-Type", "application/JSON")
		},
		data: JSON.stringify(obj),
		url: _URL + id + '/players',
		success: function(msg) {
			cb(msg);
		}
	});
}

function getQueues(cb) {
	$.ajax({
		type: "get",
		beforeSend: function(request) {
			request.setRequestHeader("API-KEY", _APIKEY);
		},
		url: _URL,
		success: function(msg) {
			cb(msg);
		}
	});
};

function getQueue(id, cb) {
	$.ajax({
		type: "get",
		beforeSend: function(request) {
			request.setRequestHeader("API-KEY", _APIKEY);
		},
		url: _URL + id,
		success: function(msg) {
			cb(msg);
		}
	});
};

function addQueue(obj) {
	$.ajax({
		type: "post",
		beforeSend: function(request) {
			request.setRequestHeader("API-KEY", _APIKEY);
			request.setRequestHeader("Content-Type", "application/JSON")
		},
		data: JSON.stringify(obj),
		url: _URL,
		success: function(msg) {
			alert("Sala adiconada com sucesso" + JSON.stringify(" " + msg._id));
		}
	});
};

function getPlayers(id, cb) {
	$.ajax({
		type: "get",
		beforeSend: function(request) {
			request.setRequestHeader("API-KEY", _APIKEY);
		},
		url: _URL + id + '/players',
		success: function(msg) {
			$('.addedPlayers').remove();
			cb(id, msg)
		}
	});
};

function listQueue(msg) {
	$('.addedQueue').remove();
	msg.forEach(function(element) {
		if (!element.name)
			element.name = "NO-NAME";
		if (user) {
			if (element._id == user.queue._id) {
				$('#queues')
					.append($('<tr>').attr('class', "addedQueue")
						.append($('<td>')
							.attr('id', element._id)
							.click(function() {
								console.log(element._id)
								getPlayers(element._id, listPlayers);
							})
							.append($('<p>')
								.text(element.name))
							.append($('<button>')
								.append($('<img>')
									.attr('src', leaveImg)
									.attr('id', 'find'))
								.click(function() {
									leaveRoom(element._id)
								}))))
			}
		} else {
			$('#queues')
				.append($('<tr>').attr('class', "addedQueue")
					.append($('<td>')
						.attr('id', element._id)
						.click(function() {
							console.log(element._id)
							getPlayers(element._id, listPlayers);
						})
						.append($('<p>')
							.text(element.name))
						.append($('<button>')
							.append($('<img>')
								.attr('src', enterIMG)
								.attr('id', 'find'))
							.click(function() {
								enterRoom(element._id)
							}))))
		}


	}, this);
};

function enterRoom(idRoom) {
	var text = prompt("Insira um nome para voce", "");
	if (text == null || text == "") {
		return;
	}
	console.log(this);
	$('#yourQueue').attr('class', 'btn btn-info');
	$('#yourQueue').attr('text', idRoom);

	getQueue(idRoom, function(msg) {
		$('#yourQueueText').text(msg.name);
	});
	joinQueue(idRoom, { name: text }, function(msg) {
		user = msg;
		user.name = text;
		user.queue = { _id: idRoom }
		$('#youText').text(user.name);
		queue = idRoom;
	});

	getPlayers(idRoom, listPlayers);
	console.log('enter room: ' + idRoom)

	toggleEnterLeave(leaveImg, idRoom);
};

function toggleEnterLeave(img, id) {
	if (img == leaveImg) {
		$('td#' + id).find('img#find')
			.attr('src', img);
		$('td#' + id).find('img#find')
			.unbind('click')
			.click(function() {
				leaveRoom(id)
			});
	} else {
		$('td#' + id).find('img#find')
			.attr('src', img);
		$('td#' + id).find('img#find')
			.unbind('click')
			.click(function() {
				enterRoom(id)
			});
	}
}

function leaveRoom(idRoom) {
	leaveQueue(user.queue._id, user._id, function(err) {
		if (err) {
			console.log(err);
			return;
		}
		user = null;
		$('#yourQueue').attr('text', this.id);
		$('#youText').text('Sem Nome');
		$('#yourQueueText').text('Sem Sala');
	})
	console.log('leave room: ' + JSON.stringify(idRoom))
	toggleEnterLeave(enterIMG, idRoom)
	queue = null;
}

function listPlayers(roomId, players) {
		queue = roomId;
	if (players.length == 0) {
		console.log(players);
		return;
	}
	for (var i = 0; i < players.length; i++) {
		$('#players2')
			.append($('<tr>').attr('class', "addedPlayers")
				.append($('<th>')
					.append($('<span>').text(i)))
				.append($('<td>')
					.append($('<span>').text(players[i].name)))
				.append($('<td>')
					.append($('<span>').text(players[i]._id))));
	}
};

function addQueueButton() {
	var text = prompt("Insira um nome para a sala", "");
	if (text == null || text == "") {
		alert("Insira um nome para a sala");
		return;
	}
	addQueue({ name: text });
};

