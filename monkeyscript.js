// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1331
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

    function injectOnSelector(selector, content) {
        let added = false;
        let timeout;

        function add(fn) {
            if (added) return;
            const el = document.querySelector(selector);
            if (!el) return;
            if (typeof content === 'function') {
                content(el);
            } else {
                el.insertAdjacentHTML('afterbegin', content);
            }
            added = true;
            fn?.();
        }

        add();
        if (!added) {
            const observer = new MutationObserver(() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    add(() => observer.disconnect());
                }, 500);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    const formHTML = `
        <form style="margin: 20px; padding: 10px; border: 1px solid #ccc;display: flex;">
            <label for="customInput">Search: </label>
            <input id="customInput" name="productId" class="ant-btn css-1xl6mxb ant-btn-text ant-btn-color-default ant-btn-variant-text" style="display: flex; height: 2.25rem; padding: 0.5rem 1rem; align-items: center; justify-content: center; border-radius: 0.5rem; border: 1px solid #020617; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out; background-color: white; color: #020617;" />
            <button type="submit">Submit</button>
        </form>
    `;

    injectOnSelector('.ant-spin-container > :first-child', formHTML);

    injectOnSelector('.ant-spin-container', el => {
        el.style.cssText += "display: flex; flex-direction: column";
        if (el.children[1]) el.children[1].style.cssText += "overflow: auto; height 1000px";
    });
})();