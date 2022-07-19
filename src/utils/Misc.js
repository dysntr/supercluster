export default async function getTodayDate() {
  try {
    let date = new Date();
    let dateString =
      ("0" + (date.getMonth() + 1).toString()).substr(-2) +
      "/" +
      ("0" + date.getDate().toString()).substr(-2) +
      "/" +
      date.getFullYear().toString().substr(2);
  } catch (e) {
    console.error(e);
  }
}
