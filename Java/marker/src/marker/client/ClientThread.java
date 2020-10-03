package marker.client;
import java.net.URISyntaxException;


/**
 * 
 * @author gvmck
 * Thread para correr la conexión cliente-servidor
 *
 */

public class ClientThread {
	 public static Client client;

	    public static void main(String[] args) {
	        
	    }
	    public static void initClient(){
	        try {
				client= new Client("http://localhost",1617);
				client.start();
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        
	    }
}
