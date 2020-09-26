package markertest.handlers;

import java.net.URISyntaxException;

import org.eclipse.core.commands.AbstractHandler;
import org.eclipse.core.commands.ExecutionEvent;
import org.eclipse.core.commands.ExecutionException;
import org.eclipse.ui.IWorkbenchWindow;
import org.eclipse.ui.handlers.HandlerUtil;

import client.ClientThread;
import client.Cliente;
import thread.ThreadAdapter;

import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.widgets.Display;

/**
 * Our sample handler extends AbstractHandler, an IHandler base class.
 * @see org.eclipse.core.commands.IHandler
 * @see org.eclipse.core.commands.AbstractHandler
 */


/**
 * @version 1.0
 * @author Gerald Valverde Mc kenzie
 * Computer Engineering
 * AVIB
 * 
 */
public class ConnectHandler extends AbstractHandler {
	@Override
	public Object execute(ExecutionEvent event) throws ExecutionException {
		IWorkbenchWindow window = HandlerUtil.getActiveWorkbenchWindowChecked(event);
		MessageDialog.openInformation(
				window.getShell(),
				"Markertest",
				"Connected!");
		//Subproceso 
		ThreadAdapter thread = new ThreadAdapter();
		//Inicializa conexión con el servidor de NodeJS
		//Comienza a escuchar el puerto
		thread.startClient();
		//Hilo de cambios en la GUI (Marcado, colocación de iconos)
		thread.pluginRun();
		return null;
		
	}
}
