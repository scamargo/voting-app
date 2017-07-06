
'use strict';

(function () {

   var pollView = document.querySelector('#polls');
   var pollUrl = appUrl + '/api/:id/polls';
   
   function updatePolls() {

      while (pollView.firstChild) {
         pollView.removeChild(pollView.firstChild);
      }
      
      handlebarsHelpers.getTemplate('renderMyPolls').done(function(template){
         $("#polls").append(template);
      });
   }
   
   $(document).on('click','.btn-delete', function(){
      var urlWithQuery = pollUrl + '?pollId=' + $(this).attr('value');

      ajaxFunctions.ajaxRequest('DELETE', urlWithQuery, function () {
         updatePolls();
      });
   });

})();
