'use strict';

(function () {
  var severityLevelToStyle = {};
  severityLevelToStyle[window.SeverityLevel.SUCCESS] = 'background-color: green; color: white; border-color: white;';
  severityLevelToStyle[window.SeverityLevel.ERROR] = 'background-color: gold; color: black; border-color: black;';

  window.showMessage = function (messageText, severityLevel) {
    severityLevel = severityLevel || window.SeverityLevel.SUCCESS;
    var node = document.createElement('div');
    node.style = severityLevelToStyle[severityLevel] + 'z-index: 100; width: 300px; padding: 15px; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);';
    node.style.position = 'fixed';
    node.style.border = '2px solid';
    node.style.borderRadius = '5px';
    node.style.boxShadow = '5px 5px 10px 0 gray';
    node.textContent = messageText;
    document.body.appendChild(node);
    setTimeout(function () {
      document.body.removeChild(node);
    }, 3000);
  };
})();
