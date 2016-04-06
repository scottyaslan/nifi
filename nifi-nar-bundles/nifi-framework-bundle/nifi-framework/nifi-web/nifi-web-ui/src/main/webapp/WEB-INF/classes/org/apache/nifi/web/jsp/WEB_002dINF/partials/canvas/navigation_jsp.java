package org.apache.nifi.web.jsp.WEB_002dINF.partials.canvas;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class navigation_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n\n<div id=\"breadcrumbs\">\n    <div id=\"cluster-indicator\"></div>\n    <div id=\"data-flow-title-viewport\">\n        <div id=\"breadcrumbs-left-border\"></div>\n        <div id=\"data-flow-title-container\"></div>\n        <div id=\"breadcrumbs-right-border\"></div>\n    </div>\n    <div id=\"breadcrumbs-background\"></div>\n</div>\n<div id=\"pan-and-zoom\">\n    <div id=\"graph-control-separator\">&nbsp;</div>\n    <table class=\"pan\">\n        <tr>\n            <td id=\"pan-top-left\"></td>\n            <td id=\"pan-up-button\" title=\"Pan Up\" class=\"pan-up\"></td>\n            <td id=\"pan-top-right\"></td>\n        </tr>\n        <tr>\n            <td id=\"pan-left-button\" title=\"Pan Left\" class=\"pan-left\"></td>\n            <td id=\"pan-center\"></td>\n            <td id=\"pan-right-button\" title=\"Pan Right\" class=\"pan-right\"></td>\n        </tr>\n        <tr>\n            <td id=\"pan-bottom-left\"></td>\n            <td id=\"pan-down-button\" title=\"Pan Down\" class=\"pan-down\"></td>\n            <td id=\"pan-bottom-right\"></td>\n        </tr>\n    </table>\n    <div id=\"graph-control-separator\">&nbsp;</div>\n");
      out.write("    <div id=\"zoom-in-button\" title=\"Zoom In\" class=\"zoom-in\"></div>\n    <div id=\"zoom-out-button\" title=\"Zoom Out\" class=\"zoom-out\"></div>\n    <div id=\"graph-control-separator\">&nbsp;</div>\n    <div id=\"zoom-fit-button\" title=\"Fit\" class=\"fit-image\"></div>\n    <div id=\"graph-control-separator\">&nbsp;</div>\n    <div id=\"zoom-actual-button\" title=\"Actual Size\" class=\"actual-size\"></div>\n</div>\n<div id=\"birdseye-collapse\" class=\"birdseye-expanded\"></div>\n<div id=\"birdseye-container\">\n    <div id=\"birdseye\"></div>\n</div>");
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
