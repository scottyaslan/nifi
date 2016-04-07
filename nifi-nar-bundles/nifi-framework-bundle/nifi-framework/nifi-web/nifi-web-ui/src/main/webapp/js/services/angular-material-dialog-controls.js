define([], function() {
    'use strict';

    function AngularMaterialDialog(ServiceProvider, $mdDialog) {
        function AngularMaterialDialog() {
            this.dialogTemplateUrl;
            this.dialogTitle;
        };
        AngularMaterialDialog.prototype = {
            constructor: AngularMaterialDialog,
            init: function(dialogTemplateUrl) {
                if(dialogTemplateUrl){
                    AngularMaterialDialog.dialogTemplateUrl = dialogTemplateUrl;
                }
                if(ServiceProvider.AngularMaterialDialog === undefined){
                    ServiceProvider.add('AngularMaterialDialog', AngularMaterialDialog);
                }
            },
            openDialog: function(dialogTitle, ev) {
                AngularMaterialDialog.dialogTitle = dialogTitle;
                $mdDialog.show({
                    controller: 'ControllerWrapper',
                    templateUrl: AngularMaterialDialog.dialogTemplateUrl,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    escapeToClose: false
                }).then(function(answer) {}, function() {});
            },
            hideDialog: function() {
                $mdDialog.hide();
            },
            cancelDialog: function() {
                $mdDialog.cancel();
            },
            answerDialog: function(answer) {
                $mdDialog.hide(answer);
            }
        };
        var AngularMaterialDialog = new AngularMaterialDialog();
        AngularMaterialDialog.init();
        return AngularMaterialDialog;
    }

    AngularMaterialDialog.$inject=['ServiceProvider', '$mdDialog'];

    return AngularMaterialDialog;
});