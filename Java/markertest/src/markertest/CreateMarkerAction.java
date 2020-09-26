package markertest;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.jface.action.IAction;
import org.eclipse.jface.text.Position;
import org.eclipse.jface.text.TextSelection;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.ui.IEditorActionDelegate;
import org.eclipse.ui.IEditorPart;

import search.ASTSearch;


/**
 * @version 1.0
 * @author Gerald Valverde Mc kenzie
 * Computer Engineering
 * AVIB
 * 
 */
public class CreateMarkerAction implements IEditorActionDelegate {

	public CreateMarkerAction() {
		super();
	}
	
	@Override
	public void setActiveEditor(IAction action, IEditorPart editor) {
	}

	/*
	 * This action creates a new marker for the given IFile 
	 */
	@Override
	public void run(IAction action) {
		try {
			
			TextSelection selection = MarkerFactory.getTextSelection();
			IFile file = (IFile) MarkerPlugin.getEditor().getEditorInput().getAdapter(IFile.class);
			IMarker mymarker = MarkerFactory.createMarker(file, new Position(selection.getOffset(), selection.getLength()));
			MarkerFactory.addAnnotation(mymarker, selection, MarkerPlugin.getEditor());
			
			
		} catch (CoreException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void create(Position pos){
		try {
			
			IFile file = (IFile) MarkerPlugin.getEditor().getEditorInput().getAdapter(IFile.class);
			IMarker mymarker = MarkerFactory.createMarker(file, pos);
			MarkerFactory.addAnnotation(mymarker, pos, MarkerPlugin.getEditor());			
			
		} catch (CoreException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}

	
	@Override
	public void selectionChanged(IAction action, ISelection selection) {
	}
	
	
	public void c(SelectionAdapter e){
		
	}

}
