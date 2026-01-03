// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1143
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

    const selector = '.ant-spin-container > :first-child';

    function addForm(targetElement) {
        const formHTML = `
            <form style="margin: 20px; padding: 10px; border: 1px solid #ccc;">
                <label for="customInput">Custom Input: </label>
                <input id="customInput" name="productId" />
                <button type="submit">Submit</button>
            </form>
        `;

        targetElement.insertAdjacentHTML('afterbegin', formHTML);
        console.log('Form added to', selector);
    }

    function getElement() {
        return querySelector(selector);
    }

    // Check immediately
    let targetElement = getElement();
    if (targetElement) {
        addForm(targetElement);
    } else {
        console.log('Setting up observer for', selector);
        const observer = new MutationObserver((mutations) => {
            console.log('Mutations:', mutations.length, 'detected');
            console.log('Mutation detected');
            setTimeout(() => {
                targetElement = getElement();
                console.log(querySelector(".ant-spin-container"))
                if (targetElement) {
                    addForm(targetElement);
                    observer.disconnect();
                    console.log('Observer disconnected');
                }
            }, 100);
        });
        observer.observe(body, { childList: true, subtree: true });
    }
})();