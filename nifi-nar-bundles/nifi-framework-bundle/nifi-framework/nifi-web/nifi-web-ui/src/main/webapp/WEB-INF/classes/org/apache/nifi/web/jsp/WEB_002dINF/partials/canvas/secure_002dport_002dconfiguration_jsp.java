package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class secure_002dport_002dconfiguration_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"secure-port-configuration\">\n    <div class=\"dialog-content\">\n        <span id=\"secure-port-type\" class=\"hidden\"></span>\n        <div id=\"secure-port-configuration-tabs\"></div>\n        <div id=\"secure-port-configuration-tabs-content\">\n            <div id=\"secure-port-settings-tab-content\" class=\"configuration-tab\">\n                <div class=\"secure-port-setting\">\n                    <div class=\"setting-name\">Port name</div>\n                    <div class=\"setting-field\">\n                        <input type=\"text\" id=\"secure-port-name\"/>\n                        <div class=\"port-enabled-container\">\n                            <div id=\"secure-port-enabled\" class=\"port-enabled nf-checkbox checkbox-unchecked\"></div>\n                            <span> Enabled</span>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n                <div class=\"secure-port-setting\">\n                    <div class=\"setting-name\">\n                        Id\n");
      out.write("                    </div>\n                    <div class=\"setting-field\">\n                        <span id=\"secure-port-id\"></span>\n                    </div>\n                </div>\n                <div id=\"secure-port-concurrent-task-container\" class=\"secure-port-setting\">\n                    <div class=\"setting-name\">\n                        Concurrent tasks\n                        <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The number of tasks that should be concurrently scheduled for this port.\"/>\n                    </div>\n                    <div class=\"setting-field\">\n                        <input type=\"text\" id=\"secure-port-concurrent-tasks\" class=\"secure-port-field\"></input>\n                    </div>\n                </div>\n                <div class=\"secure-port-setting\">\n                    <div class=\"setting-name\">Comments</div>\n                    <div class=\"setting-field\">\n                        <textarea cols=\"30\" rows=\"4\" id=\"secure-port-comments\" class=\"secure-port-field\"></textarea>\n");
      out.write("                    </div>\n                </div>\n            </div>\n            <div id=\"secure-port-access-control-tab-content\" class=\"configuration-tab\">\n                <div class=\"secure-port-setting\">\n                    <div class=\"setting-name\">Search Users</div>\n                    <div class=\"setting-field\">\n                        <input type=\"text\" id=\"secure-port-access-control\" class=\"secure-port-field\"/>\n                    </div>\n                </div>\n                <div class=\"secure-port-setting\">\n                    <div class=\"setting-name\">Allowed Users</div>\n                    <div class=\"setting-field allowed-container\">\n                        <ul id=\"allowed-users\" class=\"allowed\"></ul>\n                    </div>\n                </div>\n                <div class=\"secure-port-setting\">\n                    <div class=\"setting-name\">Allowed Groups</div>\n                    <div class=\"setting-field allowed-container\">\n                        <ul id=\"allowed-groups\" class=\"allowed\"></ul>\n");
      out.write("                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div id=\"search-users-results\"></div>");
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
