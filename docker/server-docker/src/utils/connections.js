let uuidv4 = require('uuid/v4');

let expose = {
  createConnection : null,
  connectToConnection : null,
  updateTeam: null,
  error : null
};

let connections = [];

expose.createConnection = (userId,msg) =>{
	//let connectionId = uuidv4();
	let connectionId = "team1";
	let temp = {
		id: connectionId,
		currentSearch: msg,
		users:[
			userId
		]
	}
	connections.push(temp);
	console.log("Create succesful",connectionId)
	return connectionId;
}

expose.updateTeam= (msg)=>{
	for (let i = 0; i < connections.length; i++) {
		if(connections[i].id=="team1"){
			connections[i].currentSearch = msg;
			console.log("Update currentsearch: ",connections[i].currentSearch);
		}
	}
}

expose.connectToConnection = (connectionId, userId) =>{
	let to_return= {
		success:null,
		currentSearch:null
	}
	for (let i = 0; i < connections.length; i++) {
		if(connections[i].id == connectionId){
			if(!connections[i].users.includes(userId)){
				connections[i].users.push(userId);
				console.log("Join succesful", connections[i].currentSearch );
				to_return.success=true;
				to_return.currentSearch=connections[i].currentSearch;
				return to_return;
			}
		}
	}
	to_return.success=false;
	return to_return;
}

module.exports = expose;