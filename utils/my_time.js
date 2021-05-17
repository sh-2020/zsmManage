function time_(time = +new Date()){
  var date = new Date(time + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}
function ChangeDateFormat(val) {
  if (val != null) {
      var datetime = new Date(val);      //月份为0-11，所以+1，月份小于10时补个0
  
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1;//js从0开始取
      var date = datetime.getDate();
      var hour = datetime.getHours();
      var minutes = datetime.getMinutes();
      var second = datetime.getSeconds();

      if (month < 10) {
          month = "0" + month;
      }
      if (date < 10) {
          date = "0" + date;
      }
      if (hour < 10) {
          hour = "0" + hour;
      }
      if (minutes < 10) {
          minutes = "0" + minutes;
      }
      if (second < 10) {
          second = "0" + second;
      }
      var time = year + "-" + month + "-" + date + " "; //2015-11-4 14:11:41

      return time;
  }
  return "";
}
module.exports.setTime_ = ChangeDateFormat
module.exports.time_ = time_