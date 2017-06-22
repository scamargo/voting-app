

'use strict';

(function () {

   var questionInput = document.querySelector("#question");
   var pollUrl = appUrl + '/api/:id/polls';
   var pollOptions = document.querySelectorAll('.option');
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
      savePoll()
   }, false);
   
   $(document).keypress(function(e) {
       if(e.which == 13) {
           savePoll();
       }
   });

   function savePoll() {
      var urlWithQuery = pollUrl + '?question=' + questionInput.value;
      //TODO: loop through options and add them
      urlWithQuery += '&options[]=' + pollOptions[0].value;
      urlWithQuery += '&options[]=' + pollOptions[1].value;

      ajaxFunctions.ajaxRequest('POST', urlWithQuery, function (data) {
         var pollObject = JSON.parse(data);
         window.location = appUrl + '/polls/' + pollObject.urlHash;
      });
   }

})();
