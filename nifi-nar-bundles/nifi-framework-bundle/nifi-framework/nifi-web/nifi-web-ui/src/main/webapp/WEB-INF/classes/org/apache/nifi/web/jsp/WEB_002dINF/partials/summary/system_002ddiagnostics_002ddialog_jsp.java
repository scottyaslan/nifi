package org.apache.nifi.web.jsp.WEB_002dINF.partials.summary;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class system_002ddiagnostics_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"system-diagnostics-dialog\">\n    <div id=\"system-diagnostics-refresh-container\">\n        <div id=\"system-diagnostics-tabs\"></div>\n        <div id=\"system-diagnostics-refresh-button\" class=\"summary-refresh pointer\" title=\"Refresh\"></div>\n        <div id=\"system-diagnostics-last-refreshed-container\">\n            Last updated:&nbsp;<span id=\"system-diagnostics-last-refreshed\"></span>\n        </div>\n        <div id=\"system-diagnostics-loading-container\" class=\"loading-container\"></div>\n    </div>\n    <div class=\"dialog-content\">\n        <div id=\"jvm-tab-content\" class=\"configuration-tab\">\n            <div class=\"settings-left\">\n                <div class=\"setting\">\n                    <input type=\"hidden\" id=\"\"/>\n                    <div class=\"setting-name\">Heap <span id=\"utilization-heap\"></span></div>\n                    <div class=\"setting-field\">\n                        <table id=\"heap-table\">\n                            <tbody>\n                                <tr>\n                                    <td class=\"memory-header\"><b>Max</b></td>\n");
      out.write("                                    <td><span id=\"max-heap\"></span></td>\n                                </tr>\n                                <tr>\n                                    <td><b>Total</b></td>\n                                    <td><span id=\"total-heap\"></span></td>\n                                </tr>\n                                <tr>\n                                    <td><b>Used</b></td>\n                                    <td><span id=\"used-heap\"></span></td>\n                                </tr>\n                                <tr>\n                                    <td><b>Free</b></td>\n                                    <td><span id=\"free-heap\"></span></td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                    <div class=\"clear\"></div>\n                </div>\n            </div>\n            <div class=\"settings-right\">\n                <div class=\"setting\">\n                    <div class=\"setting-name\">Non heap <span id=\"utilization-non-heap\"></span></div>\n");
      out.write("                    <div class=\"setting-field\">\n                        <table id=\"heap-table\">\n                            <tbody>\n                                <tr>\n                                    <td class=\"memory-header\"><b>Max</b></td>\n                                    <td><span id=\"max-non-heap\"></span></td>\n                                </tr>\n                                <tr>\n                                    <td><b>Total</b></td>\n                                    <td><span id=\"total-non-heap\"></span></td>\n                                </tr>\n                                <tr>\n                                    <td><b>Used</b></td>\n                                    <td><span id=\"used-non-heap\"></span></td>\n                                </tr>\n                                <tr>\n                                    <td><b>Free</b></td>\n                                    <td><span id=\"free-non-heap\"></span></td>\n                                </tr>\n                            </tbody>\n");
      out.write("                        </table>\n                    </div>\n                    <div class=\"clear\"></div>\n                </div>\n            </div>\n            <div class=\"clear\"></div>\n            <div class=\"setting\">\n                <div class=\"setting-name\">Garbage collection</div>\n                <div id=\"garbage-collection-container\" class=\"setting-field\">\n                    <table id=\"garbage-collection-table\">\n                        <tbody></tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n        <div id=\"system-tab-content\"class=\"configuration-tab\">\n            <div class=\"settings-left\">\n                <div class=\"setting\">\n                    <div class=\"setting-name\">Available processors</div>\n                    <div class=\"setting-field\">\n                        <div id=\"available-processors\"></div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"settings-right\">\n                <div class=\"setting\">\n                    <div class=\"setting-name\">\n");
      out.write("                        Processor load average\n                        <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Processor load average for the last minute. Not available on all platforms.\"/>\n                    </div>\n                    <div class=\"setting-field\">\n                        <div id=\"processor-load-average\"></div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"clear\"></div>\n            <div class=\"setting\">\n                <div class=\"setting-name\">FlowFile repository storage usage</div>\n                <div class=\"setting-field\">\n                    <div id=\"flow-file-repository-storage-usage-container\"></div>\n                </div>\n            </div>\n            <div class=\"setting\">\n                <div class=\"setting-name\">Content repository storage usage</div>\n                <div class=\"setting-field\">\n                    <div id=\"content-repository-storage-usage-container\"></div>\n                </div>\n            </div>\n");
      out.write("        </div>\n    </div>\n</div>\n");
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
