
'use strict';

(function () {

var voteUrl = appUrl + '/api/:id/votes';
var pollObject = document.getElementById('pollObject').getAttribute('value');
pollObject = JSON.parse(JSON.stringify(pollObject));
$('#pollObject').text(pollObject);

function updateVotes() {
    
    for(var i = 0; i < pollObject.optionsInPoll.length; i++) {
        
        var urlWithQuery = voteUrl + '?pollOptionId=' + pollObject.optionsInPoll[i]._id;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', urlWithQuery, function(data){
            // TODO: add votest to poll object
            console.log(data);
        }));      
    }
    
}


//updateVotes();


$('#submitVote').click(function(){
    
    var urlWithQuery = voteUrl + $('#options').val();
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', urlWithQuery, function(){
        // TODO: update votes
        // Hide vote elements
        $('#vote-options').attr('display','none');
    }));
})

})();