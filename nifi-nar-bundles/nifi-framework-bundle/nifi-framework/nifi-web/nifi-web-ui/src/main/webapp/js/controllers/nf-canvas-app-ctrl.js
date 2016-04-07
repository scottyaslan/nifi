define([], function() {
    'use strict';

    function NifiCanvasAppCtrl(ServiceProvider, $scope, $rootScope) {
        function NifiCanvasAppCtrl() {
        };
        NifiCanvasAppCtrl.prototype = {
            constructor: NifiCanvasAppCtrl,
            init: function() {
                $rootScope.$on('Event1', function() {
                    //add some pub-sub if necessary
                });
            },
        };
        var nifiCanvasAppCtrl = new NifiCanvasAppCtrl();
        nifiCanvasAppCtrl.init();
        $scope.NifiCanvasAppCtrl = nifiCanvasAppCtrl;
        $scope.ServiceProvider = ServiceProvider;
    }

    NifiCanvasAppCtrl.$inject=['ServiceProvider', '$scope', '$rootScope'];

    return NifiCanvasAppCtrl;
});