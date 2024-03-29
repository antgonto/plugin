package marker.logic;


import org.eclipse.core.resources.IResource;
import org.eclipse.jface.resource.ImageDescriptor;
import org.eclipse.jface.viewers.IDecoration;
import org.eclipse.jface.viewers.ILightweightLabelDecorator;
import org.eclipse.jface.viewers.LabelProvider;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Font;


/**
 * @version 1.0
 * @author Gerald Valverde Mc kenzie
 * Computer Engineering
 * AVIB
 * 
 */
public class FileDecorator extends LabelProvider implements ILightweightLabelDecorator {
	
	public static final String ICON = "/icons/marker.png";
	private static Font font = new Font(null, "Arial", 10, 0);
	private static Color color = new Color(null, 30, 82, 150);
	
	@Override
	public void decorate(Object resource, IDecoration decoration) {
		int markers = MarkerFactory.findMarkers((IResource) resource).size();
		
		if (markers > 0) {
			decoration.addOverlay(ImageDescriptor.createFromFile(FileDecorator.class, ICON), IDecoration.TOP_RIGHT);
			decoration.addPrefix("<T> ");
			decoration.addSuffix(" " + markers + " marker(s)");
			decoration.setFont(font);
			decoration.setForegroundColor(color);
		}
		
	}
	

}
