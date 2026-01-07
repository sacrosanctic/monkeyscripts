// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1365
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
            let timeout;
            const observer = new MutationObserver(() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const mutations = observer.takeRecords();
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && node.matches(selector)) {
                                applyContent(node);
                            }
                        });
                    });
                }, 500);
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
                    timeout = setTimeout(() => {                        add(() => observer.disconnect());
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
    // Process existing spans
    const existingSpans = document.querySelectorAll('.ant-table-row.ant-table-row-level-0 td:nth-child(8) > span');
    console.log('Processing existing spans:', existingSpans.length);
    existingSpans.forEach(span => {
      const productId = span.innerHTML.split(" ")[0];
      span.innerHTML = `<a href="/request-payment?productId=${productId}">${span.innerHTML}</a>`;
    });

    // Observe for new spans
    const tableObserver = new MutationObserver(mutations => {
      console.log('Mutation observed:', mutations);
      mutations.forEach(mutation => {
        if (mutation.type === 'characterData' && mutation.target.parentElement && mutation.target.parentElement.matches('td:nth-child(8) > span')) {
          const span = mutation.target.parentElement;
          console.log('CharacterData on span, innerHTML:', span.innerHTML);
          const productId = span.innerHTML.split(" ")[0];
          span.innerHTML = `<a href="/request-payment?productId=${productId}">${span.innerHTML}</a>`;
          console.log('Modified to:', span.innerHTML);
        }
        mutation.addedNodes.forEach(node => {
          console.log('Added node:', node);
          if (node.nodeType === 1) {
            if (node.matches('td:nth-child(8) > span')) {
              console.log('Span matched, innerHTML:', node.innerHTML);
              const productId = node.innerHTML.split(" ")[0];
              node.innerHTML = `<a href="/request-payment?productId=${productId}">${node.innerHTML}</a>`;
              console.log('Modified to:', node.innerHTML);
            }
            // Check descendants
            node.querySelectorAll && node.querySelectorAll('td:nth-child(8) > span').forEach(span => {
              console.log('Descendant span found, innerHTML:', span.innerHTML);
              const productId = span.innerHTML.split(" ")[0];
              span.innerHTML = `<a href="/request-payment?productId=${productId}">${span.innerHTML}</a>`;
              console.log('Descendant modified to:', span.innerHTML);
            });
          }
        });
      });
    });

    const existingTable = document.querySelector('.ant-table-container');
    console.log('Existing table element:', existingTable);
    if (existingTable) {
      tableObserver.observe(existingTable, { childList: true, subtree: true, characterData: true });
    } else {
      // Wait for table to be added
      const tableWaitObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.matches('.ant-table-container')) {
                console.log('Table added:', node);
                tableWaitObserver.disconnect();
                tableObserver.observe(node, { childList: true, subtree: true, characterData: true });
                return;
              }
              // Check descendants
              const table = node.querySelector('.ant-table-container');
              if (table) {
                console.log('Table found in descendants:', table);
                tableWaitObserver.disconnect();
                tableObserver.observe(table, { childList: true, subtree: true, characterData: true });
                return;
              }
            }
          });
        });
      });
      tableWaitObserver.observe(document.body, { childList: true, subtree: true });
    }
})();