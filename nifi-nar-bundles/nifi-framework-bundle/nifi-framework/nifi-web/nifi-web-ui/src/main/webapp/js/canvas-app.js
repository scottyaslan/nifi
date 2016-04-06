define(['nf-storage',
        'nf-common',
        'nf-canvas',
        'nf-universal-capture',
        'nf-shell',
        'jquery.qtip',
        'jquery.modal',
        'jquery-ui',
        'jquery.nfeditor'],
    function(nfStorage,
             nfCommon,
             nfCanvas,
             nfUniversalCapture,
             nfShell) {
        $(document).ready(function () {
            // include jwt when possible
            $.ajaxSetup({
                'beforeSend': function(xhr) {
                    var hadToken = nfStorage.hasItem('jwt');

                    // get the token to include in all requests
                    var token = nfStorage.getItem('jwt');
                    if (token !== null) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    } else {
                        // if the current user was logged in with a token and the token just expired, cancel the request
                        if (hadToken === true) {
                            return false;
                        }
                    }
                }
            });


            // preload the image for the error page - this is preloaded because the system
            // may be unavailable to return the image when the error page is rendered
            var imgSrc = 'images/bg-error.png';
            $('<img/>').attr('src', imgSrc).on('load', function () {
                $('div.message-pane').css('background-image', imgSrc);
            });

            // mouse over for links
            $(document).on('mouseenter', 'span.link', function () {
                $(this).addClass('link-over');
            }).on('mouseleave', 'span.link', function () {
                $(this).removeClass('link-over');
            });

            // setup custom checkbox
            $(document).on('click', 'div.nf-checkbox', function () {
                var checkbox = $(this);
                if (checkbox.hasClass('checkbox-unchecked')) {
                    checkbox.removeClass('checkbox-unchecked').addClass('checkbox-checked');
                } else {
                    checkbox.removeClass('checkbox-checked').addClass('checkbox-unchecked');
                }
            });

            // show the loading icon when appropriate
            $(document).ajaxStart(function () {
                // show the loading indicator 
                $('div.loading-container').addClass('ajax-loading');
            }).ajaxStop(function () {
                // hide the loading indicator 
                $('div.loading-container').removeClass('ajax-loading');
            });

            // initialize the tooltips
            $('img.setting-icon').qtip(nfCommon.config.tooltipConfig);

            // shows the logout link in the message-pane when appropriate and schedule token refresh
            if (nfStorage.getItem('jwt') !== null) {
                $('#user-logout-container').css('display', 'block');
                nfCommon.scheduleTokenRefresh();
            }

            // handle logout
            $('#user-logout').on('click', function () {
                nfStorage.removeItem('jwt');
                window.location = '/nifi/login';
            });

            // handle home
            $('#user-home').on('click', function () {
                if (top !== window) {
                    parent.window.location = '/nifi';
                } else {
                    window.location = '/nifi';
                }
            });

            // setup general button mouse behavior
            nfCommon.addHoverEffect('div.button', 'button-normal', 'button-over');

            // configure the ok dialog
            $('#nf-ok-dialog').modal({
                handler: {
                    close: function () {
                        // clear the content
                        $('#nf-ok-dialog-content').empty();
                    }
                }
            }).draggable({
                containment: 'parent',
                handle: '.dialog-header'
            });

            // configure the yes/no dialog
            $('#nf-yes-no-dialog').modal({
                handler: {
                    close: function () {
                        // clear the content and reset the button model
                        $('#nf-yes-no-dialog-content').empty();
                        $('#nf-yes-no-dialog').modal('setButtonModel', []);
                    }
                }
            }).draggable({
                containment: 'parent',
                handle: '.dialog-header'
            });
        });

        // configure the dialog
        $('#shell-dialog').modal({
            overlayBackground: true
        });

        // register a listener when the frame is closed
        $('#shell-close-button').click(function () {
            // close the shell
            $('#shell-dialog').modal('hide');
        });

        // register a listener when the frame is undocked
        $('#shell-undock-button').click(function () {
            var uri = $('#shell-iframe').attr('src');
            if (!nfCommon.isBlank(uri)) {
                // open the page and close the shell
                window.open(uri);

                // close the shell
                $('#shell-dialog').modal('hide');
            }
        });

        // add hover effects
        nfCommon.addHoverEffect('#shell-undock-button', 'undock-normal', 'undock-hover');
        nfCommon.addHoverEffect('#shell-close-button', 'close-normal', 'close-hover');

        // setup a listener to ensure keystrokes are being overridden in a consistent manner
        $(window).on('keydown', function (evt) {
            // consider escape, before checking dialogs
            var isCtrl = evt.ctrlKey || evt.metaKey;
            if (!isCtrl && evt.keyCode === 27) {
                // esc

                // prevent escape when editing a property with allowable values - that component does not handle key
                // events so it can bubble up to here. once here we are unable to cancel the current edit so we simply
                // return. this is not an issue for viewing in read only mode as the table is not in an edit mode. this
                // is not an issue for other fields as they can handle key events locally and cancel the edit appropriately
                var visibleCombo = $('div.value-combo');
                if (visibleCombo.is(':visible') && visibleCombo.parent().hasClass('combo-editor')) {
                    return;
                }

                // consider property detail dialogs
                if ($('div.property-detail').is(':visible')) {
                    nfUniversalCapture.removeAllPropertyDetailDialogs();

                    // prevent further bubbling as we're already handled it
                    evt.stopImmediatePropagation();
                    evt.preventDefault();
                } else {
                    var target = $(evt.target);
                    if (target.length) {
                        // special handling for body as the target
                        var cancellables = $('.cancellable');
                        if (cancellables.length) {
                            var zIndexMax = null;
                            var dialogMax = null;

                            // identify the top most cancellable
                            $.each(cancellables, function (_, cancellable) {
                                var dialog = $(cancellable);
                                var zIndex = dialog.css('zIndex');

                                // if the dialog has a zIndex consider it
                                if (dialog.is(':visible') && (zIndex !== null && typeof zIndex !== 'undefined')) {
                                    zIndex = parseInt(zIndex, 10);
                                    if (zIndexMax === null || zIndex > zIndexMax) {
                                        zIndexMax = zIndex;
                                        dialogMax = dialog;
                                    }
                                }
                            });

                            // if we've identified a dialog to close do so and stop propagation
                            if (dialogMax !== null) {
                                // hide the cancellable
                                if (dialogMax.hasClass('modal')) {
                                    dialogMax.modal('hide');
                                } else {
                                    dialogMax.hide();
                                }

                                // prevent further bubbling as we're already handled it
                                evt.stopImmediatePropagation();
                                evt.preventDefault();

                                return;
                            }
                        }

                        // now see if we're in a frame
                        if (top !== window) {
                            // and our parent has shell defined
                            if (typeof parent.nf !== 'undefined' && typeof parent.nfShell !== 'undefined') {
                                parent.$('#shell-close-button').click();

                                // prevent further bubbling as we're already handled it
                                evt.stopImmediatePropagation();
                                evt.preventDefault();

                                return;
                            }
                        }
                    }
                }
            } else {
                if (isCtrl) {
                    if (evt.keyCode === 82) {
                        // ctrl-r
                        evt.preventDefault();
                    }
                } else {
                    if (!$('input, textarea').is(':focus') && (evt.keyCode == 8 || evt.keyCode === 46)) {
                        // backspace or delete
                        evt.preventDefault();
                    }
                }
            }
        });

        if (nfCanvas.SUPPORTS_SVG) {
            // initialize the NiFi
            nfCanvas.init(nfStorage);
        } else {
            $('#message-title').text('Unsupported Browser');
            $('#message-content').text('Flow graphs are shown using SVG. Please use a browser that supports rendering SVG.');

            // show the error pane
            $('#message-pane').show();

            // hide the splash screen
            nfCanvas.hideSplash();
        }
    }
);