package marker.search;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IWorkspace;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.jdt.core.ICompilationUnit;
import org.eclipse.jdt.core.IPackageFragment;
import org.eclipse.jdt.core.IPackageFragmentRoot;
import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.dom.AST;
import org.eclipse.jdt.core.dom.ASTParser;
import org.eclipse.jdt.core.dom.ASTVisitor;
import org.eclipse.jdt.core.dom.CompilationUnit;
import org.eclipse.jdt.core.dom.MethodDeclaration;
import org.eclipse.jdt.core.dom.SimpleName;
import org.eclipse.jface.text.Position;
import org.eclipse.ui.IEditorReference;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.PartInitException;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;

/**
 * @version 1.0
 * @author Gerald Valverde Mc kenzie
 * Computer Engineering
 * AVIB
 *
 */
public class ASTSearch {
	private static int line = -1;
	private static Position pos = new Position(0,0);
	
	
	/**
	 * Metodo encargado de parsear la ruta
	 * del proyecto y eliminarle su ultimo dato
	 * @param path
	 * @return String de la ruta del proyecto
	 */
	private String toNamespace(String path){	
		
		String namespace="";
        String[] aux = path.split("\\.")[0].split("/");
        for (int i = 3; i < aux.length; i++) {
        	namespace+=aux[i];
        	namespace+=".";
        }
		return namespace;
	}
	
	/**
	 * 
	 * @param parameters
	 * @return
	 */
	private String toParam(String parameters){	
		String result="";
		String[] param = parameters.substring(1, parameters.length()-1).split(",");
    	for(int i=0; i<param.length;i++){
    		String x = param[0];
    		for(String j : x.split(" ")){
    			if(!j.equals("")){
    				result+=j;
    				if(i!=param.length-1){
    					result+=",";
    				}
    				break;
    			}
    		}
    	}return result;
	}

	
	/**
	 * Metodo interfaz de los datos provenientes del Server 
	 * y la búsqueda por AST
	 * @param namespace
	 * @return Array [path,methodName,parameters]
	 */
	private String[] splitNamespace(String namespace){
		String[] result=new String[3];
		String[] aux = namespace.split("\\.");
		String x ="";
        for (int i = 0; i < aux.length-1; i++) {
        	x+=aux[i];
        	x+=".";
        }
        result[0]=x;
        String method_aux=aux[aux.length-1];
		String method="";
		int i;
		String param="";
		for( i=0;i<method_aux.length();i++){
			if(method_aux.charAt(i)=='('){
				break;
			}else{
				method+=method_aux.charAt(i);
			}
		}
		result[1]=method;
		
		for(int f=i+1;f<method_aux.length()-3;f++){//REVISAR EL LENGTH
			param+=method_aux.charAt(f);
		}
		result[2]=param;
		return result;
	}

	/**
	 * Método publico encargado de buscar los metodos
	 * por medio de su posicion, nombre y ruta
	 * @param path
	 * @param name
	 * @param offset
	 * @param length
	 * @return namespace de la función
	 */
	public String searchBySelection(String path, String name, int offset, int length){
		return searchBySelection_aux(path,name,offset,length);
	
	}
	
