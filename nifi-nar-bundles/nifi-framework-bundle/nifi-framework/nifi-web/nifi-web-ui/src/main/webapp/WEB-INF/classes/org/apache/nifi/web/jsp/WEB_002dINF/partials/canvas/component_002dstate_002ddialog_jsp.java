package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class component_002dstate_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"component-state-dialog\">\n    <div class=\"dialog-content\">\n        <div class=\"setting\">\n            <div class=\"setting-name\">Name</div>\n            <div class=\"setting-field\">\n                <div id=\"component-state-name\"></div>\n            </div>\n        </div>\n        <div class=\"setting\">\n            <div class=\"setting-name\">Description</div>\n            <div class=\"setting-field\">\n                <div id=\"component-state-description\" class=\"ellipsis multiline\"></div>\n            </div>\n        </div>\n        <div>\n            <div id=\"component-state-partial-results-container\" class=\"hidden\">\n                Showing partial results\n            </div>\n            <div id=\"component-state-filter-controls\">\n                <div id=\"component-state-filter-container\">\n                    <input type=\"text\" id=\"component-state-filter\"/>\n                </div>\n                <div id=\"component-state-filter-status\">\n                    Displaying&nbsp;<span id=\"displayed-component-state-entries\"></span>&nbsp;of&nbsp;<span id=\"total-component-state-entries\"></span>\n");
      out.write("                </div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n        <div id=\"component-state-table\"></div>\n        <div id=\"clear-link-container\">\n            <span id=\"clear-link\" class=\"link\">Clear state</span>\n        </div>\n    </div>\n</div>");
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
