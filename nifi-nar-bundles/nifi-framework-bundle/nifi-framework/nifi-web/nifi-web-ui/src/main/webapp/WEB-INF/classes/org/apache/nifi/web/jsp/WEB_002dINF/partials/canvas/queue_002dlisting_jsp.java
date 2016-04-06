package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class queue_002dlisting_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"queue-listing-container\" class=\"hidden\">\n    <div id=\"queue-listing-header-container\">\n        <div id=\"queue-listing-header-text\"></div>\n    </div>\n    <div id=\"queue-listing-stats-container\">\n        <div id=\"queue-listing-refresh-button\" class=\"pointer\" title=\"Refresh\"></div>\n        <div id=\"queue-listing-last-refreshed-container\">\n            Last updated:&nbsp;<span id=\"queue-listing-last-refreshed\"></span>\n        </div>\n        <div id=\"queue-listing-loading-container\" class=\"loading-container\"></div>\n        <div id=\"queue-listing-stats\">\n            Displaying&nbsp;<span id=\"displayed-flowfiles\"></span>&nbsp;of&nbsp;<span id=\"total-flowfiles-count\"></span>&nbsp;(<span id=\"total-flowfiles-size\"></span>)\n        </div>\n        <div class=\"clear\"></div>\n    </div>\n    <div id=\"queue-listing-table\"></div>\n    <div id=\"queue-listing-message\" class=\"hidden\"></div>\n</div>\n");
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
