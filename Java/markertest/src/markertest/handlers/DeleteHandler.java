package markertest.handlers;

import java.util.List;

import org.eclipse.core.commands.AbstractHandler;
import org.eclipse.core.commands.ExecutionEvent;
import org.eclipse.core.commands.ExecutionException;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.ui.IWorkbenchWindow;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.handlers.HandlerUtil;

import client.ClientThread;
import markertest.MarkerFactory;


/**
 * @version 1.0
 * @author Gerald Valverde Mc kenzie
 * Computer Engineering
 * AVIB
 * 
 */
public class DeleteHandler extends AbstractHandler {

	@Override
	public Object execute(ExecutionEvent event) throws ExecutionException {
		IWorkbenchWindow window = HandlerUtil.getActiveWorkbenchWindowChecked(event);
		MessageDialog.openWarning(
				window.getShell(),
				"Markertest",
				"Disconnected!");
		
		//ClientThread.client.disconnected();
		deleteAllMarkers();
		return null;
		
	}
	
	public void deleteAllMarkers() {
		IFile file = (IFile) PlatformUI.getWorkbench().getActiveWorkbenchWindow().
				getActivePage().getActiveEditor().getEditorInput().
						getAdapter(IFile.class);
		List<IMarker> markers = MarkerFactory.findMarkers(file);
       markers.forEach(marker->{
		System.out.println("----DELETE---");
		MarkerFactory.deleteAnnotation(marker);
		//marker.delete();
	});;
        
    }
}