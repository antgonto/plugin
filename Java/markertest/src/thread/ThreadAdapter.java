package thread;


import java.util.List;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.resources.WorkspaceJob;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.Status;
import org.eclipse.core.runtime.jobs.IJobChangeEvent;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.core.runtime.jobs.JobChangeAdapter;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.ui.IEditorReference;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.IWorkbenchWindow;
import org.eclipse.ui.PartInitException;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;
import org.eclipse.jface.text.Position;
import client.ClientThread;
import markertest.MarkerFactory;
import markertest.MarkerPlugin;
import search.ASTSearch;


//https://www.programcreek.com/java-api-examples/index.php?api=org.eclipse.ui.progress.UIJob
//UI Job


public class ThreadAdapter extends SelectionAdapter {
  
	private Position position = new Position(0,0);
	private String editor = "";
	
    public ThreadAdapter() {
    	
    }
    
    public void pluginRun() {
    	Job background = new Job("Background") {
            @Override
            protected IStatus run(IProgressMonitor monitor) {
            	try{
            		while(true){
            			backg();
            			Thread.sleep(100);
            		}
            	} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
                return Status.OK_STATUS;
            }

        };
        background.setUser(true);
        background.schedule();
        
        //second();
        
    }

    /**
     * Open .java file
     * @param path
     */
    public void open(String path){
    	try{
   		openEditor(new Path((String) path));
    	}
    	catch(Exception e){
    		System.out.println("ERROR-->"+e);
    	}
    }
    
    public void backg(){
    	
    	Job background = new Job("Background") {
            @Override
            
            protected IStatus run(IProgressMonitor monitor) {
            	try{
            	position=receive();
            	
            	Thread.sleep(100);
            	} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}finally {
					
		              monitor.done();
		           }
                return Status.OK_STATUS;
                
            }
        };
       
        background.addJobChangeListener(new JobChangeAdapter() {
            @Override
            public void done(IJobChangeEvent event)
            {
              // Listener does not run in UI thread so use asyncExec

              Display.getDefault().asyncExec(new Runnable()
               {
				@Override
                 public void run()
                 {
                	 if(!position.equals(new Position(0,0))){
                		 System.out.println(position);
                		 System.out.println("AAAA");
                  		 open(editor);
                  		 createMarker(position);
                  		 position=new Position(0,0); 
                	 }background.cancel();
                 }
               });
            }
          });
        background.schedule();
        

    }
    
    

    /**
     * Inicio de Cliente
     */
    public void startClient(){
    	System.out.println("CLIENT STARTED!");
    	ClientThread.initClient();
		ClientThread.client.run();
    }
    

    
    
    /**
	 * Método encargado de abrir la ventana del archivo a analizar
	 * @param path Ruta de archivo a abrir
	 * @throws CoreException
	 */
	public void openEditor(Path path){
		if (!isEditorOpen(path)) {
			IWorkbenchPage page = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
			IFile iFile = ResourcesPlugin.getWorkspace().getRoot().getFile(path);
			try {
				IDE.openEditor(page, iFile);
		
			} catch (PartInitException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}//else{};
	}
	
	/**
	 * Metodo encargado de verificar si
	 * una ventana esta abierta
	 * @param path
	 * @return
	 */
	private boolean isEditorOpen(Path path){
		for (IEditorReference editorRefrence : PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage()
				.getEditorReferences()) {
			//System.out.println("Tittle Editor: "+ editorRefrence.getTitleToolTip());
			if(editorRefrence.getTitleToolTip().equals(path.toString())){
				return true;
			}return false;
        }return false; 
		
	}

    	
   
	/**
	 * Lectura de sockets
	 * Búsqueda AST
	 * @return
	 */
    private Position receive(){
    	String input = ClientThread.client.getSTR();
    	Position pos = new Position(0,0);
		if(input!=""){
			System.out.println("RECEIVE-->"+input);
			/*ASTSearch search = new ASTSearch();
			pos= search.search(input);
			System.out.println("Position-->"+pos);			
			if(!pos.equals(new Position(0,0))){
				editor=search.getEditor(input);
				System.out.println("POS-->"+pos);	
			}*/return pos;
		}return pos;
    }

    /**
     * Metodo Marcado
     * @param pos
     */
    private void createMarker(Position pos){
		try {
			
		    IFile file = (IFile) MarkerPlugin.getEditor().getEditorInput().getAdapter(IFile.class);
		    
			IMarker mymarker;
			mymarker = MarkerFactory.createMarker(file, pos);
			MarkerFactory.addAnnotation(mymarker, pos, MarkerPlugin.getEditor());
			//mymarker.delete();
			//System.out.println("EXISTS " +mymarker.exists());
		    
		} catch (CoreException e) {
			e.printStackTrace();
		}
		
    }
    
    
    public void sendMsg(final String string) {
        Job job = new Job("Sending") {
            @Override
            protected IStatus run(IProgressMonitor monitor) {
          	doSend(string);
		    //syncWithUi();
                // use this to open a Shell in the UI thread
                return Status.OK_STATUS;
            }

        };
        job.setUser(true);
        job.schedule();
    }
    
    
    private void doSend(String string){
        // We simulate a long running operation here
        try {
        	//System.out.println("***Send: "+string);
        	ClientThread.client.post(string);
			Thread.sleep(800);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    
    System.out.println("Send something ");
}
    
    
    
 
 
    
}