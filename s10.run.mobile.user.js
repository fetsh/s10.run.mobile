// ==UserScript==
// @name S10.run mobile theme
// @namespace https://s10.run
// @description Makes s10 on mobile devices a little bit more useable
// @author fetsh
// @version 0.1
// @encoding utf-8
// @homepage https://github.com/fetsh/s10.run.mobile/
// @supportURL https://github.com/fetsh/s10.run.mobile/issues
// @updateURL https://raw.githubusercontent.com/fetsh/s10.run.mobile/master/s10.run.mobile.user.js
// @downloadURL https://raw.githubusercontent.com/fetsh/s10.run.mobile/master/s10.run.mobile.user.js
// @include      /https://s10.run/\?\d+&mobile.*/
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_log
// @run-at document-start

(function (window) {
    "use strict";

    var S10 = {
        name: 'S10.run mobile theme',
        version: '0.1',
        downloadURL: 'https://raw.githubusercontent.com/fetsh/s10.run.mobile/master/s10.run.mobile.user.js',

        initialize: function () {
            S10.checkUpdate(true); // check if S10Script is up to date.
        },
        getVersion: function () {
            return Number(S10.version);
        },
        setValue: function (name, value) {
            if (typeof GM_setValue !== "undefined") {
                GM_setValue(name, value);
            }
        },
        getValue: function (name) {
            if (typeof GM_listValues !== "undefined" && !name) {
                var list = {};
                var vals = GM_listValues();
                for (var i in vals) {
                    if (vals.hasOwnProperty(i))
                        list[vals[i]] = GM_getValue(vals[i]);
                }
                return list;
            } else if (typeof GM_getValue !== "undefined" && typeof GM_getValue(name) !== "undefined") {
                return GM_getValue(name);
            } else {
                return null;
            }
        },
        onEvent: function (element, type, listener, bubbles) {
            if (window.addEventListener) { // For all major browsers, except IE 8 and earlier
                (element || window).addEventListener(type, listener, bubbles || false);
            } else { // For IE 8 and earlier versions
                (element || window).attachEvent('on' + type, listener);
            }
            return arguments;
        },
        ready: function (callback) {
            S10.onEvent(window, 'load', callback);
        },
        checkUpdate: function (auto) {

            var check = function (notifyFalse) {
                S10.request({
                    url: S10.downloadURL,
                    onload: function (response) {
                        var res = response.responseText;
                        var status = response.status;
                        if (status == 200) {
                            var local = S10.getVersion();
                            var remote = Number(res.match(/@version\s+(\d+\.\d+)/)[1]);
                            if (local < remote) {
                                S10.notification('S10 mobile version ' + remote + ' is available <a target="_blank" href="' + S10.downloadURL + '">Install</a>.');
                            } else if (notifyFalse) {
                                S10.notification('No update found.');
                            }
                        }
                    }
                });
            };

            if (auto) { // auto mode
                S10.ready(function () {
                    S10.schedule(7, 'nextcheckupdate', function () {
                        check(false);
                    });
                });
            } else { // manual mode
                check(true);
            }

        },
        schedule: function (days, name, callback) {
            window.setTimeout(function () {
                var later = isNaN(S10.getValue(name)) ? 1 : Number(S10.getValue(name));
                var now = new Date().getTime();
                if (later < now) {
                    S10.setValue(name, (now + (days * 24 * 60 * 60 * 1000)).toString());
                    callback();
                }
            }, 1e3);
        },
        notification: function (message, delay) {
            console.log(message)
            // // remove old notification
            // Aak.removeElement('#aak-notice-frame');

            // // add new notification
            // Aak.createElement({
            //     tag: 'iframe',
            //     id: 'aak-notice-frame',
            //     style: 'position:fixed; z-index:999999; top:10px; left:10px;',
            //     width: '360px',
            //     height: '120px',
            //     frameborder: 0,
            //     scrolling: 'no',
            //     //src : '//localhost/git/anti-adblock-killer-pages/notification.html#' + btoa(message),
            //     src: '//reek.github.io/anti-adblock-killer/notification.html#' + window.btoa(message),
            //     append: 'body',
            //     callback: function (self) {

            //         // manually remove
            //         Aak.onEvent(window, "message", function (event) {
            //             if (event.data == "removeNotification") {
            //                 self.remove();
            //             }
            //         }, false);

            //         // automatically remove
            //         window.setTimeout(function () {
            //             self.remove();
            //         }, delay || 3e4);
            //     }
            // });
        },
    };

    S10.initialize();

})(window);