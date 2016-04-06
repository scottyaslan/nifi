package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class connection_002dconfiguration_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List<String> _jspx_dependants;

  private org.glassfish.jsp.api.ResourceInjector _jspx_resourceInjector;

  public java.util.List<String> getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;

    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, false, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      out = pageContext.getOut();
      _jspx_out = out;
      _jspx_resourceInjector = (org.glassfish.jsp.api.ResourceInjector) application.getAttribute("com.sun.appserv.jsp.resource.injector");

      out.write("\n\n<div id=\"connection-configuration\">\n    <div class=\"connection-configuration-tab-container\">\n        <div id=\"connection-configuration-tabs\"></div>\n        <div id=\"connection-configuration-tabs-content\">\n            <div id=\"connection-settings-tab-content\" class=\"configuration-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Name</div>\n                        <div class=\"setting-field\">\n                            <input type=\"text\" id=\"connection-name\" name=\"connection-name\" class=\"setting-input\"/>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Id</div>\n                        <div class=\"setting-field\">\n                            <span type=\"text\" id=\"connection-id\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n");
      out.write("                            FlowFile expiration\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum amount of time an object may be in the flow before it will be automatically aged out of the flow.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <input type=\"text\" id=\"flow-file-expiration\" name=\"flow-file-expiration\" class=\"setting-input\"/>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Back pressure object threshold\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum number of objects that can be queued before back pressure is applied.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <input type=\"text\" id=\"back-pressure-object-threshold\" name=\"back-pressure-object-threshold\" class=\"setting-input\"/>\n");
      out.write("                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Back pressure data size threshold\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum data size of objects that can be queued before back pressure is applied.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <input type=\"text\" id=\"back-pressure-data-size-threshold\" name=\"back-pressure-data-size-threshold\" class=\"setting-input\"/>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Available prioritizers\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Available prioritizers that could reprioritize FlowFiles in this work queue.\"/>\n");
      out.write("                        </div>\n                        <div class=\"setting-field\">\n                            <ul id=\"prioritizer-available\"></ul>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Selected prioritizers\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Prioritizers that have been selected to reprioritize FlowFiles in this work queue.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <ul id=\"prioritizer-selected\"></ul>\n                        </div>\n                    </div>\n                </div>\n                <input type=\"hidden\" id=\"connection-uri\" name=\"connection-uri\"/>\n                <input type=\"hidden\" id=\"connection-source-component-id\" name=\"connection-source-component-id\"/>\n                <input type=\"hidden\" id=\"connection-source-id\" name=\"connection-source-id\"/>\n");
      out.write("                <input type=\"hidden\" id=\"connection-source-group-id\" name=\"connection-source-group-id\"/>\n                <input type=\"hidden\" id=\"connection-destination-component-id\" name=\"connection-destination-component-id\"/>\n                <input type=\"hidden\" id=\"connection-destination-id\" name=\"connection-destination-id\"/>\n                <input type=\"hidden\" id=\"connection-destination-group-id\" name=\"connection-destination-group-id\"/>\n            </div>\n            <div id=\"connection-details-tab-content\" class=\"configuration-tab\">\n                <div class=\"settings-left\">\n                    <div id=\"read-only-output-port-source\" class=\"setting hidden\">\n                        <div class=\"setting-name\">From output</div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"read-only-output-port-name\"></div>\n                        </div>\n                    </div>\n                    <div id=\"output-port-source\" class=\"setting hidden\">\n                        <div class=\"setting-name\">From output</div>\n");
      out.write("                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"output-port-options\"></div>\n                        </div>\n                    </div>\n                    <div id=\"input-port-source\" class=\"setting hidden\">\n                        <div class=\"setting-name\">From input</div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"input-port-source-name\" class=\"label\"></div>\n                        </div>\n                    </div>\n                    <div id=\"funnel-source\" class=\"setting hidden\">\n                        <div class=\"setting-name\">From funnel</div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"funnel-source-name\" class=\"label\">funnel</div>\n                        </div>\n                    </div>\n                    <div id=\"processor-source\" class=\"setting hidden\">\n                        <div class=\"setting-name\">From processor</div>\n");
      out.write("                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"processor-source-details\">\n                                <div id=\"processor-source-name\" class=\"label\"></div>\n                                <div id=\"processor-source-type\"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div id=\"connection-source-group\" class=\"setting\">\n                        <div class=\"setting-name\">Within group</div>\n                        <div class=\"setting-field\">\n                            <div id=\"connection-source-group-name\"></div>\n                        </div>\n                    </div>\n                    <div id=\"relationship-names-container\" class=\"hidden\">\n                        <div class=\"setting-name\">For relationships</div>\n                        <div class=\"setting-field\">\n                            <div id=\"relationship-names\"></div>\n                        </div>\n                    </div>\n");
      out.write("                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div id=\"input-port-destination\" class=\"setting hidden\">\n                        <div class=\"setting-name\">To input</div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"input-port-options\"></div>\n                        </div>\n                    </div>\n                    <div id=\"output-port-destination\" class=\"setting hidden\">\n                        <div class=\"setting-name\">To output</div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"output-port-destination-name\" class=\"label\"></div>\n                        </div>\n                    </div>\n                    <div id=\"funnel-destination\" class=\"setting hidden\">\n                        <div class=\"setting-name\">To funnel</div>\n                        <div class=\"setting-field connection-terminal-label\">\n");
      out.write("                            <div id=\"funnel-source-name\" class=\"label\">funnel</div>\n                        </div>\n                    </div>\n                    <div id=\"processor-destination\" class=\"setting hidden\">\n                        <div class=\"setting-name\">To processor</div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"processor-destination-details\">\n                                <div id=\"processor-destination-name\" class=\"label\"></div>\n                                <div id=\"processor-destination-type\"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div id=\"connection-destination-group\" class=\"setting\">\n                        <div class=\"setting-name\">Within group</div>\n                        <div class=\"setting-field\">\n                            <div id=\"connection-destination-group-name\"></div>\n                        </div>\n                    </div>\n");
      out.write("                </div>\n            </div>\n        </div>\n    </div>    \n</div>");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
