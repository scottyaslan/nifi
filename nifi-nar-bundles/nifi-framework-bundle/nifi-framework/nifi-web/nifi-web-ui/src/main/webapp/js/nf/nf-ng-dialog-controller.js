/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global nf, d3 */
nf.ng.DialogCtrl = (function () {

    function DialogCtrl($scope, $mdDialog, serviceProvider) {
        // function DialogCtrl() {
        // };
        // DialogCtrl.prototype = {
        //     constructor: DialogCtrl,

        //     /**
        //      *  Register the dialog controller.
        //      */
        //     register: function () {
        //         if (serviceProvider.dialogCtrl === undefined) {
        //             serviceProvider.register('dialogCtrl', dialogCtrl);
        //         }
        //     },

        //     /**
        //      * Open the dialog.
        //      *
        //      * @param {string} path      The path to the view of the dialog.
        //      * @param {object} ev        The event object that launched the dialog.
        //      */
        //     openDialog: function(confipath, ev) {
        //         $mdDialog.show({
        //             controller: 'ngCtrlWrapper',
        //             templateUrl: path,
        //             parent: angular.element(document.body),
        //             targetEvent: ev
        //         }).then(function(answer) {}, function() {});
        //     },

        //     /**
        //      *  Hide the dialog.
        //      */
        //     hideDialog: function() {
        //         $mdDialog.hide();
        //     },

        //     /**
        //      *  Cancel the dialog.
        //      */
        //     cancelDialog: function() {
        //         $mdDialog.cancel();
        //     },

        //     /**
        //      *  Answer the dialog.
        //      */
        //     answerDialog: function(answer) {
        //         $mdDialog.hide(answer);
        //     }
        // };
        // var dialogCtrl = new DialogCtrl();
        // dialogCtrl.register();
        $scope.appCtrl = {
            serviceProvider: serviceProvider
        }
    }

    DialogCtrl.$inject = ['$scope', '$mdDialog', 'serviceProvider'];

    return DialogCtrl;
}());