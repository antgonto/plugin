package testingview.views;

import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.ui.part.*;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.ProgressBar;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Text;
import org.eclipse.swt.widgets.ToolBar;
import org.eclipse.swt.widgets.ToolItem;
import org.eclipse.swt.SWT;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.browser.LocationEvent;
import org.eclipse.swt.browser.LocationListener;
import org.eclipse.swt.browser.ProgressEvent;
import org.eclipse.swt.browser.ProgressListener;
import org.eclipse.swt.browser.StatusTextEvent;
import org.eclipse.swt.browser.StatusTextListener;


/**
 * This sample class demonstrates how to plug-in a new
 * workbench view. The view shows data obtained from the
 * model. The sample creates a dummy model on the fly,
 * but a real implementation would connect to the model
 * available either in this or another plug-in (e.g. the workspace).
 * The view is connected to the model using a content provider.
 * <p>
 * The view uses a label provider to define how model
 * objects should be presented in the view. Each
 * view can present the same model objects using
 * different labels and icons, if needed. Alternatively,
 * a single label provider can be shared between views
 * in order to ensure that objects of the same type are
 * presented in the same way everywhere.
 * <p>
 */

public class WebView extends ViewPart {

	/**
	 * The ID of the view as specified by the extension.
	 */
	public static final String ID = "testingview.views.SampleView1";


/**
	 * The constructor.
	 */
	public WebView() {
	}

	/**
	 * This is a callback that will allow us
	 * to create the viewer and initialize it.
	 */
	public void createPartControl(Composite parent) {
		
		Browser browser = new Browser(parent, SWT.NONE);
	
		browser.setText("default stuff");
	
	
	
			
			
			browser.redraw();
			browser.refresh();
			
			browser.getParent().redraw();
			browser.getParent().getShell().redraw();
		
			browser.setUrl("http://localhost:8090");
			browser.refresh();
			System.out.println("[HTMLHandler] changed browser content");
			
		
		

 /*       final Shell shell = parent.getShell();
        GridLayout gridLayout = new GridLayout();
        
        gridLayout.numColumns = 3;
        shell.setLayout(gridLayout);
        ToolBar toolbar = new ToolBar(shell, SWT.NONE);
        ToolItem itemBack = new ToolItem(toolbar, SWT.PUSH);
        itemBack.setText("Back");
        ToolItem itemForward = new ToolItem(toolbar, SWT.PUSH);
        itemForward.setText("Forward");
        ToolItem itemStop = new ToolItem(toolbar, SWT.PUSH);
        itemStop.setText("Stop");
        ToolItem itemRefresh = new ToolItem(toolbar, SWT.PUSH);
        itemRefresh.setText("Refresh");
        ToolItem itemGo = new ToolItem(toolbar, SWT.PUSH);
        itemGo.setText("Go");
 
        GridData data = new GridData();
        data.horizontalSpan = 3;
        toolbar.setLayoutData(data);
 
        Label labelAddress = new Label(shell, SWT.NONE);
        labelAddress.setText("Address");
 
        final Text location = new Text(shell, SWT.BORDER);
        data = new GridData();
        data.horizontalAlignment = GridData.FILL;
        data.horizontalSpan = 2;
        data.grabExcessHorizontalSpace = true;
        location.setLayoutData(data);
 
        final Browser browser = new Browser(shell, SWT.NONE);
        data = new GridData();
        data.horizontalAlignment = GridData.FILL;
        data.verticalAlignment = GridData.FILL;
        data.horizontalSpan = 3;
        data.grabExcessHorizontalSpace = true;
        data.grabExcessVerticalSpace = true;
        browser.setLayoutData(data);
 
        final Label status = new Label(shell, SWT.NONE);
        data = new GridData(GridData.FILL_HORIZONTAL);
        data.horizontalSpan = 2;
        status.setLayoutData(data);
 
        final ProgressBar progressBar = new ProgressBar(shell, SWT.NONE);
        data = new GridData();
        data.horizontalAlignment = GridData.END;
        progressBar.setLayoutData(data);
 
         event handling 
        Listener listener = new Listener() {
            public void handleEvent(Event event) {
                ToolItem item = (ToolItem) event.widget;
                String string = item.getText();
                if (string.equals("Back"))
                    browser.back();
                else if (string.equals("Forward"))
                    browser.forward();
                else if (string.equals("Stop"))
                    browser.stop();
                else if (string.equals("Refresh"))
                    browser.refresh();
                else if (string.equals("Go"))
                    browser.setUrl(location.getText());
            }
        };
 
        browser.addProgressListener(new ProgressListener() {
            public void changed(ProgressEvent event) {
                if (event.total == 0)
                    return;
                int ratio = event.current * 100 / event.total;
                progressBar.setSelection(ratio);
            }
 
            public void completed(ProgressEvent event) {
                progressBar.setSelection(0);
            }
        });
 
        browser.addStatusTextListener(new StatusTextListener() {
            public void changed(StatusTextEvent event) {
                status.setText(event.text);
            }
        });
 
        browser.addLocationListener(new LocationListener() {
            public void changed(LocationEvent event) {
                if (event.top) {
                    location.setText(event.location);
                }
            }
 
            public void changing(LocationEvent event) {
            }
        });
 
        itemBack.addListener(SWT.Selection, listener);
        itemForward.addListener(SWT.Selection, listener);
        itemStop.addListener(SWT.Selection, listener);
        itemRefresh.addListener(SWT.Selection, listener);
        itemGo.addListener(SWT.Selection, listener);
        location.addListener(SWT.DefaultSelection, new Listener() {
            public void handleEvent(Event e) {
                browser.setUrl(location.getText());
            }
        });
        shell.pack();
        shell.open();
        browser.setUrl("http://www.google.com.au");*/
 

	}

	
	/**
	 * Passing the focus request to the viewer's control.
	 */
	public void setFocus() {
		
	}
}
