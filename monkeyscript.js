// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1124
// @description  try to take over the world!
// @author       You
// @match        https://payment.xinchuan.tw/request-payment
// @match        http://localhost:5173/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @updateURL    https://raw.githubusercontent.com/sacrosanctic/monkeyscripts/main/monkeyscript.js
// @downloadURL  https://raw.githubusercontent.com/sacrosanctic/monkeyscripts/main/monkeyscript.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addForm() {
        const targetElement = document.querySelector('.ant-spin-container > :first-child');
        if (!targetElement) {
            console.log('Target element .ant-spin-container > :first-child not found');
            return;
        }

        const formHTML = `
            <form style="margin: 20px; padding: 10px; border: 1px solid #ccc;">
                <label for="customInput">Custom Input: </label>
                <input id="customInput" name="productId" />
                <button type="submit">Submit</button>
            </form>
        `;

        targetElement.insertAdjacentHTML('afterbegin', formHTML);
    }

    // Check immediately
    addForm();

    // If not found, wait for it with MutationObserver
    if (!document.querySelector('.ant-spin-container > :first-child')) {
        const observer = new MutationObserver(() => {
            if (document.querySelector('.ant-spin-container > :first-child')) {
                observer.disconnect();
                addForm();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();