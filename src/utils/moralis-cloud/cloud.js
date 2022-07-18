Moralis.Cloud.define("fetchJSON", async (request) => {
  return Moralis.Cloud.httpRequest({
    method: "GET",
    url: request.params.theUrl,
  })
})