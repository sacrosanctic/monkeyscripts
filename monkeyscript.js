// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1358
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

    function inject(options) {
        const { selector, content, multiple = false } = options;

        function applyContent(el) {
            if (typeof content === 'function') {
                content(el);
            } else {
                el.insertAdjacentHTML('afterbegin', content);
            }
        }

        if (multiple) {
            // Process existing elements
            document.querySelectorAll(selector).forEach(applyContent);

            // Observe for new elements
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches(selector)) {
                            applyContent(node);
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            // Original single-element logic
            let added = false;
            let timeout;

            function add(fn) {
                if (added) return;
                const el = document.querySelector(selector);
                if (!el) return;
                applyContent(el);
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
    }

    const formHTML = `
        <form style="height: 2.25rem; padding: 0.5rem 1rem; border: 1px solid #020617; border-radius: 0.5rem; display: flex; align-items: center; background-color: white; color: #020617;">
            <label for="customInput">Search: </label>
            <input id="customInput" name="productId" style="padding-left:4px;outline:none;" />
            <button type="submit">Submit</button>
        </form>
    `;

    // add search box
    inject({ selector: '.ant-spin-container > :first-child', content: formHTML });

    // force fixed height
    // todo: better to have adaptive height with flex
    inject({ selector: '.ant-spin-container', content: el => {
        if( el.children[1]) el.children[1].style.cssText += "overflow: auto; height: 800px;";
    } });

    // the table is catching the overflow at the wrong spot
    inject({ selector: '.ant-table-content', content: el => el.style.overflow = "visible" })

    // add links where none exists
    inject({ selector: '.ant-table-row.ant-table-row-level-0', content: el => {
      const span = el.querySelector("td:nth-child(8) > span");
      if (!span) return

      const productId = span.innerHTML.split(" ")[0];
      span.innerHTML = `<a href="/request-payment?productId=${productId}">${span.innerHTML}</a>`;
    }, multiple: true });
})();