
'use strict';

(function () {

var voteUrl = appUrl + '/api/:id/votes';
var pollUrl = appUrl + '/api/:id/poll'
var pollId = document.getElementById('pollObject').getAttribute('value');
var voteCountView = document.querySelector('#voteCount');

function updateVotes() {
        
        var urlWithQuery = pollUrl + '?pollId=' + pollId;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', urlWithQuery, function(data){

            // loop through options in data and update UI
            var pollObject = JSON.parse(data);
            // remove all list items in <ul>
            while (voteCountView.firstChild) {
                voteCountView.removeChild(voteCountView.firstChild);
            }
            // add a list item for each pollOption
            var options = pollObject.optionsInPoll;
            for(var i=0;i< options.length;i++) {
                var item = document.createElement('li');
                item.appendChild(document.createTextNode(options[i].text +': '+options[i].voteCount));
                voteCountView.append(item);    
            }
        }));     
}

updateVotes();

$('#submitVote').click(function(){
    
    var urlWithQuery = voteUrl + $('#options').val();
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', urlWithQuery, function(){
        updateVotes();
        // Hide vote elements
        $('#voting-options').hide();
    }));
})

})();