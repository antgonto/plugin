package markertest.handlers;

import org.eclipse.core.commands.AbstractHandler;
import org.eclipse.core.commands.ExecutionEvent;
import org.eclipse.core.commands.ExecutionException;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.IWorkbenchWindow;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.handlers.HandlerUtil;

import client.ClientThread;
import markertest.MarkerFactory;
import search.ASTSearch;
import thread.ThreadAdapter;

import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.text.TextSelection;
import org.eclipse.swt.widgets.Display;

/**
 * Our sample handler extends AbstractHandler, an IHandler base class.
 * @see org.eclipse.core.commands.IHandler
 * @see org.eclipse.core.commands.AbstractHandler
 */
public class SendHandler extends AbstractHandler {

	@Override
	public Object execute(ExecutionEvent event) throws ExecutionException {
			ThreadAdapter adapter = new ThreadAdapter();
			String namespace=searchBySelection();
			if(!namespace.equals("FALSE")){
				adapter.sendMsg(namespace);
				try{
					ClientThread.client.post(namespace);
					}
					catch(Exception e){
						e.printStackTrace();
				}
				IWorkbenchWindow window = HandlerUtil.getActiveWorkbenchWindowChecked(event);
				MessageDialog.openInformation(
						window.getShell(),
						"Send to server",
						"Send it!");
			}
			else{
				IWorkbenchWindow window = HandlerUtil.getActiveWorkbenchWindowChecked(event);
				MessageDialog.openError(
						window.getShell(),
						"Send to server",
						"Only methods can be selected");
			}
			
			return null;

	}

	
	/**
	 * Método encargado de buscar la
	 * función seleccionada
	 * @return String: namespace de la función
	 */
	private String searchBySelection(){
		TextSelection selection = MarkerFactory.getTextSelection();
		String file = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage().getActiveEditor().getTitleToolTip();
		ASTSearch search = new ASTSearch();
		String namespace=search.searchBySelection(file, selection.getText(), selection.getOffset(), selection.getLength());
		return namespace;
	}



}
