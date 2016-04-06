package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class disable_002dcontroller_002dservice_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"disable-controller-service-dialog\">\n    <div class=\"dialog-content\">\n        <div class=\"settings-left\">\n            <div id=\"disable-controller-service-service-container\" class=\"setting\">\n                <div class=\"setting-name\">Service</div>\n                <div class=\"setting-field\">\n                    <span id=\"disable-controller-service-id\" class=\"hidden\"></span>\n                    <div id=\"disable-controller-service-name\"></div>\n                    <div id=\"disable-controller-service-bulletins\"></div>\n                    <div class=\"clear\"></div>\n                </div>\n            </div>\n            <div id=\"disable-controller-service-scope-container\" class=\"setting\">\n                <div class=\"setting-name\">Scope</div>\n                <div class=\"setting-field\">\n                    Service and referencing components\n                    <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Referencing components must be disabled/stopped in order to disable this service.\"/>\n");
      out.write("                </div>\n            </div>\n            <div id=\"disable-controller-service-progress-container\" class=\"setting hidden\">\n                <div id=\"disable-progress-label\" class=\"setting-name\"></div>\n                <div class=\"setting-field\">\n                    <ol id=\"disable-controller-service-progress\">\n                        <li>\n                            Stopping referencing processors and reporting tasks\n                            <div id=\"disable-referencing-schedulable\" class=\"disable-referencing-components\"></div>\n                            <div class=\"clear\"></div>\n                        </li>\n                        <li>\n                            Disabling referencing controller services\n                            <div id=\"disable-referencing-services\" class=\"disable-referencing-components\"></div>\n                            <div class=\"clear\"></div>\n                        </li>\n                        <li>\n                            Disabling this controller service\n                            <div id=\"disable-controller-service\" class=\"disable-referencing-components\"></div>\n");
      out.write("                            <div class=\"clear\"></div>\n                        </li>\n                    </ol>\n                </div>\n            </div>\n        </div>\n        <div class=\"spacer\">&nbsp;</div>\n        <div class=\"settings-right\">\n            <div class=\"setting\">\n                <div class=\"setting-name\">\n                    Referencing Components\n                    <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Other components referencing this controller service.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <div id=\"disable-controller-service-referencing-components\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"controller-service-canceling hidden unset\">\n        Canceling...\n    </div>\n</div>\n");
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
