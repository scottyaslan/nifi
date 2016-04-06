package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class reporting_002dtask_002dconfiguration_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"reporting-task-configuration\">\n    <div class=\"reporting-task-configuration-tab-container\">\n        <div id=\"reporting-task-configuration-tabs\"></div>\n        <div id=\"reporting-task-configuration-tabs-content\">\n            <div id=\"reporting-task-standard-settings-tab-content\" class=\"configuration-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Name</div>\n                        <div class=\"reporting-task-editable setting-field\">\n                            <input type=\"text\" id=\"reporting-task-name\" name=\"reporting-task-name\"/>\n                            <div class=\"reporting-task-enabled-container\">\n                                <div id=\"reporting-task-enabled\" class=\"nf-checkbox checkbox-unchecked\"></div>\n                                <span> Enabled</span>\n                            </div>\n                        </div>\n                        <div class=\"reporting-task-read-only setting-field hidden\">\n");
      out.write("                            <span id=\"read-only-reporting-task-name\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Id</div>\n                        <div class=\"setting-field\">\n                            <span id=\"reporting-task-id\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Type</div>\n                        <div class=\"setting-field\">\n                            <span id=\"reporting-task-type\"></span>\n                        </div>\n                    </div>\n                    <div id=\"reporting-task-availability-setting-container\" class=\"setting hidden\">\n                        <div class=\"availability-setting\">\n                            <div class=\"setting-name\">\n                                Availability\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Where this controller service is available.\"/>\n");
      out.write("                            </div>\n                            <div class=\"setting-field\">\n                                <div id=\"reporting-task-availability\"></div>\n                            </div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Scheduling strategy\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The strategy used to schedule this reporting task.\"/>\n                        </div>\n                        <div class=\"reporting-task-editable setting-field\">\n                            <div id=\"reporting-task-scheduling-strategy-combo\"></div>\n                        </div>\n                        <div class=\"reporting-task-read-only setting-field hidden\">\n");
      out.write("                            <span id=\"read-only-reporting-task-scheduling-strategy\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Run schedule\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The amount of time that should elapse between task executions.\"/>\n                        </div>\n                        <div class=\"reporting-task-editable setting-field\">\n                            <input type=\"text\" id=\"reporting-task-timer-driven-scheduling-period\" class=\"reporting-task-scheduling-period\"/>\n                            <input type=\"text\" id=\"reporting-task-cron-driven-scheduling-period\" class=\"reporting-task-scheduling-period\"/>\n                        </div>\n                        <div class=\"reporting-task-read-only setting-field hidden\">\n                            <span id=\"read-only-reporting-task-scheduling-period\"></span>\n");
      out.write("                        </div>\n                    </div>\n                </div>\n                <div class=\"clear\"></div>\n            </div>\n            <div id=\"reporting-task-properties-tab-content\" class=\"configuration-tab\">\n                <div id=\"reporting-task-properties\"></div>\n            </div>\n            <div id=\"reporting-task-comments-tab-content\" class=\"configuration-tab\">\n                <textarea cols=\"30\" rows=\"4\" id=\"reporting-task-comments\" name=\"reporting-task-comments\" class=\"reporting-task-editable setting-input\"></textarea>\n                <div class=\"setting reporting-task-read-only hidden\">\n                    <div class=\"setting-name\">Comments</div>\n                    <div class=\"setting-field\">\n                        <span id=\"read-only-reporting-task-comments\"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div id=\"new-reporting-task-property-container\"></div>");
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