	/**
	 * 
	 * @param namespace
	 * @return
	 */
	public Position search(String namespace){
		pos=new Position(0,0);
		return search_aux(namespace);
	}
	
	
	/**
	 * Método privado encargado de buscar los metodos
	 * asociados a los parametros de esta funcion
	 * @param namespace
	 * @param name
	 * @param Position: Posición del método
	 * @param params
	 **/
	private Position search_aux(String namespace){
		String[] nspace= this.splitNamespace(namespace);
		IWorkspace workspace = ResourcesPlugin.getWorkspace();
        IWorkspaceRoot root = workspace.getRoot();
        IProject[] projects = root.getProjects();
        for (IProject project : projects) {
        	try {
        		if (project.isNatureEnabled("org.eclipse.jdt.core.javanature")) {
                	IPackageFragment[] packages = JavaCore.create(project).getPackageFragments();
                    for (IPackageFragment mypackage : packages) { //Recorrer cada paquete
                    	if (mypackage.getKind() == IPackageFragmentRoot.K_SOURCE) {
                    		for (ICompilationUnit unit : mypackage.getCompilationUnits()) {// Crea el AST para ICompilationUnits
                    			final CompilationUnit parse = parse(unit);
                    			String path = "";
                    			path+=this.toNamespace(unit.getPath().toString());
                    			
                                if(nspace[0].matches(path)){//Convalidar que el namespace coincida
                                	parse.accept(new ASTVisitor() {
	                                public boolean visit(MethodDeclaration node) {
	                                	SimpleName methodName = node.getName();
	                                	if(nspace[1].matches(methodName.getIdentifier())){//Validar que el combre del metodo coincide
	                                		//System.out.println("PATH---->"+toParam(node.parameters().toString()));
	                            			//System.out.println("Nspace---->"+nspace[2]);
	                                		if(nspace[2].matches(toParam(node.parameters().toString()))){
	                                			//System.out.println("PATH---->"+toParam(node.parameters().toString()));
		                            			//System.out.println("Nspace---->"+nspace[2]);
		                                		pos = new Position(methodName.getStartPosition(),methodName.getLength()); 
		                                   		return true;//Finaliza la busqueda
	                                		}
	                                		
	                                	}return true; // do not continue
	                                	}
	                                });
                                	/*if (!pos.equals(new Position(0,0))){
                                		this.openEditor(editor);
                                	}*/
                                	}//If Namespace
                                
                                }
                    		}
                    	}
                    }
        		} catch (CoreException e) {
        			e.printStackTrace();
                }
        	}
        return pos;
        }
	
	/**
	 * Método para obtener la ruta de
	 * @param namespace
	 * @return
	 */
	public String getEditor(String namespace){
		return getEditor_aux(namespace);
	}
	

	/**
	 * Método publico encargado de buscar los metodos
	 * por medio de su posicion, nombre y ruta
	 * @param path
	 * @param name
	 * @param offset
	 * @param length
	 * @return namespace de la función
	 */
	private String searchBySelection_aux(String p, String name, int offset, int length){
		IWorkspace workspace = ResourcesPlugin.getWorkspace();
        IWorkspaceRoot root = workspace.getRoot();
        IProject[] projects = root.getProjects();
        final String nameM= name;
        String path="/";
        path+=p;
        //String namespace="";
        Boolean[] match = {false};
        String[] namespace=new String[3];
        for (IProject project : projects) {
        	try {
        		if (project.isNatureEnabled("org.eclipse.jdt.core.javanature")) {
                	IPackageFragment[] packages = JavaCore.create(project).getPackageFragments();
                    for (IPackageFragment mypackage : packages) { //Recorrer cada paquete
                    	if (mypackage.getKind() == IPackageFragmentRoot.K_SOURCE) {
                    		for (ICompilationUnit unit : mypackage.getCompilationUnits()) {// Crea el AST para ICompilationUnits
                    			final CompilationUnit parse = parse(unit);
                    			String route= unit.getPath().toString();
                                if(route.matches(path)){//Convalidar que el namespace coincida
                                	namespace[0]=route;
                                	parse.accept(new ASTVisitor() {
	                                public boolean visit(MethodDeclaration node) {
	                                	SimpleName methodName = node.getName();
	                                	if(nameM.matches(methodName.getIdentifier())){//Validar que el combre del metodo coincida
	                                		namespace[1]=nameM;
	                                		if(methodName.getStartPosition()==offset){
	                                			if(methodName.getLength()==length){
	                                				namespace[2]=node.parameters().toString();
	                                				match[0]=true;
	                                			}
	                                		}
	                                		return true;//Finaliza la busqueda
	                                	}return true; // do not continue
	                                	}
	                                });
                                	}//If Namespace
                                }
                    		}
                    	}
                    }
        		} catch (CoreException e) {
        			e.printStackTrace();
                }
        	}
        if(match[0]){
        	String result="";
        	String[] aux = namespace[0].split("\\.")[0].split("/");
        	for (int i = 3; i < aux.length; i++) {
        		result+=aux[i];
        		result+=".";
        	}
        	result+=namespace[1];
        	result+="(";
        	String[] param = namespace[2].substring(1, namespace[2].length()-1).split(",");
        	//String[] param = h.split(",");
        	for(int i=0; i<param.length;i++){
        		String x = param[0];
        		for(String j : x.split(" ")){
        			if(!j.equals("")){
        				result+=j;
        				if(i!=param.length-1){
        					result+=",";
        				}
        				break;
        			}
        		}
        	}result+=")";
        	return result;
        }
        return "FALSE";
        }
	
