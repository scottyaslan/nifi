package org.apache.nifi.web.jsp.WEB_002dINF.partials;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class connection_002ddetails_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"connection-details\">\n    <div class=\"connection-details-tab-container\">\n        <div id=\"connection-details-tabs\"></div>\n        <div id=\"connection-details-tabs-content\">\n            <div id=\"read-only-connection-details-tab-content\" class=\"configuration-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div id=\"read-only-connection-source-label\" class=\"setting-name\"></div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"read-only-connection-source\"></div>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Within group</div>\n                        <div class=\"setting-field\">\n                            <div id=\"read-only-connection-source-group-name\"></div>\n                        </div>\n                    </div>\n                    <div id=\"read-only-relationship-names-container\" class=\"setting\">\n");
      out.write("                        <div class=\"setting-name\">\n                            Relationships\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Selected relationships are in bold.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <div id=\"read-only-relationship-names\"></div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div id=\"read-only-connection-target-label\" class=\"setting-name\"></div>\n                        <div class=\"setting-field connection-terminal-label\">\n                            <div id=\"read-only-connection-target\"></div>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Within group</div>\n");
      out.write("                        <div class=\"setting-field\">\n                            <div id=\"read-only-connection-target-group-name\"></div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div id=\"read-only-connection-settings-tab-content\" class=\"configuration-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Name</div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-connection-name\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Id</div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-connection-id\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n");
      out.write("                            FlowFile expiration\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum amount of time an object may be in the flow before it will be automatically aged out of the flow.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-flow-file-expiration\"></span>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Back pressure object threshold\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum number of objects that can be queued before back pressure is applied.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-back-pressure-object-threshold\"></span>\n");
      out.write("                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Back pressure data size threshold\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum data size of objects that can be queued before back pressure is applied.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-back-pressure-data-size-threshold\"></span>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Prioritizers\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Prioritizers that have been selected to reprioritize FlowFiles in this processors work queue.\"/>\n");
      out.write("                        </div>\n                        <div class=\"setting-field\">\n                            <div id=\"read-only-prioritizers\"></div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
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
