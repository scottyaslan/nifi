package org.apache.nifi.web.jsp.WEB_002dINF.partials.provenance;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class provenance_002dcontent_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List<String> _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_c_out_value_nobody;

  private org.glassfish.jsp.api.ResourceInjector _jspx_resourceInjector;

  public java.util.List<String> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _jspx_tagPool_c_out_value_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
  }

  public void _jspDestroy() {
    _jspx_tagPool_c_out_value_nobody.release();
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

      out.write("\n\n\n<div id=\"provenance\">\n    <span id=\"intial-component-query\" class=\"hidden\">");
      if (_jspx_meth_c_out_0(_jspx_page_context))
        return;
      out.write("</span>\n    <span id=\"intial-flowfile-query\" class=\"hidden\">");
      if (_jspx_meth_c_out_1(_jspx_page_context))
        return;
      out.write("</span>\n    <span id=\"nifi-controller-uri\" class=\"hidden\"></span>\n    <span id=\"nifi-content-viewer-url\" class=\"hidden\"></span>\n    <div id=\"provenance-header-and-filter\">\n        <div id=\"provenance-header-text\">NiFi Data Provenance</div>\n        <div id=\"provenance-filter-controls\">\n            <div id=\"provenance-filter-container\">\n                <input type=\"text\" id=\"provenance-filter\"/>\n                <div id=\"provenance-filter-type\"></div>\n            </div>\n            <div id=\"provenance-filter-stats\">\n                Displaying&nbsp;<span id=\"displayed-events\"></span>&nbsp;of&nbsp;<span id=\"total-events\"></span>\n            </div>\n        </div>\n        <div id=\"oldest-event-message\">\n            Oldest event available:&nbsp;<span id=\"oldest-event\"></span>\n        </div>\n    </div>\n    <div id=\"provenance-event-search\" class=\"provenance-panel\">\n        <div id=\"provenance-refresh-container\">\n            <div id=\"refresh-button\" class=\"history-refresh pointer\" title=\"Refresh\"></div>\n            <div id=\"provenance-last-refreshed-container\">\n");
      out.write("                Last updated:&nbsp;<span id=\"provenance-last-refreshed\"></span>\n            </div>\n            <div id=\"provenance-loading-container\" class=\"loading-container\"></div>\n            <div id=\"provenance-search-container\">\n                <div id=\"provenance-search-overview\">\n                    <span id=\"provenance-query-message\"></span>\n                    <span id=\"clear-provenance-search\">Clear search</span>\n                </div>\n                <div id=\"provenance-search-button\" class=\"button button-normal pointer\">Search</div>\n            </div>\n        </div>\n        <div id=\"provenance-table\"></div>\n    </div>\n    <div id=\"provenance-lineage\" class=\"provenance-panel hidden\">\n        <div id=\"provenance-lineage-loading-container\">\n            <div id=\"provenance-lineage-loading\" class=\"loading-container\"></div>\n        </div>\n        <div id=\"provenance-lineage-close-container\">\n            <div id=\"provenance-lineage-downloader\" title=\"Download\"></div>\n            <div id=\"provenance-lineage-closer\" title=\"Close\"></div>\n");
      out.write("        </div>\n        <div id=\"provenance-lineage-context-menu\"></div>\n        <div id=\"provenance-lineage-slider-container\">\n            <div id=\"provenance-lineage-slider\"></div>\n            <div id=\"event-timeline\">\n                <div id=\"event-time\"></div>\n                <span style=\"float: left;\">&nbsp;</span>\n                <div id=\"event-timezone\" class=\"timezone\"></div>\n                <div id=\"clear\"></div>\n            </div>\n        </div>\n        <div id=\"provenance-lineage-container\"></div>\n    </div>\n</div>");
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

  private boolean _jspx_meth_c_out_0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:out
    org.apache.taglibs.standard.tag.rt.core.OutTag _jspx_th_c_out_0 = (org.apache.taglibs.standard.tag.rt.core.OutTag) _jspx_tagPool_c_out_value_nobody.get(org.apache.taglibs.standard.tag.rt.core.OutTag.class);
    _jspx_th_c_out_0.setPageContext(_jspx_page_context);
    _jspx_th_c_out_0.setParent(null);
    _jspx_th_c_out_0.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.evaluateExpression("${param.componentId}", java.lang.Object.class, (PageContext)_jspx_page_context, null));
    int _jspx_eval_c_out_0 = _jspx_th_c_out_0.doStartTag();
    if (_jspx_th_c_out_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_c_out_value_nobody.reuse(_jspx_th_c_out_0);
      return true;
    }
    _jspx_tagPool_c_out_value_nobody.reuse(_jspx_th_c_out_0);
    return false;
  }

  private boolean _jspx_meth_c_out_1(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:out
    org.apache.taglibs.standard.tag.rt.core.OutTag _jspx_th_c_out_1 = (org.apache.taglibs.standard.tag.rt.core.OutTag) _jspx_tagPool_c_out_value_nobody.get(org.apache.taglibs.standard.tag.rt.core.OutTag.class);
    _jspx_th_c_out_1.setPageContext(_jspx_page_context);
    _jspx_th_c_out_1.setParent(null);
    _jspx_th_c_out_1.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.evaluateExpression("${param.flowFileUuid}", java.lang.Object.class, (PageContext)_jspx_page_context, null));
    int _jspx_eval_c_out_1 = _jspx_th_c_out_1.doStartTag();
    if (_jspx_th_c_out_1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_c_out_value_nobody.reuse(_jspx_th_c_out_1);
      return true;
    }
    _jspx_tagPool_c_out_value_nobody.reuse(_jspx_th_c_out_1);
    return false;
  }
}
