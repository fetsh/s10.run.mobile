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
// @grant GM_xmlhttpRequest
// @grant GM_log
// @run-at document-start
// ==/UserScript==


(function (window) {
    "use strict";

    var S10 = {
        name: 'S10.run mobile theme',
        version: '0.1',
        downloadURL: 'https://raw.githubusercontent.com/fetsh/s10.run.mobile/master/s10.run.mobile.user.js',

        initialize: function () {
            S10.addMeta();
            S10.onEvent(window, 'DOMContentLoaded', S10.addNavBar);

            // S10.checkUpdate(true); // check if S10Script is up to date.

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
        decodeURI: function (str) {
            return decodeURIComponent(str);
        },
        encodeURI: function (str) {
            return encodeURIComponent(str);
        },
        encodeHTML: function (str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },
        decodeHTML: function (str) {
            return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
        },
        serialize: function (obj) {
            if (typeof obj == 'object') {
                var arr = [];
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        arr.push(prop + '=' + S10.encodeURI(obj[prop]));
                }
                return arr.join('&');
            }
            return obj;
        },
        unserialize: function (str) {
            str = S10.decodeHTML(str);
            var arr = str.split('&');
            var obj = {};
            arr.forEach(function (entry) {
                if (entry !== '' && entry.split('=')) {
                    var splits = entry.split('=');
                    obj[splits[0]] = S10.decodeURI(splits[1]);
                }
            });
            return obj;
        },
        unsetProperties: function (obj, props) {
            props = (typeof props == 'string') ? props.split(',') : props;
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (obj.hasOwnProperty(prop)) {
                    delete obj[prop];
                }
            }
            return obj;
        },
        setProperties: function (obj1, obj2) {
            for (var prop in obj2) {
                if (obj2.hasOwnProperty(prop))
                    obj1[prop] = obj2[prop];
            }
            return obj1;
        },
        request: function (settings) {
            settings.url = settings.url || '';
            settings.method = settings.method || 'GET';
            settings.headers = settings.headers || {};
            settings.timeout = settings.timeout || 2e4; // 20s
            if (settings.data || settings.method == 'POST') {
                settings.method = 'POST';
                settings.data = S10.serialize(settings.data || {});
                settings.headers = S10.setProperties(settings.headers, {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
            }

            // override to integrate log
            settings._onload = settings.onload;
            settings.onload = function (xhr) {
                console.log('S10 xhr', xhr);
                settings._onload(xhr);
            };

            // Request with GM API
            // doc: http://tinyurl.com/2t7wbr
            GM_xmlhttpRequest(settings);

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
            // S10.removeElement('#S10-notice-frame');

            // // add new notification
            // S10.createElement({
            //     tag: 'iframe',
            //     id: 'S10-notice-frame',
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
            //         S10.onEvent(window, "message", function (event) {
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
        addMeta: function () {
            // <meta http-equiv="X-UA-Compatible" content="IE=edge">
            // <meta name="viewport" content="width=device-width, initial-scale=1">
            var meta1 = document.createElement('meta');
            meta1.httpEquiv = "X-UA-Compatible";
            meta1.content = "IE=edge";
            var meta2 = document.createElement('meta');
            meta2.name = "viewport";
            meta2.content = "width=device-width, initial-scale=1";
            document.getElementsByTagName('head')[0].appendChild(meta1);
            document.getElementsByTagName('head')[0].appendChild(meta2);
        },
        addNavBar: function () {
            var nav = document.createElement('nav');
            nav.setAttribute("class", 'navbar navbar-default navbar-fixed-top navbar-inverse');
            nav.setAttribute("role", 'navigation')
            nav.innerHTML = "<div class='container-fluid'><div class='navbar-header'><button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'><span class='sr-only'>Toggle navigation</span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span></button><a class='navbar-brand' href='/'>s10</a></div><div class='navbar-collapse collapse'><ul class='nav navbar-nav '></ul><ul class='nav navbar-nav navbar-right'><li><p class='navbar-text'>@fetshme (Ilia Zemskov)</p></li><li><a rel='nofollow' data-method='delete' href='/'>Log Out</a></li></ul></div></div>"
            document.body.appendChild(nav);
        }
    };

    S10.initialize();

})(window);