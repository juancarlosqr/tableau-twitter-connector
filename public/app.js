(function() {
  var myConnector = tableau.makeConnector();

  myConnector.getColumnHeaders = function() {
    var fieldNames = ['User', 'Followers', 'Language'];
    var fieldTypes = ['string', 'int', 'string'];
    tableau.headersCallback(fieldNames, fieldTypes);
  }

  myConnector.getTableData = function(recordToken) {
    var dataToReturn = [];
    var lastRecordToken = recordToken || -1;
    var hasMoreData = false;
    var xhr = $.ajax({
      url: '/twitter/followers?id=' + tableau.connectionData + '&cursor=' + lastRecordToken,
      dataType: 'json',
      success: function (data) {
        if (data.users.length > 0) {
          var i = data.users.length;
          for (i; i--;) {
            dataToReturn.push({
              'User': data.users[i].screen_name,
              'Followers': data.users[i].followers_count,
              'Language': data.users[i].lang
            });
          }
          hasMoreData = (data.next_cursor > 0);
          tableau.dataCallback(dataToReturn, data.next_cursor, hasMoreData);
        } else {
          var noDataMsg = 'No results found for this Twitter account';
          tableau.log(noDataMsg);
          tableau.abortWithError(noDataMsg);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        tableau.log('Connection error: ' + xhr.responseText + '\n' + thrownError);
        tableau.abortWithError('Error connecting to the <%= title %>');
      }
    });
  }

  tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
  var sessionID = '<%= sessionID %>'
    , btnLogin = $('#login')
    , btnGetData = $('#getData');
  $('#container').fadeIn();
  if (sessionID.length > 0) {
    btnGetData.fadeIn();
  } else {
    btnLogin.fadeIn();
  }
  btnLogin.on('click', function() {
    window.location.href = '/connect/twitter';
  });
  btnGetData.on('click', function() {
    tableau.connectionName = '<%= title %>';
    tableau.connectionData = sessionID;
    tableau.submit();
  });
});
