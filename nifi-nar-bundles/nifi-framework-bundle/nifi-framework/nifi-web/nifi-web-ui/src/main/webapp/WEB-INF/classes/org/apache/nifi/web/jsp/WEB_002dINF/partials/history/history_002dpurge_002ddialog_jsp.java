package org.apache.nifi.web.jsp.WEB_002dINF.partials.history;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class history_002dpurge_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"history-purge-dialog\">\n    <div class=\"dialog-content\">\n        <div class=\"setting\" style=\"margin-bottom: 0px;\">\n            <div class=\"end-date-setting\">\n                <div class=\"setting-name\">\n                    End date\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The purge end date in the format 'mm/dd/yyyy'. Must also specify end time.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"history-purge-end-date\" class=\"history-small-input\"/>\n                </div>\n            </div>\n            <div class=\"end-time-setting\">\n                <div class=\"setting-name\">\n                    End time (<span class=\"timezone\"></span>)\n                    <img id=\"purge-end-time-info\" class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The end time in the format 'hh:mm:ss'. Must also specify end date.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"history-purge-end-time\" class=\"history-small-input\"/>\n");
      out.write("                </div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n    </div>\n</div>\n");
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
