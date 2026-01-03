// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1112
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

    // 1. Identify the element you want to follow
    // Change '.target-selector' to the class, ID, or tag of the existing element
    const targetElement = document.querySelector('.ant-spin-container');

    if (targetElement) {
        // 2. Define your form HTML
        const formHTML = `
            <form action="/request-payment" style="margin: 20px; padding: 10px; border: 1px solid #ccc;">
                <label for="customInput">Custom Input: </label>
			    <input id="customInput" name="productId" />
			    <button id="submitBtn" type="submit">Submit</button>
		    </form>
        `;

        // 3. Insert the form as the first child of the target element
        targetElement.insertAdjacentHTML('afterbegin', formHTML);

        // 4. Add functionality to your new form
        document.getElementById('submitBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const val = document.getElementById('customInput').value;
            alert('Form submitted with: ' + val);
        });
    }
})();