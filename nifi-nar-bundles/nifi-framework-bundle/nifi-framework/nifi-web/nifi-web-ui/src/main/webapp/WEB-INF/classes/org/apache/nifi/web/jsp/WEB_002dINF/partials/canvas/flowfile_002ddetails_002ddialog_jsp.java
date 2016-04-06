package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class flowfile_002ddetails_002ddialog_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"flowfile-details-dialog\">\n    <div id=\"flowfile-details-dialog-content\">\n        <div id=\"flowfile-details-tabs\"></div>\n        <div id=\"flowfile-details-tabs-content\">\n            <div id=\"flowfile-details-tab-content\" class=\"details-tab\">\n                <span id=\"flowfile-uri\" class=\"hidden\"></span>\n                <span id=\"flowfile-cluster-node-id\" class=\"hidden\"></span>\n                <div class=\"settings-left\">\n                    <div id=\"flowfile-details\">\n                        <div class=\"flowfile-header\">FlowFile Details</div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"detail-name\">UUID</div>\n                            <div id=\"flowfile-uuid\" class=\"detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"detail-name\">Filename</div>\n                            <div id=\"flowfile-filename\" class=\"detail-value\"></div>\n");
      out.write("                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"detail-name\">File Size</div>\n                            <div id=\"flowfile-file-size\" class=\"detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"detail-name\">Queue Position</div>\n                            <div id=\"flowfile-queue-position\" class=\"detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"detail-name\">Queued Duration</div>\n                            <div id=\"flowfile-queued-duration\" class=\"detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n");
      out.write("                            <div class=\"detail-name\">Lineage Duration</div>\n                            <div id=\"flowfile-lineage-duration\" class=\"detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"detail-name\">Penalized</div>\n                            <div id=\"flowfile-penalized\" class=\"detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div id=\"additional-flowfile-details\"></div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div id=\"flowfile-content-details\" class=\"content-details\">\n                        <div class=\"flowfile-header\">Content Claim</div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"content-detail-name\">Container</div>\n");
      out.write("                            <div id=\"content-container\" class=\"content-detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"content-detail-name\">Section</div>\n                            <div id=\"content-section\" class=\"content-detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"content-detail-name\">Identifier</div>\n                            <div id=\"content-identifier\" class=\"content-detail-value\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"content-detail-name\">Offset</div>\n                            <div id=\"content-offset\" class=\"content-detail-value\"></div>\n                            <div class=\"clear\"></div>\n");
      out.write("                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div class=\"content-detail-name\">Size</div>\n                            <div id=\"content-size\" class=\"content-detail-value\"></div>\n                            <div id=\"content-bytes\" class=\"content-detail-value hidden\"></div>\n                            <div class=\"clear\"></div>\n                        </div>\n                        <div class=\"flowfile-detail\">\n                            <div id=\"content-download\" class=\"button\">Download</div>\n                            <div id=\"content-view\" class=\"button hidden\">View</div>\n                            <div class=\"clear\"></div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"clear\"></div>\n            </div>\n            <div id=\"flowfile-attributes-tab-content\" class=\"details-tab\">\n                <div id=\"flowfile-attributes-details\">\n                    <div id=\"flowfile-attributes-header\" class=\"flowfile-header\">Attribute Values</div>\n");
      out.write("                    <div class=\"clear\"></div>\n                    <div id=\"flowfile-attributes-container\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
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
