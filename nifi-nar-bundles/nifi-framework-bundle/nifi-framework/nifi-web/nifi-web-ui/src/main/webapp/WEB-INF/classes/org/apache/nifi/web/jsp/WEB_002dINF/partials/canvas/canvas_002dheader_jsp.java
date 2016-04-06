package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class canvas_002dheader_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"header\">\n    <div id=\"nf-logo\"></div>\n    <div id=\"nf-logo-name\"></div>\n    <div id=\"toolbox-container\">\n        <div layout=\"row\" layout-md=\"column\" id=\"toolbox\"></div>\n        <div id=\"toolbox-right-edge\"></div>\n    </div>\n    <div id=\"toolbar\">\n        <div id=\"global-controls\"></div>\n        <div id=\"utilities-container\">\n            <div id=\"utilities-border\"></div>\n            <div layout=\"row\" layout-md=\"column\" id=\"utility-buttons\">\n                <div id=\"reporting-link\" class=\"utility-button\" title=\"Summary\"></div>\n                <div id=\"counters-link\" class=\"utility-button\" title=\"Counters\"></div>\n                <div id=\"history-link\" class=\"utility-button\" title=\"Flow Configuration History\"></div>\n                <div id=\"provenance-link\" class=\"utility-button\" title=\"Data Provenance\"></div>\n                <div id=\"flow-settings-link\" class=\"utility-button\" title=\"Controller Settings\"></div>\n                <div id=\"templates-link\" class=\"utility-button\" title=\"Templates\"></div>\n                <div id=\"users-link\" class=\"utility-button\" title=\"Users\"><div id=\"has-pending-accounts\" class=\"hidden\"></div></div>\n");
      out.write("                <div id=\"cluster-link\" class=\"utility-button\" title=\"Cluster\"></div>\n                <div id=\"bulletin-board-link\" class=\"utility-button\" title=\"Bulletin Board\"></div>\n            </div>\n        </div>\n        <div id=\"search-container\">\n            <input id=\"search-field\" type=\"text\"/>\n        </div>\n    </div>\n    <div id=\"header-links-container\">\n        <ul class=\"links\">\n            <li id=\"current-user-container\">\n                <div id=\"anonymous-user-alert\" class=\"hidden\"></div>\n                <div id=\"current-user\"></div>\n                <div class=\"clear\"></div>\n            </li>\n            <li id=\"login-link-container\">\n                <span id=\"login-link\" class=\"link\">login</span>\n            </li>\n            <li id=\"logout-link-container\" style=\"display: none;\">\n                <span id=\"logout-link\" class=\"link\">logout</span>\n            </li>\n            <li>\n                <span id=\"help-link\" class=\"link\">help</span>\n            </li>\n            <li>\n                <span id=\"about-link\" class=\"link\">about</span>\n");
      out.write("            </li>\n        </ul>\n    </div>\n</div>\n<div id=\"search-flow-results\"></div>\n");
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
