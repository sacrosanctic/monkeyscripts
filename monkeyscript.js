// ==UserScript==
// @name         Monkey Script for Payment
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1113
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

    const targetElement = document.querySelector('.ant-spin-container');

    if (!targetElement) return;

    // 2. Fetch the form HTML
    fetch('https://raw.githubusercontent.com/sacrosanctic/monkeyscripts/main/form.html')
        .then(response => response.text())
        .then(formHTML => {
            // 3. Insert the form as the first child of the target element
            targetElement.insertAdjacentHTML('afterbegin', formHTML);

            // 4. Add functionality to your new form
            document.getElementById('submitBtn').addEventListener('click', (e) => {
                e.preventDefault();
                const val = document.getElementById('customInput').value;
                alert('Form submitted with: ' + val);
            });
        })
        .catch(error => console.error('Error loading form:', error));
})();