package org.apache.nifi.web.jsp.WEB_002dINF.partials.users;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class group_002droles_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"group-roles-dialog\">\n    <div class=\"dialog-content\">\n        <div class=\"setting\">\n            <div class=\"setting-name\">Group</div>\n            <div class=\"setting-field\">\n                <span id=\"group-name-roles-dialog\"></span>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n        <div class=\"setting\">\n            <div class=\"setting-name\">Roles</div>\n            <div class=\"group-roles-container\">\n                <div class=\"role-container\">\n                    <div id=\"group-role-admin-checkbox\" class=\"role-checkbox nf-checkbox checkbox-unchecked\"></div><div class=\"role-name\">Administrator</div>\n                </div>\n                <div class=\"role-container\">\n                    <div id=\"group-role-dfm-checkbox\" class=\"role-checkbox nf-checkbox checkbox-unchecked\"></div><div class=\"role-name\">Data Flow Manager</div>\n                </div>\n                <div class=\"role-container\">\n                    <div id=\"group-role-monitor-checkbox\" class=\"role-checkbox nf-checkbox checkbox-unchecked\"></div><div class=\"role-name\">Read Only</div>\n");
      out.write("                </div>\n                <div class=\"role-container\" style=\"margin-top: 5px;\">\n                    <div id=\"group-role-provenance-checkbox\" class=\"role-checkbox nf-checkbox checkbox-unchecked\"></div><div class=\"role-name\">Provenance</div>\n                </div>\n                <div class=\"role-container\" style=\"margin-top: 5px;\">\n                    <div id=\"group-role-nifi-checkbox\" class=\"role-checkbox nf-checkbox checkbox-unchecked\"></div><div class=\"role-name\">NiFi</div>\n                </div>\n                <div class=\"role-container\">\n                    <div id=\"group-role-proxy-checkbox\" class=\"role-checkbox nf-checkbox checkbox-unchecked\"></div><div class=\"role-name\">Proxy</div>\n                </div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n    </div>\n</div>\n");
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
