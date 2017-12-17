'use strict';

(function () {
  window.showMessage = function (messageText) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; width: 300px; padding: 15px; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);';
    node.style.position = 'fixed';
    node.style.color = 'black';
    node.style.backgroundColor = 'gold';
    node.style.border = '2px solid black';
    node.style.borderRadius = '5px';
    node.style.boxShadow = '5px 5px 10px 0';
    node.textContent = messageText;
    document.body.appendChild(node);
    setTimeout(function () {
      document.body.removeChild(node);
    }, 3000);
  };
})();
