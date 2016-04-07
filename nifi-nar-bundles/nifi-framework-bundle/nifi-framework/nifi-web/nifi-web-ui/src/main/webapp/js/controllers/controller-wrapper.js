define([], function() {
    'use strict';

    function ControllerWrapper($scope, AngularMaterialDialogControls, ServiceProvider) {
        $scope.AngularMaterialDialogControls = AngularMaterialDialogControls;
        $scope.ServiceProvider = ServiceProvider;
    }

    ControllerWrapper.$inject=['$scope', 'AngularMaterialDialogControls', 'ServiceProvider'];

    return ControllerWrapper;
});