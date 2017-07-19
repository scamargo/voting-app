
'use strict';

var pollUrl = appUrl + '/api/:id/polls';
var pollOptions;
var questionInput = document.querySelector("#question");

(function () {

   var createPollButton = document.querySelector('#create-poll');
   
   $(document).keypress(function(e) {
       if(e.which == 13) {
           savePoll();
       }
   });
   
   $('#add-option').click(function(){
      var div = document.createElement('div');
      var input = document.createElement('input');
      var button = document.createElement('button');
      var text = document.createTextNode('-');
      
      div.setAttribute('style','display:block');
      input.setAttribute('class','option');
      input.setAttribute('style','display:inline');
      button.onclick = deleteEvent; // Attach the event!
      button.setAttribute('class','btn btn-delete');
      button.appendChild(text);
      
      div.appendChild(input);
      div.appendChild(button);
      $('#options').append(div);
   });
   
   function deleteEvent() {
      console.log('delete');
      $(this).parent('div').remove();
   }

})();

function savePoll() { // has to be outside iife to be in global scope
   var urlWithQuery = pollUrl + '?question=' + $('#question').val();
   pollOptions = document.querySelectorAll('.option');
   
   // loop through options and add them to query string
   for(var i=0;i<pollOptions.length;i++) {
      if(pollOptions[i].value != "") {
         urlWithQuery += '&options[]=' + pollOptions[i].value;  
      }
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', urlWithQuery, function (data) {
      try {
         var pollObject = JSON.parse(data);
         window.location = appUrl + '/polls/' + pollObject.urlHash;
      }
      catch(err) {
         alert(data); //assumes data is text
      }
   }));
   return false;
}
