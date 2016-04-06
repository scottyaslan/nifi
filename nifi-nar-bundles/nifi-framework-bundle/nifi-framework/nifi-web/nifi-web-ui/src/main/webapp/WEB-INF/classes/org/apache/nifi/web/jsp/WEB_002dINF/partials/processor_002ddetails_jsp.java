package org.apache.nifi.web.jsp.WEB_002dINF.partials;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class processor_002ddetails_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"processor-details\">\n    <div class=\"processor-details-tab-container\">\n        <div id=\"processor-details-tabs\"></div>\n        <div id=\"processor-details-tabs-content\">\n            <div id=\"details-standard-settings-tab-content\" class=\"details-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Name</div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-processor-name\"></span>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Id</div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-processor-id\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Type</div>\n                        <div class=\"setting-field\">\n");
      out.write("                            <span id=\"read-only-processor-type\"></span>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"penalty-duration-setting\">\n                            <div class=\"setting-name\">\n                                Penalty duration\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The amount of time used when this processor penalizes a FlowFile.\"/>\n                            </div>\n                            <div class=\"setting-field\">\n                                <span id=\"read-only-penalty-duration\"></span>\n                            </div>\n                        </div>\n                        <div class=\"yield-duration-setting\">\n                            <div class=\"setting-name\">\n                                Yield duration\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"When a processor yields, it will not be scheduled again until this amount of time elapses.\"/>\n");
      out.write("                            </div>\n                            <div class=\"setting-field\">\n                                <span id=\"read-only-yield-duration\"></span>\n                            </div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"bulletin-setting\">\n                            <div class=\"setting-name\">\n                                Bulletin level\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The level at which this processor will generate bulletins.\"/>\n                            </div>\n                            <div class=\"setting-field\">\n                                <span id=\"read-only-bulletin-level\"></span>\n                            </div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n");
      out.write("                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Auto terminate relationships\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Will automatically terminate FlowFiles sent to all relationships in bold.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <div id=\"read-only-auto-terminate-relationship-names\"></div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div id=\"details-scheduling-tab-content\" class=\"details-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div class=\"scheduling-strategy-setting\">\n                            <div class=\"setting-name\">\n                                Scheduling strategy\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The strategy used to schedule this processor.\"/>\n");
      out.write("                            </div>\n                            <div class=\"setting-field\">\n                                <span id=\"read-only-scheduling-strategy\"></span>\n                            </div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"concurrently-schedulable-tasks-setting\">\n                            <div class=\"setting-name\">\n                                Concurrent tasks\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The number of tasks that should be concurrently scheduled for this processor.\"/>\n                            </div>\n                            <div class=\"setting-field\">\n                                <span id=\"read-only-concurrently-schedulable-tasks\"></span>\n                            </div>\n                        </div>\n                        <div id=\"read-only-run-schedule\" class=\"scheduling-period-setting\">\n");
      out.write("                            <div class=\"setting-name\">\n                                Run schedule\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"The minimum number of seconds that should elapse between task executions.\"/>\n                            </div>\n                            <div class=\"setting-field\">\n                                <span id=\"read-only-scheduling-period\"></span>\n                            </div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Run duration\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\"\n                                 title=\"When scheduled to run, the processor will continue running for up to this duration. A run duration of 0ms will execute once when scheduled.\"/>\n");
      out.write("                        </div>\n                        <div class=\"setting-field\">\n                            <span id=\"read-only-run-duration\"></span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div id=\"details-processor-properties-tab-content\" class=\"details-tab\">\n                <div id=\"read-only-processor-properties\"></div>\n            </div>\n            <div id=\"details-processor-comments-tab-content\" class=\"details-tab\">\n                <div class=\"setting\">\n                    <div class=\"setting-name\">Comments</div>\n                    <div class=\"setting-field\">\n                        <div id=\"read-only-processor-comments\"></div>\n                    </div>\n                    <div class=\"clear\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
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
