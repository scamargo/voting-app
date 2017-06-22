

'use strict';

(function () {

   var questionInput = document.querySelector("#question");
   var pollUrl = appUrl + '/api/:id/polls';
   var pollOptions = document.querySelectorAll('.option');
   var createPollButton = document.querySelector('#create-poll');
   
   createPollButton.addEventListener('click', function () {
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
