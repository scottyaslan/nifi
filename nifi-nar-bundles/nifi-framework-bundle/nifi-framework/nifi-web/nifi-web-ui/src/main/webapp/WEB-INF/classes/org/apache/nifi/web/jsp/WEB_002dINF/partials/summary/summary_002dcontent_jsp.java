package org.apache.nifi.web.jsp.WEB_002dINF.partials.summary;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class summary_002dcontent_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"summary\">\n    <div id=\"summary-header-and-filter\">\n        <div id=\"summary-header-text\">NiFi Summary</div>\n        <div id=\"summary-filter-controls\">\n            <div id=\"summary-filter-container\">\n                <input type=\"text\" id=\"summary-filter\"/>\n                <div id=\"summary-filter-type\"></div>\n            </div>\n            <div id=\"summary-filter-status\">\n                Displaying&nbsp;<span id=\"displayed-items\"></span>&nbsp;of&nbsp;<span id=\"total-items\"></span>\n            </div>\n        </div>\n        <div id=\"view-options-container\">\n            View:&nbsp;\n            <span id=\"view-single-node-link\" class=\"view-summary-link\">Single node</span>&nbsp;&nbsp;<span id=\"view-cluster-link\" class=\"view-summary-link\">Cluster</span>\n        </div>\n    </div>\n    <div id=\"flow-summary-refresh-container\">\n        <div id=\"summary-tabs\"></div>\n        <div id=\"refresh-button\" class=\"summary-refresh pointer\" title=\"Refresh\"></div>\n        <div id=\"summary-last-refreshed-container\">\n            Last updated:&nbsp;<span id=\"summary-last-refreshed\"></span>\n");
      out.write("        </div>\n        <div id=\"summary-loading-container\" class=\"loading-container\"></div>\n        <div id=\"system-diagnostics-link-container\">\n            <span id=\"system-diagnostics-link\" class=\"link\">system diagnostics</span>\n        </div>\n    </div>\n    <div id=\"summary-tab-background\"></div>\n    <div id=\"summary-tabs-content\">\n        <div id=\"processor-summary-tab-content\" class=\"configuration-tab\">\n            <div id=\"processor-summary-table\" class=\"summary-table\"></div>\n        </div>\n        <div id=\"connection-summary-tab-content\" class=\"configuration-tab\">\n            <div id=\"connection-summary-table\" class=\"summary-table\"></div>\n        </div>\n        <div id=\"process-group-summary-tab-content\" class=\"configuration-tab\">\n            <div id=\"process-group-summary-table\" class=\"summary-table\"></div>\n        </div>\n        <div id=\"input-port-summary-tab-content\" class=\"configuration-tab\">\n            <div id=\"input-port-summary-table\" class=\"summary-table\"></div>\n        </div>\n        <div id=\"output-port-summary-tab-content\" class=\"configuration-tab\">\n");
      out.write("            <div id=\"output-port-summary-table\" class=\"summary-table\"></div>\n        </div>\n        <div id=\"remote-process-group-summary-tab-content\" class=\"configuration-tab\">\n            <div id=\"remote-process-group-summary-table\" class=\"summary-table\"></div>\n        </div>\n    </div>\n</div>");
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
