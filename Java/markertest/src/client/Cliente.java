package client;

import java.io.*;
import java.net.*;
import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;


public class Cliente extends Thread {
    private Socket socket;
    private String server_address;
    private int port;
    private String previousText;
    private String text;
	 /**
	  * Constructor
	  * @param ip
	  * @param puerto
	 * @throws URISyntaxException 
  	  */
    public Cliente(String ip, int port) throws URISyntaxException{
    	this.server_address=ip;
    	this.port=port;
    	this.server_address+=":"+this.port;
    	this.text="";
    	this.previousText="";
    	socket = IO.socket(this.server_address);
    	//Socket socket = IO.socket("http://localhost:1617");
		socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
		  @Override
		  public void call(Object... args) {
			System.out.println("Connected.");
			}

		}).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {
			
		  @Override
		  public void call(Object... args) {
			  System.out.println("Disconected.");
		  }
		  
		});
		
		socket.connect();

    }

	public  void run(){
		/*String data;
		this.get();
		while(true){
			data=this.getData();
			//this.text="";
			if(data!=""){
				System.out.print("GETSTR: ");
	            System.out.println(data);
			}
		}*/
    }
	
	/**
	 * Se desconecta la conexión con el servidor
	 */
    public void disconnected(){
        try {
        	this.socket.close();
        }catch (Exception e){};
    }
	
    /**
     * Método post
     * Envía un string al servidor
     * @param msg
     */
    public void post(String msg){
        this.socket.emit("methodClicked", msg);
    }
    
    /**
     * 
     */
    private void get(){
    	try {
    		//this.previousText=this.text;
        	//this.socket.on("changeNode", new Emitter.Listener() {
    		this.socket.on("nodeClicked", new Emitter.Listener() {
        		String txt;
				@Override
      		  	public void call(Object... args) {
      			  txt= args[0].toString();
      			  text=txt;
      			  txt="";
      		  	}
      		});
        } catch (Exception e) { }
    }
    
    
    public String getData(){
    	String temp="";
    	if (!this.text.equals(this.previousText)&&!this.text.equals("")){
    		this.previousText=this.text;
            temp=this.text;
    		return temp;
    	}
    	else{
    		this.get();
    	}return "";
    }
    
    public String getSTR(){
       
        String data;
		//this.get();
        boolean h=true;
        while (h) {
            try {
            	data=this.getData();
            	h=false;
            	return data;
    			
            } catch (Exception e) { }

        }return "";
        
		
    }

}