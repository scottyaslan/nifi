package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class remote_002dprocess_002dgroup_002dports_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"remote-process-group-ports\">\n    <div class=\"dialog-content\">\n        <span id=\"remote-process-group-ports-id\" class=\"hidden\"></span>\n        <div class=\"settings-left\">\n            <div class=\"setting\">\n                <div class=\"setting-name\">Name</div>\n                <div class=\"setting-field\">\n                    <span id=\"remote-process-group-ports-name\"></span>\n                </div>\n            </div>\n            <div class=\"remote-port-header\">\n                <div>Input ports</div>\n            </div>\n            <div id=\"remote-process-group-input-ports-container\" class=\"remote-ports-container\"></div>\n        </div>\n        <div class=\"spacer\">&nbsp;</div>\n        <div class=\"settings-right\">\n            <div class=\"setting\">\n                <div class=\"setting-name\">URL</div>\n                <div class=\"setting-field\">\n                    <span id=\"remote-process-group-ports-url\"></span>\n                </div>\n            </div>\n            <div class=\"remote-port-header\">\n                <div>Output ports</div>\n");
      out.write("            </div>\n            <div id=\"remote-process-group-output-ports-container\" class=\"remote-ports-container\"></div>\n        </div>\n    </div>\n</div>");
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