	/**
	 * Método encargado de abrir la ventana del archivo a analizar
	 * @param path Ruta de archivo a abrir
	 * @throws CoreException
	 */
	public void openEditor(IPath path){
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
	
	public String[] parseNamespace(String namespace){
		return parseNamespace_aux(namespace);
	}
	/**
	 * 
	 * @param namespace
	 * @return String Array
	 * parse[0]=Logic/Test (Packages)
	 * parse[1]=add (Method)
	 * parse[2]=int,float (Parameters)
	 */
	private String[] parseNamespace_aux(String namespace){
		
		String[] parse= new String[3];
		String[] aux=namespace.split("\\.");
		String packages="";
		for(int i=0;i<aux.length-1;i++){
			packages+=aux[i];
			if(i<aux.length-2){
				packages+="/";
			}else{
				packages+=".java";
			}
		}parse[0]=packages;
		//System.out.println("PACK"+packages);
		String method_aux=aux[aux.length-1];
		String method="";
		int i;
		String param="";
		for( i=0;i<method_aux.length();i++){
			if(method_aux.charAt(i)=='('){
				break;
			}else{
				method+=method_aux.charAt(i);
			}
		}
		
		for(int f=i+1;f<method_aux.length()-1;f++){
			param+=method_aux.charAt(f);
		}
		parse[1]=method;
		parse[2]=param;
		return parse;
		
		
	}
	
	
	
	/**
	 * Método privado encargado de buscar los metodos
	 * asociados a los parametros de esta funcion
	 * @param namespace
	 * @param name
	 * @param Position: Ruta del archivo del método
	 * @param params
	 **/
	private String getEditor_aux(String namespace){
		String[] nspace= this.splitNamespace(namespace);
		IWorkspace workspace = ResourcesPlugin.getWorkspace();
        IWorkspaceRoot root = workspace.getRoot();
        IProject[] projects = root.getProjects();
        String editor="";
        for (IProject project : projects) {
        	try {
        		if (project.isNatureEnabled("org.eclipse.jdt.core.javanature")) {
                	IPackageFragment[] packages = JavaCore.create(project).getPackageFragments();
                    for (IPackageFragment mypackage : packages) { //Recorrer cada paquete
                    	if (mypackage.getKind() == IPackageFragmentRoot.K_SOURCE) {
                    		for (ICompilationUnit unit : mypackage.getCompilationUnits()) {// Crea el AST para ICompilationUnits
                    			final CompilationUnit parse = parse(unit);
                    			String path = "";
                    			path+=this.toNamespace(unit.getPath().toString());
                    			editor=unit.getPath().toString().substring(1);//Elimina el primer /
                                if(nspace[0].matches(path)){//Convalidar que el namespace coincida
                                	parse.accept(new ASTVisitor() {
	                                public boolean visit(MethodDeclaration node) {
	                                	SimpleName methodName = node.getName();
	                                	if(nspace[1].matches(methodName.getIdentifier())){//Validar que el combre del metodo coincide
	                                		if(nspace[2].matches(toParam(node.parameters().toString()))){
		                                		pos = new Position(methodName.getStartPosition(),methodName.getLength()); 
		                                   		return true;//Finaliza la busqueda
	                                		}
	                                		
	                                	}return true; // do not continue
	                                	}
	                                });
                                	if (!pos.equals(new Position(0,0))){
                                		return editor;
                                	}editor="false";
                                	}//If Namespace
                                
                                }
                    		}
                    	}
                    }
        		} catch (CoreException e) {
        			e.printStackTrace();
                }
        	}
        return editor;
        }
	
	
	/**
	 * Metodo encargado de verificar si
	 * una ventana esta abierta
	 * @param path
	 * @return
	 */
	private boolean isEditorOpen(IPath path){
		
		for (IEditorReference editorRefrence : PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage()
				.getEditorReferences()) {
			if(editorRefrence.getTitleToolTip().equals(path.toString())){
				return true;
			}
        }return false;        
		
	}
	
	private  CompilationUnit parse(ICompilationUnit unit) {
            @SuppressWarnings("deprecation")
			ASTParser parser = ASTParser.newParser(AST.JLS3);
            parser.setKind(ASTParser.K_COMPILATION_UNIT);
            parser.setSource(unit);
            parser.setResolveBindings(true);
            return (CompilationUnit) parser.createAST(null); // parse
    }

}