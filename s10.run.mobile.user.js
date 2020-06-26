// ==UserScript==
// @name S10.run mobile theme
// @namespace https://s10.run
// @description Makes s10 on mobile devices a little bit more useable
// @author fetsh
// @version 0.7
// @encoding utf-8
// @homepage https://github.com/fetsh/s10.run.mobile/
// @supportURL https://github.com/fetsh/s10.run.mobile/issues
// @updateURL https://raw.githubusercontent.com/fetsh/s10.run.mobile/master/s10.run.mobile.user.js
// @downloadURL https://raw.githubusercontent.com/fetsh/s10.run.mobile/master/s10.run.mobile.user.js
// @include      /https://s10.run/\?\d+&mobile.*/
// @grant GM_addStyle
// @grant GM_log
// @run-at document-start
// ==/UserScript==


(function (window) {
    "use strict";

    var S10 = {
        name: 'S10.run mobile theme',
        initialize: function () {
            S10.addMeta();
            S10.resolveStyles();
            S10.onEvent(window, 'DOMContentLoaded', S10.removeElements);
            S10.onEvent(window, 'DOMContentLoaded', S10.changeThings);
        },
        addStyle: function (css) {
            css = css.replace(/;/g, ' !important;');
            if (typeof GM_addStyle != 'undefined') {
                GM_addStyle(css);
            } else {
                document.head.appendChild(document.createElement('style')).innerHTML = css;
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
        resolveStyles: function () {
            S10.addStyle("@media (max-width: 768px) { div.container nav.navbar.navbar-inverse.bottom-nav.navbar-fixed-bottom { display: none; } }")
            S10.addStyle("@media (max-width: 768px) { .training__label { font-weight: 300; } }")
            S10.addStyle("@media (max-width: 768px) { .training__date .training__label { white-space: nowrap; } }")
            S10.addStyle("@media (max-width: 768px) { .training__date {text-align: left; width: 33%; } }")
            S10.addStyle("@media (max-width: 768px) { .training__info {text-align: left; width: 67%; margin-bottom: 20px; padding: 0px; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-6 + .col-xs-3 {width: 0%; margin: 0px; padding: 0px;} }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3 .training__statistics__table:before {content: '\\2714'; color: orange; font-weight: bold; position: absolute; top: -2px; right: 0px; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3.training__statistics .training__statistics__table:before {right: 15px; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3 .training__statistics__table thead {display: none; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3 .training__statistics__table tbody {display: none; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3 .training__statistics .training__label { position: absolute; right: 20px; top: 2px; white-space: nowrap; font-size: 14px; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3.training__statistics .training__label { color: orange; position: absolute; right: 35px; top: 2px; white-space: nowrap; font-size: 14px; } }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3 form {display: none;} }")
            S10.addStyle("@media (max-width: 768px) { div.row.training .col-xs-3 .training__statistics__tracker {display: none;} }")
            S10.addStyle("@media (max-width: 768px) { nav.navbar .navbar-collapse {display: none;} }")
            S10.addStyle("@media (max-width: 768px) { nav.navbar button {display: none;} }")
            S10.addStyle("@media (max-width: 768px) { nav.navbar button.logoutButton {display: inline; position: relative; float: right; margin-right: 15px;} }")
            S10.addStyle("@media (max-width: 768px) { .training.seven-cols .col-sm-1 br {display: none;} }")
            S10.addStyle("@media (max-width: 768px) { div.row.training.seven-cols div:last-child { bottom: 7px; } }")

            S10.addStyle("body > div.container > div.row > div.col-xs-12 { display: none; }")
            S10.addStyle("div#divschart { display: none; }")
            S10.addStyle("nav.navbar { margin-bottom: 0px; }")
            S10.addStyle("div#chat {display: none;}")
            S10.addStyle("div.row.training { padding: 15px; }")
            S10.addStyle("div.row.training.seven-cols div:last-child { bottom: 19px; }")
            S10.addStyle(".training__info:not(:last-child):after {display: none;}")
            S10.addStyle(".row > .row {margin: 0px;}")
            S10.addStyle(".training__content__date {font-size:13px;}")
            S10.addStyle(".training__response {margin-top:10x;}")
            S10.addStyle(".training__response-text {padding:10x;}")
            S10.addStyle(".training--current .training__info .row:first-child {display: none;}")
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
        removeElements: function () {
            var chartsButton = document.evaluate("//div[@class='row training'][div[@class='col-xs-12']]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            chartsButton.remove();
            var divschart = document.evaluate("//div[@id='divschart']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            divschart.remove();
            var chat = document.evaluate("//div[@id='chat']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            chat.remove();
        },
        changeThings: function () {
            var response_buttons = document.getElementsByClassName('pull-left training__response--send')
            for (let item of response_buttons) {
                item.textContent = "Отправить"
            }

            var a = setInterval(function () {
                if (typeof jQuery === "undefined") {
                    console.log("jQ NOT loaded");
                } else {
                    clearInterval(a);

                    var logout_button = $("#bs-example-navbar-collapse-1 .navbar-right li:last-child button");
                    logout_button.prependTo($(".navbar-header"));
                    logout_button.addClass("logoutButton")

                }
            }, 100);

        }
    };

    S10.initialize();

})(window);