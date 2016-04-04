<%--
 Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
--%>
<%@ page contentType="text/html" pageEncoding="UTF-8" session="false" %>
<!DOCTYPE html>
<html>
    <head>
        <title>NiFi</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <link rel="shortcut icon" href="images/nifi16.ico"/>
        <link rel="stylesheet" href="css/reset.css" type="text/css" />
        ${nf.canvas.style.tags}
        <link rel="stylesheet" href="js/codemirror/lib/codemirror.css" type="text/css" />
        <link rel="stylesheet" href="js/codemirror/addon/hint/show-hint.css" type="text/css" />
        <link rel="stylesheet" href="js/jquery/nfeditor/jquery.nfeditor.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/nfeditor/languages/nfel.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/tabbs/jquery.tabbs.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/combo/jquery.combo.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/propertytable/jquery.propertytable.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/tagcloud/jquery.tagcloud.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/modal/jquery.modal.css?${project.version}" type="text/css" />
        <link rel="stylesheet" href="js/jquery/qtip2/jquery.qtip.min.css?" type="text/css" />
        <link rel="stylesheet" href="js/jquery/ui-smoothness/jquery-ui-1.10.4.min.css" type="text/css" />
        <link rel="stylesheet" href="js/jquery/minicolors/jquery.minicolors.css" type="text/css" />
        <link rel="stylesheet" href="js/jquery/slickgrid/css/slick.grid.css" type="text/css" />
        <link rel="stylesheet" href="js/jquery/slickgrid/css/slick-default-theme.css" type="text/css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.6/angular-material.min.css" type="text/css" />
    </head>
    <body ng-controller="NifiCanvasAppCtrl" id="canvas-body">
        <div id="splash">
            <img id="splash-img" src="images/loadAnimation.gif" alt="Loading..."/>
        </div>
        <jsp:include page="/WEB-INF/partials/message-pane.jsp"/>
        <jsp:include page="/WEB-INF/partials/banners-main.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/canvas-header.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/about-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/ok-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/yes-no-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/status-history-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/disable-controller-service-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/enable-controller-service-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-controller-service-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-reporting-task-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-processor-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-port-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-process-group-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-remote-process-group-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/new-template-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/instantiate-template-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/fill-color-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/connections-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/flow-status.jsp"/>
        <div id="canvas-container" class="unselectable"></div>
        <div id="canvas-tooltips">
            <div id="processor-tooltips"></div>
            <div id="port-tooltips"></div>
            <div id="process-group-tooltips"></div>
            <div id="remote-process-group-tooltips"></div>
        </div>
        <jsp:include page="/WEB-INF/partials/canvas/navigation.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/settings-content.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/shell.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/controller-service-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/reporting-task-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/processor-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/processor-details.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/process-group-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/process-group-details.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/remote-process-group-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/remote-process-group-details.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/remote-process-group-ports.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/remote-port-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/port-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/port-details.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/secure-port-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/secure-port-details.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/label-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/connection-configuration.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/drop-request-status-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/flowfile-details-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/listing-request-status-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/queue-listing.jsp"/>
        <jsp:include page="/WEB-INF/partials/canvas/component-state-dialog.jsp"/>
        <jsp:include page="/WEB-INF/partials/connection-details.jsp"/>
        <div id="faded-background"></div>
        <div id="glass-pane"></div>
        <div id="context-menu" class="unselectable"></div>
        <span id="nifi-content-viewer-url" class="hidden"></span>
    </body>
    <script type="text/javascript"  data-main="js/require-nifiCfg.js" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>

    <script>
        (function(){
            require(['canvas-app', function(){

            }]);
        }());
    </script>
</html>