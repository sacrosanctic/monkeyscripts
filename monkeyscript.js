// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1258
// @description  try to take over the world!
// @author       You
// @match        https://payment.xinchuan.tw/request-payment*
// @match        http://localhost:5173/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @updateURL    https://raw.githubusercontent.com/sacrosanctic/monkeyscripts/main/monkeyscript.js
// @downloadURL  https://raw.githubusercontent.com/sacrosanctic/monkeyscripts/main/monkeyscript.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function injectOnSelector(selector, html) {
        let added = false;

        function add() {
            if (added) return;
            const el = document.querySelector(selector);
            if (el) {
                el.insertAdjacentHTML('afterbegin', html);
                added = true;
            }
        }

        add();
        if (!added) {
            const observer = new MutationObserver(() => {
                requestAnimationFrame(() => {
                    add();
                    if (added) observer.disconnect();
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    const formHTML = `
        <form style="margin: 20px; padding: 10px; border: 1px solid #ccc;display: flex;">
            <label for="customInput">Search: </label>
            <input id="customInput" name="productId" style="height: 2em;" />
            <button type="submit">Submit</button>
        </form>
    `;

    injectOnSelector('.ant-spin-container > :first-child', formHTML);

    // Add more injections here, e.g.:
    // injectOnSelector('another-selector', anotherHTML);
})();