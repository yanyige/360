$(document).ready(function() {
	let type = 1;
	let points = [];
	let pointHeight;
	let pointWidth;
	// Get position of each point
	function LoadPoint() {
		$('.circle').map(function(index, item) {
			points.push([$(item).offset().left, $(item).offset().top])
		});
		pointHeight = $('.circle').height();
		pointWidth = $('.circle').width();
	}
	LoadPoint();
	// console.log(points);
	// console.log(pointWidth);
	// console.log(pointHeight);
	function touchMoveFunc(evt) {

		evt.preventDefault();
		var touch = evt.touches[0]; //获取第一个触点
		var x = Number(touch.pageX); //页面触点X坐标
		var y = Number(touch.pageY); //页面触点Y坐标

		var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';

		document.getElementById("result").innerHTML = text;

		points.map(function(item, index) {
			// console.log(item);
			// console.log(item[0] + pointWidth);
			// console.log(item[1] + pointHeight);
			if(x >= item[0] && x <= item[0] + pointWidth && y >= item[1] && y <= item[1] + pointHeight) {
				document.getElementById("result").innerHTML = '命中';
				return ;
			}
		});
	}
	document.addEventListener('touchmove', touchMoveFunc, false);
});