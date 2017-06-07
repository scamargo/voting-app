'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var questionInput = document.querySelector("#question");
   var apiUrl = appUrl + '/api/:id/clicks';
   var addPollButton = document.querySelector('#add-poll');
   var pollView = document.querySelector('#polls');
   var pollUrl = appUrl + '/api/:id/polls';

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }
   
   function updatePolls (data) {
      var pollsObject = JSON.parse(data);
      while (pollView.firstChild) {
         pollView.removeChild(pollView.firstChild);
}
      // Loop through polls data
      for (var key in pollsObject) {
         if (pollsObject.hasOwnProperty(key)) {
            console.log(key + " -> " + JSON.stringify(pollsObject[key]));
            pollView.append(buildPollsElement(pollsObject[key]));
         }
      }
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
   
   // POLLS
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls));
   
   addPollButton.addEventListener('click', function () {
      
      var urlWithQuery = pollUrl + '?question=' + questionInput.value;

      ajaxFunctions.ajaxRequest('POST', urlWithQuery, function () {
         
         ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls);
      });

   }, false);
   
   $(document).on('click','.delete', function(){ // TODO: this ain't working
      var urlWithQuery = pollUrl + '?pollId=' + $(this).attr('value');

      ajaxFunctions.ajaxRequest('DELETE', urlWithQuery, function () {

         ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls);
      });
   });
   
   function buildPollsElement(pollObj) {

      var link = document.createElement('a'); // TODO: give link href
      var item = document.createElement('div');
      var deleteButton = document.createElement('button');
      item.setAttribute("class","poll-detail");
      item.appendChild(document.createTextNode(pollObj.question)); 
      deleteButton.setAttribute("class","delete");
      deleteButton.appendChild(document.createTextNode('delete'));
      deleteButton.setAttribute("value",pollObj._id);
      /*var detail = document.createElement('div');
      detail.setAttribute("class","detail");
   
      // Create custom attributes
      var att = document.createAttribute("data-search-term"); 
      att.value = pollObj.name.toLowerCase();
      item.setAttributeNode(att);
      att = document.createAttribute("online");
      att.value = pollObj.online;
      item.setAttributeNode(att);
      att = document.createAttribute("active");
      att.value = pollObj.active;
      item.setAttributeNode(att);
   
      if(!pollObj.active) {
      item.setAttribute("class","channel offline inactive");
      detail.appendChild(document.createTextNode("inactive"));
      }
      else { //channel is active
      item.setAttribute("style","background-image:url("+pollObj.logo+")");
      link.setAttribute("href",pollObj.url);
      link.setAttribute("target","_blank");
      
         if (!pollObj.online) {
           item.setAttribute("class","channel offline");
           detail.appendChild(document.createTextNode("offline"));
         }
         else { //channel is online
           item.setAttribute("class","channel online");
           var detailText = truncate(pollObj.game,18);
           detail.appendChild(document.createTextNode(detailText));
         }
      }
    
      item.appendChild(detail);*/
      item.appendChild(deleteButton);
      link.appendChild(item);
      return link;
   } //buildChannelElement

})();
