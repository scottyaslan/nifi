package org.apache.nifi.web.jsp.WEB_002dINF.partials.provenance;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class provenance_002dsearch_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"provenance-search-dialog\">\n    <div class=\"dialog-content\">\n        <div class=\"setting\">\n            <div class=\"setting-name\">Fields</div>\n            <div class=\"setting-field\">\n                <div id=\"searchable-fields-container\">\n                    <div id=\"no-searchable-fields\" class=\"unset\">No searchable fields have been configured.</div>\n                </div>\n            </div>\n        </div>\n        <div class=\"setting\">\n            <div class=\"start-date-setting\">\n                <div class=\"setting-name\">\n                    Start date\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The start date in the format 'mm/dd/yyyy'. Must also specify start time.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"provenance-search-start-date\" class=\"provenance-small-input\"/>\n                </div>\n            </div>\n            <div class=\"start-time-setting\">\n                <div class=\"setting-name\">\n");
      out.write("                    Start time (<span class=\"timezone\"></span>)\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The start time in the format 'hh:mm:ss'. Must also specify start date.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"provenance-search-start-time\" class=\"provenance-time-input\"/>\n                </div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n        <div class=\"setting\">\n            <div class=\"end-date-setting\">\n                <div class=\"setting-name\">\n                    End date\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The end date in the format 'mm/dd/yyyy'. Must also specify end time.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"provenance-search-end-date\" class=\"provenance-small-input\"/>\n                </div>\n            </div>\n            <div class=\"end-time-setting\">\n");
      out.write("                <div class=\"setting-name\">\n                    End time (<span class=\"timezone\"></span>)\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The end time in the format 'hh:mm:ss'. Must also specify end date.\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"provenance-search-end-time\" class=\"provenance-time-input\"/>\n                </div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n        <div class=\"setting\">\n            <div class=\"end-date-setting\">\n                <div class=\"setting-name\">\n                    Minimum file size\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The minimum file size (e.g. 2 KB).\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"provenance-search-minimum-file-size\" class=\"provenance-small-input\"/>\n                </div>\n            </div>\n");
      out.write("            <div class=\"end-time-setting\">\n                <div class=\"setting-name\">\n                    Maximum file size\n                    <img class=\"icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The maximum file size (e.g. 4 GB).\"/>\n                </div>\n                <div class=\"setting-field\">\n                    <input type=\"text\" id=\"provenance-search-maximum-file-size\" class=\"provenance-time-input\"/>\n                </div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n        <div id=\"provenance-search-location-container\" class=\"setting\">\n            <div class=\"setting-name\">\n                Search location\n            </div>\n            <div class=\"setting-field\">\n                <div id=\"provenance-search-location\"></div>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n    </div>\n</div>\n");
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
