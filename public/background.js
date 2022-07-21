chrome.runtime.onMessage.addListener(callback);
function callback(obj, sender, sendResponse) {
  if (obj) {
    if (obj.method == "getContent") {
      getContent(sendResponse);
    } else if (obj.method == "othermethod") {
    }
  }
  return true; // remove this line to make the call sync!
}

//some async method
function getContent(sendResponse) {
  //   chrome.storage.local.get(["mydata"], function (obj) {
  //     var mydata = $.trim(obj["mydata"]);
  sendResponse("test");
  // });
}
