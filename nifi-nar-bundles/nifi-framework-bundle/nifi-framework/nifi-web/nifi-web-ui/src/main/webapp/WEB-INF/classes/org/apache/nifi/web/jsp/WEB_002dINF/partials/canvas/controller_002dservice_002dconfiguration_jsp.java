package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class controller_002dservice_002dconfiguration_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"controller-service-configuration\">\n    <div class=\"controller-service-configuration-tab-container\">\n        <div id=\"controller-service-configuration-tabs\"></div>\n        <div id=\"controller-service-configuration-tabs-content\">\n            <div id=\"controller-service-standard-settings-tab-content\" class=\"configuration-tab\">\n                <div class=\"settings-left\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Name</div>\n                        <div class=\"controller-service-editable setting-field\">\n                            <input type=\"text\" id=\"controller-service-name\" name=\"controller-service-name\" class=\"setting-input\"/>\n                        </div>\n                        <div class=\"controller-service-read-only setting-field hidden\">\n                            <span id=\"read-only-controller-service-name\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Id</div>\n");
      out.write("                        <div class=\"setting-field\">\n                            <span id=\"controller-service-id\"></span>\n                        </div>\n                    </div>\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">Type</div>\n                        <div class=\"setting-field\">\n                            <span id=\"controller-service-type\"></span>\n                        </div>\n                    </div>\n                    <div id=\"controller-service-availability-setting-container\" class=\"setting hidden\">\n                        <div class=\"availability-setting\">\n                            <div class=\"setting-name\">\n                                Availability\n                                <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Where this controller service is available.\"/>\n                            </div>\n                            <div class=\"setting-field\">\n                                <div id=\"controller-service-availability\"></div>\n");
      out.write("                            </div>\n                        </div>\n                        <div class=\"clear\"></div>\n                    </div>\n                </div>\n                <div class=\"spacer\">&nbsp;</div>\n                <div class=\"settings-right\">\n                    <div class=\"setting\">\n                        <div class=\"setting-name\">\n                            Referencing Components\n                            <img class=\"setting-icon icon-info\" src=\"images/iconInfo.png\" alt=\"Info\" title=\"Other components referencing this controller service.\"/>\n                        </div>\n                        <div class=\"setting-field\">\n                            <div id=\"controller-service-referencing-components\"></div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div id=\"controller-service-properties-tab-content\" class=\"configuration-tab\">\n                <div id=\"controller-service-properties\"></div>\n            </div>\n            <div id=\"controller-service-comments-tab-content\" class=\"configuration-tab\">\n");
      out.write("                <textarea cols=\"30\" rows=\"4\" id=\"controller-service-comments\" name=\"controller-service-comments\" class=\"controller-service-editable setting-input\"></textarea>\n                <div class=\"setting controller-service-read-only hidden\">\n                    <div class=\"setting-name\">Comments</div>\n                    <div class=\"setting-field\">\n                        <span id=\"read-only-controller-service-comments\"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div id=\"new-controller-service-property-container\"></div>");
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
