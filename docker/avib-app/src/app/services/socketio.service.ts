import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket:any;
  constructor() {}
  
  setupSocketConnection() {
  	if(this.socket===undefined){
    	this.socket = io(environment.SOCKET_ENDPOINT);
  	}
    console.log("Socket",this.socket);
  }

  sendMessage(channel:string,message:string){  
    this.socket.emit(channel,message);
  }
}
