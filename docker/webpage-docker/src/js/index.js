import extractor from './dataExtractor';
import {render, SOCKET, setTeam} from './graphView';
import onLoad from './log4us';
import '../css/style.css'

global.log4us = onLoad;
let inTeam= false;
let currentSearch=null;
let teamId="";
//let socket = new net.Socker();
console.log(SOCKET);

SOCKET.on('teamUpdate',function(message){
  console.log($("#search").find("input[name=search]"));
  if(message !=null){
    currentSearch = JSON.parse(message);
    $("#search").find("input[name=search]")[0].value = currentSearch.query;
    $("#search").find("select[name=metric1]")[0].value =  currentSearch.metric1;
    $("#search").find("select[name=metric2]")[0].value =  currentSearch.metric2;
    console.log(`Received from server: ${message}`);
    search(currentSearch.query, currentSearch.metric1,currentSearch.metric2);
  }
})

SOCKET.on('changeNode', function(message) {
  if(message!=null){
     $("#search").find("input[name=search]")[0].value =message;
     console.log(`Received from server: ${message}`);
     search(message, $("#search").find("select[name=metric1]").val(),$("#search").find("select[name=metric2]").val());
   }
});

export const updateSelf = (msg)=>{
  search(msg.query, msg.metric1, msg.metric2);
}


// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef  
}


$(function () {
  
  search($("#search").find("input[name=search]").val(),$("#search").find("select[name=metric1]").val(),$("#search").find("select[name=metric2]").val());
  $("#search").submit(e => {
    //api.getProject();
    let query = $("#search").find("input[name=search]").val();
    let metric1 = $("#search").find("select[name=metric1]").val();
    let metric2 = $("#search").find("select[name=metric2]").val();
    
    e.preventDefault();
    search(query,metric1,metric2);
  });
});

$("#sync").click(function(){
  SOCKET.emit('joinConnection', "team1");
  setTeam(true);
  inTeam=true;
});

$("#team").click(function(){
  SOCKET.emit('createConnection', JSON.stringify(currentSearch)); //Seands the current search
  setTeam(true);
  inTeam=true;
});

function search(query,metric1,metric2) {
  currentSearch={
    query,
    metric1,
    metric2 
  };
  console.log(query,metric1,metric2);
  extractor.createGraph(query,metric1,metric2)
    .then(result =>{
      console.log(result);
      render(result);  
    })
}
