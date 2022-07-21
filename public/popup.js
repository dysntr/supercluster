// wrapper method
function getContent() {
  callEventPageMethod("getContent", "some parameter", function (response) {
    console.log(response);
  });
}

function doSomethingWit() {
  console.log(response);
}

//generic method
function callEventPageMethod(method, data, callback) {
  chrome.runtime.sendMessage(
    { method: method, data: data },
    function (response) {
      if (typeof callback === "function") callback(response);
    }
  );
}
