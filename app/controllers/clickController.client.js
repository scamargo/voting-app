'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var questionInput = document.querySelector("#question");
   var apiUrl = appUrl + '/api/:id/clicks';
   var addPollButton = document.querySelector('#add-poll'); //TODO: add question value
   var pollUrl = appUrl + '/api/:id/polls';

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }
   
   function updatePolls (data) {
      var pollsObject = JSON.parse(data);
      //clickNbr.innerHTML = clicksObject.clicks;
      alert(JSON.stringify(pollsObject));
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);
   
   addPollButton.addEventListener('click', function () {
      
      var urlWithQuery = pollUrl + '?question=' + questionInput.value;

      ajaxFunctions.ajaxRequest('POST', urlWithQuery, function () {
         
         //alert("added poll");
         ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls);
      });

   }, false);

})();
