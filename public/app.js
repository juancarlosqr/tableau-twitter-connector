(function() {
  var myConnector = tableau.makeConnector();

  myConnector.getColumnHeaders = function() {
    var fieldNames = ['Id', 'User', 'Name', 'Description', 'Url', 'Profile Image Url', 'Profile Background Image Url', 'Language', 'Location', 'Timezone', 'UTC Offset', 'Followers Count', 'Friends Count', 'Listed Count', 'Favourites Count', 'Statuses Count', 'Following', 'Follow request sent', 'Geo enabled', 'Verified', 'Notifications', 'Muting', 'Created At'];
    var fieldTypes = ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'int', 'int', 'int', 'int', 'int', 'int', 'bool', 'bool', 'bool', 'bool', 'bool', 'bool', 'datetime'];
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
              // string
              'Id': data.users[i].id_str,
              'User': data.users[i].screen_name,
              'Name': data.users[i].name,
              'Description': data.users[i].description,
              'Url': data.users[i].url,
              'Profile Image Url': data.users[i].profile_image_url_https,
              'Profile Background Image Url': data.users[i].profile_background_image_url_https,
              'Language': data.users[i].lang,
              'Location': data.users[i].location,
              'Timezone': data.users[i].time_zone,
              // int
              'UTC Offset': data.users[i].utc_offset,
              'Followers Count': data.users[i].followers_count,
              'Friends Count': data.users[i].friends_count,
              'Listed Count': data.users[i].listed_count,
              'Favourites Count': data.users[i].favourites_count,
              'Statuses Count': data.users[i].statuses_count,
              // bool
              'Following': (data.users[i].following) ? 1 : 0,
              'Follow request sent': (data.users[i].follow_request_sent) ? 1 : 0,
              'Geo enabled': (data.users[i].geo_enabled) ? 1 : 0,
              'Verified': (data.users[i].verified) ? 1 : 0,
              'Notifications': (data.users[i].notifications) ? 1 : 0,
              'Muting': (data.users[i].muting) ? 1 : 0,
              // datetime
              'Created At': data.users[i].created_at
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
