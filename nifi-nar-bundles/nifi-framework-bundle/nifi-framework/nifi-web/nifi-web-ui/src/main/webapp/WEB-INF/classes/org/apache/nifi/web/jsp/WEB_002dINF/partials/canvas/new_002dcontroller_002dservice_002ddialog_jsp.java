package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class new_002dcontroller_002dservice_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"new-controller-service-dialog\">\n    <div class=\"dialog-content\">\n        <div id=\"controller-service-type-filter-controls\">\n            <div id=\"controller-service-type-filter-container\">\n                <input type=\"text\" id=\"controller-service-type-filter\"/>\n            </div>\n            <div id=\"controller-service-type-filter-status\">\n                Displaying&nbsp;<span id=\"displayed-controller-service-types\"></span>&nbsp;of&nbsp;<span id=\"total-controller-service-types\"></span>\n            </div>\n        </div>\n        <div id=\"controller-service-tag-cloud-container\">\n            <div class=\"setting\">\n                <div class=\"setting-name\">Tags</div>\n                <div class=\"setting-field\">\n                    <div id=\"controller-service-tag-cloud\"></div>\n                </div>\n            </div>\n        </div>\n        <div id=\"controller-service-types-container\">\n            <div id=\"controller-service-types-table\" class=\"unselectable\"></div>\n            <div id=\"controller-service-description-container\" class=\"hidden\">\n");
      out.write("                <div id=\"controller-service-type-name\" class=\"ellipsis\"></div>\n                <div id=\"controller-service-type-description\" class=\"ellipsis multiline\"></div>\n                <span class=\"hidden\" id=\"selected-controller-service-name\"></span>\n                <span class=\"hidden\" id=\"selected-controller-service-type\"></span>\n            </div>\n        </div>\n        <div class=\"clear\"></div>\n        <div id=\"controller-service-availability-container\" class=\"hidden\">\n            <div class=\"setting-name availability-label\">Available on</div>\n            <div id=\"controller-service-availability-combo\"></div>\n            <div class=\"clear\"></div>\n        </div>\n    </div>\n</div>\n");
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
