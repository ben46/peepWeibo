exports.dateSort = function (dateArray) {
	  length = array.length;
	  for(i=0; i<=length-2; i++) {
	    for(j=length-1; j>=1; j--) {
	      //对两个元素进行交换
	      if(array[j].count > array[j-1].count) {
	        temp = array[j];
	        array[j] = array[j-1];
	        array[j-1] = temp;
	      }
	    }
	  }
}

exports.formateDate = function (date) {


	return date.format("yy-MM-dd hh:mm");

	// return date.getYear() + date.getMonth() + date.getDay() + date.getHours() + date.getDay() + date.getHours() + date.getMinutes();
}


exports.BubbleSort = function (array) {
  length = array.length;
  for(i=0; i<=length-2; i++) {
    for(j=length-1; j>=1; j--) {
      //对两个元素进行交换
      if(array[j].count > array[j-1].count) {
        temp = array[j];
        array[j] = array[j-1];
        array[j-1] = temp;
      }
    }
  }
}

Date.prototype.format = function(format) //author: meizz
{
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
    "S" : this.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length==1 ? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
}
