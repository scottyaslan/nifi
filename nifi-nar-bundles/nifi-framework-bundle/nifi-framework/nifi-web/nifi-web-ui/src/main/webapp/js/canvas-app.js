define(['canvas-config',
        'controller-wrapper',
        'nf-canvas-app-ctrl',
        'service-provider',
        'angular-material-dialog-controls',
        'nf-canvas'],
    function (config,
              ControllerWrapper,
              NifiCanvasAppCtrl,
              ServiceProvider,
              AngularMaterialDialogControls) {

        //Create App
        var app = angular.module('NifiCavasApp', ['ngResource', 'ngRoute', 'ngMaterial']);
        //Configure App
        app.config(config);
        //App Controllers
        app.controller('ControllerWrapper', ControllerWrapper);
        app.controller('NifiCanvasAppCtrl', NifiCanvasAppCtrl);
        //App Services
        app.factory('ServiceProvider', ServiceProvider);
        app.factory('AngularMaterialDialogControls', AngularMaterialDialogControls);

        //Manual Boostrap App
        angular.bootstrap($('body'), ['NifiCavasApp']);
        
        return app;
    });