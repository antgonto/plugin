package client;

import java.net.URISyntaxException;

public class ClientThread {
	 public static Cliente client;

	    public static void main(String[] args) {
	        
	    }
	    public static void initClient(){
	        try {
				client= new Cliente("http://localhost",1617);
				client.start();
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        
	    }
}
