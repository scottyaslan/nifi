package org.apache.nifi.web.jsp.WEB_002dINF.partials.counters;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class counters_002dcontent_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"counters\">\n    <div id=\"counters-header-and-filter\">\n        <div id=\"counters-header-text\">NiFi Counters</div>\n        <div id=\"counters-filter-controls\">\n            <div id=\"counters-filter-container\">\n                <input type=\"text\" id=\"counters-filter\"/>\n                <div id=\"counters-filter-type\"></div>\n            </div>\n            <div id=\"counters-filter-stats\">\n                Displaying&nbsp;<span id=\"displayed-counters\"></span>&nbsp;of&nbsp;<span id=\"total-counters\"></span>\n            </div>\n        </div>\n    </div>\n    <div id=\"counters-refresh-container\">\n        <div id=\"refresh-button\" class=\"counters-refresh pointer\" title=\"Refresh\"></div>\n        <div id=\"counters-last-refreshed-container\">\n            Last updated:&nbsp;<span id=\"counters-last-refreshed\"></span>\n        </div>\n        <div id=\"counters-loading-container\" class=\"loading-container\"></div>\n    </div>\n    <div id=\"counters-table\"></div>\n</div>");
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
