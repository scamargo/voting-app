
'use strict';

(function () {

   var pollView = document.querySelector('#polls');
   var pollUrl = appUrl + '/api/:id/polls';
   
   function updatePolls (data) {
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
   }
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrl, updatePolls));
   
   $(document).on('click','.btn-delete', function(){
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
      deleteButton.setAttribute("class","btn btn-delete");
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
