var API_KEY = "AIzaSyDQaBAQbks8tBzQVIC2ezRUnBaWqilc2ho";
    $(function(){

     var baseSearch = function(searchVal, searchFilter) {
          var search_service = 'https://www.googleapis.com/freebase/v1/search';
          var params = {
            'key': API_KEY,
            'query': searchVal,
            'filter': searchFilter,
            'output': '(description)',
            'limit': 9
          };
          $.getJSON(search_service + '?callback=?', params, function(response) {
        $("#related ul").empty();
              for (var i=0; i<response['result'].length; i++) {
                var related_entity = response['result'][i];
                var list_item = $('<li class="related_li"></li>');
                var container = $('<div class="related_entity"></div>');
                container.append($('<img class="bubImg" name="'+ related_entity['name'] + '" src="https://usercontent.googleapis.com/freebase/v1/image' + related_entity['mid'] + '?maxwidth=244&maxheight=177">'));
                container.append($('<br/><span class="bubTitle" target="_blank">' + related_entity['name'] + '</span>'));
               

                if (typeof {text:related_entity['notable']}.text != "undefined"){
                container.append($('<br/><span class="notable-name">' + related_entity['notable']['name'] + '</span>'));
                }

                list_item.append(container);
                 var l = response['result'].length-1;
   
              $("#related ul").append(list_item);
              $("#related li")[0].style.left = "40%";
              $("#related li")[0].style.top = "35%";
              $("#related li")[i].style.left = (40 - 20*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
              $("#related li")[i].style.top = (35 + 33*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
			  //$("#related li")[i].style.background = "#"+(40 - 20*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4)+22;
              }

              $("#related").show();


          var service_url = 'https://www.googleapis.com/freebase/v1/topic';
          var params = {key: API_KEY};

           var topicAbstract = function(topic_mid){
            $.getJSON(service_url + topic_mid + '?callback=?', params, function(topic) {
              $("#topic_info").empty();
              //console.log(topic.property['/type/object/name'].values[0].text);
             // $("#topic_info").append($('<span class="related_name">' + topic.property['/type/object/name'].values[0].text + '</span><br/>'));
              $("#topic_info").append($('<span class="topic-description">' + topic.property['/common/topic/description'].values[0].value + '</span><br/>'));
              if(typeof {text:topic.property['/common/topic/notable_properties']}.text != "undefined"){
                var numNotableProperties = {text:topic.property['/common/topic/notable_properties'].count}.text;
                var lastId = "";
                for (var i=0; i < numNotableProperties; i++) {
                  var id = {text:topic.property['/common/topic/notable_properties'].values[i].id}.text;
                  var val = {text:topic.property[id].values[0].text};
                  if (id != lastId) {
                    $("#topic_info").append($('<span class="noteable-prop">' + topic.property['/common/topic/notable_properties'].values[i].text + ' : ' + val.text + '</span><br/>'));              
                  }
                  lastId = id;
                };                
              };
              $("#topic_info").show();
            });
          };

          topicAbstract(response['result'][0]['mid']);

          });
       };
  
   
$("#myinput").suggest();

  $("#related img").live('click',function(){
    $("#myinput").val($(this).attr('name')).change();
    baseSearch($(this).attr('name'),$('#myfilter').val());
  });
  
  $("#related span").live('click',function(){
    $("#myinput").val($(this).text()).change();
    baseSearch($(this).text(),$('#myfilter').val());
  });
  
  $("#myinput").keypress(function(event) {
    if (event.which == 13) {
      baseSearch($('#myinput').val(),$('#myfilter').val());
    }
  });

  $("#myfilter").val("(all type:/common/topic)").change();  
	 
	 function GetUrlValue(VarSearch){
		var SearchString = window.location.search.substring(1);
		var VariableArray = SearchString.split('&');
		for(var i = 0; i < VariableArray.length; i++){
			var KeyValuePair = VariableArray[i].split('=');
		if(KeyValuePair[0] == VarSearch){
			return KeyValuePair[1];
		}
		}
	 }

$("#myinput").val(GetUrlValue("userInput")).change();
baseSearch(GetUrlValue("userInput"),$('#myfilter').val());

});
