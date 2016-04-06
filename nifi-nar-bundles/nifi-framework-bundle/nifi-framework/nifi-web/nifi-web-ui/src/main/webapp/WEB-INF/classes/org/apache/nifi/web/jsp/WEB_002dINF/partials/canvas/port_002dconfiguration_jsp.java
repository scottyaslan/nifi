package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class port_002dconfiguration_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"port-configuration\">\n    <div class=\"dialog-content\">\n        <div class=\"port-setting\">\n            <div class=\"setting-name\">Port name</div>\n            <div class=\"setting-field\">\n                <input type=\"text\" id=\"port-name\"/>\n                <div class=\"port-enabled-container\">\n                    <div id=\"port-enabled\" class=\"port-enabled nf-checkbox checkbox-unchecked\"></div>\n                    <span> Enabled</span>\n                </div>\n            </div>\n        </div>\n        <div class=\"port-setting\">\n            <div class=\"setting-name\">\n                Id\n            </div>\n            <div class=\"setting-field\">\n                <span id=\"port-id\"></span>\n            </div>\n        </div>\n        <div id=\"port-concurrent-task-container\" class=\"port-setting\">\n            <div class=\"setting-name\">\n                Concurrent tasks\n                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The number of tasks that should be concurrently scheduled for this port.\"/>\n");
      out.write("            </div>\n            <div class=\"setting-field\">\n                <input type=\"text\" id=\"port-concurrent-tasks\" class=\"port-field\"></input>\n            </div>\n        </div>\n        <div class=\"port-setting\">\n            <div class=\"setting-name\">Comments</div>\n            <div class=\"setting-field\">\n                <textarea cols=\"30\" rows=\"4\" id=\"port-comments\" class=\"port-field\"></textarea>\n            </div>\n        </div>\n    </div>\n</div>");
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
