// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1353
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

    function inject(selector, content) {
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
        <form style="height: 2.25rem; padding: 0.5rem 1rem; border: 1px solid #020617; border-radius: 0.5rem; display: flex; align-items: center; background-color: white; color: #020617;">
            <label for="customInput">Search: </label>
            <input id="customInput" name="productId" style="padding-left:4px" />
            <button type="submit">Submit</button>
        </form>
    `;

    inject('.ant-spin-container > :first-child', formHTML);

    inject('.ant-spin-container', el => {
        el.style.cssText += "display: flex; height: 100%; flex-direction: column;";
        el.children?.[1]?.style.cssText += "overflow: auto; height: 800px;";
    });
    inject('.ant-table-row.ant-table-row-level-0', el=>{
      console.log(el)
      console.log(el.querySelector("td:nth-child(8)"))
    });

    inject('.ant-table-content',el=>el.style.overflow="visible")
})();