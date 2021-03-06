
'use strict';

(function () {

var votesUrl = appUrl + '/api/:id/votes';
var pollUrl = appUrl + '/api/:id/poll';
var pollsUrl = appUrl + '/api/:id/polls';
var pollId = document.getElementById('pollObject').getAttribute('value');
var voteCountView = document.querySelector('#voteCount');

function updateVotes() {
        
        var urlWithQuery = pollsUrl + '?pollId=' + pollId;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', urlWithQuery, function(data){

            var pollObject = JSON.parse(data);
            
            AmCharts.makeChart( "chartdiv", {
              "type": "serial",
              "dataProvider": pollObject.optionsInPoll,
              "categoryField": "text",
              "graphs": [ {
                "valueField": "voteCount",
                "type": "column"
              } ]
            } );
        }));     
}

updateVotes();

$('#submitVote').click(function(){
    var urlWithQuery = '';
    var method = 'POST';
    var urlQuery = $('input[name=option]:checked').val();
    var isLastSelected = $('input[name=option]:last').is(':checked');
    
    if(urlQuery == null){
        alert('please select an option before submitting vote');
        return false;    
    }
    
    if (isLastSelected) {
        if(!isInputValid('#otherOption')) {
            alert('input cant be empty');
            return false;
        }
        
        urlQuery += '&option=' + $('#otherOption').val();
        method = 'PUT';
        urlWithQuery = pollsUrl + urlQuery;
        
    } else {
        urlWithQuery = votesUrl + urlQuery;
    }
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest(method, urlWithQuery, function(){
        updateVotes();
        // Hide vote elements
        $('#voting-options').hide();
    }));

})

function isInputValid(inputId) { // TODO: improve validation

    return ($(inputId).val())
}

})();