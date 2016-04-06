package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class remote_002dport_002dconfiguration_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"remote-port-configuration\">\n    <div class=\"dialog-content\">\n        <div class=\"setting\">\n            <div class=\"setting-name\">Name</div>\n            <div class=\"setting-field\">\n                <span id=\"remote-port-id\" class=\"hidden\"></span>\n                <span id=\"remote-port-type\" class=\"hidden\"></span>\n                <div id=\"remote-port-name\" class=\"ellipsis\"></div>\n            </div>\n        </div>\n        <div class=\"setting\">\n            <div class=\"setting-name\">\n                Concurrent tasks\n                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The number of tasks that should be concurrently scheduled for this port.\"/>\n            </div>\n            <div class=\"setting-field\">\n                <input id=\"remote-port-concurrent-tasks\" type=\"text\"/>\n                <div id=\"remote-port-use-compression-container\">\n                    <div id=\"remote-port-use-compression\" class=\"nf-checkbox\"></div>\n                    <span>Compressed</span>\n                </div>\n");
      out.write("            </div>\n        </div>\n    </div>\n</div>\n");
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
