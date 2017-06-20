//TODO: debug save button

'use strict';

(function () {

   var questionInput = document.querySelector("#question");
   var pollUrl = appUrl + '/api/:id/polls';
   var pollOptions = document.querySelector('.option');
   var savePollButton = document.querySelector('#save-poll');
   
   /*function updatePolls (data) {
      var pollsObject = JSON.parse(data);
      while (pollView.firstChild) {
         pollView.removeChild(pollView.firstChild);
      }
      // Loop through polls data
      for (var key in pollsObject) {
         if (pollsObject.hasOwnProperty(key)) {
            pollView.append(buildPollsElement(pollsObject[key]));
         }
      }
   }*/
   
   //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls));
   
   /*addPollButton.addEventListener('click', function () {
      
      var urlWithQuery = pollUrl + '?question=' + questionInput.value;

      ajaxFunctions.ajaxRequest('POST', urlWithQuery, function () {
         
         ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls);
      });

   }, false);*/
   
   savePollButton.addEventListener('click', function () {
      
      var urlWithQuery = pollUrl + '?question=' + questionInput.value;
      //TODO: loop through options and add them
      urlWithQuery += '&options[]=' + pollOptions[0];
      urlWithQuery += '&options[]=' + pollOptions[0];

      ajaxFunctions.ajaxRequest('POST', urlWithQuery, function () {
         
         //ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls);
      });

   }, false);

})();
