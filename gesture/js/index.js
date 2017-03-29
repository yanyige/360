$(document).ready(function() {

	let type = 0;

	let canvas = document.getElementById('canvas');

	let context = canvas.getContext('2d');

	let R = 14;

	let circles = [];

	let focusCircle = new Set();

	const info = ['请选择操作', '请输入手势密码', '请输入手势密码', '请再次输入手势密码', '密码太短， 至少需要5个点', '两次输入的不一致', '密码设置成功', '输入的密码不正确', '密码正确!'];

	const HEIGHT = canvas.height = $('.gesture').height() *0.4;
	const WIDTH = canvas.width = $('.gesture').width() * 0.6;

	function loadCircles() {
		let offsetX = (WIDTH - 2 * (R + 2)) >> 1;
		let offsetY = (HEIGHT - 2 * (R + 2)) >> 1;
		// console.log(offsetX);
		// console.log(offsetY);
		for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                circles.push(new Circle(R + 1 + offsetX * j, R + 1 + offsetY * i, i * 3 + j));
            }
        }
	}

	loadCircles();
	// console.log(circles);

	function Circle(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
	}

	function drawCircle(canvas, context) {
		for (var i = 0; i < circles.length; i++) {
            var _circle = circles[i];
            if(!circleFocused(_circle)) {
	            context.strokeStyle = "#bbbbbb";
	            context.lineWidth = 2;
	            context.beginPath();
	            context.arc(_circle.x, _circle.y, R, 0, Math.PI * 2, true);
	            context.closePath();
	            context.stroke();
	        } else {
	        	context.fillStyle = "#fb9005";
                context.beginPath();
                context.arc(_circle.x, _circle.y, R, 0, Math.PI * 2, true);
                context.fill();
                context.closePath();
                context.beginPath();
                context.fillStyle = "#ffa726";
                context.arc(_circle.x, _circle.y, R - 2, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
	        }
        }
	}

	drawCircle(canvas, context);

	function circleFocused(circle) {
		for( let item of focusCircle.keys() ) {
			if(circle == item) return true;
		}
		return false;
	}

	function drawLine(canvas, context, circle) {
		context.beginPath();
		for( let item of focusCircle.keys() ) {
			context.lineTo(item.x, item.y);
		}
		context.lineWidth = 2;
        context.strokeStyle = "#dd191d";

		if(focusCircle.size) {
			let _circleId = Array.from(focusCircle).pop().id;
			context.lineTo(circle.x - $('#canvas').offset().left, circle.y - $('#canvas').offset().top);
			// context.lineTo(circle[_circleId].x, circle[_circleId].y);
		}
		context.stroke();
        context.closePath();
	}

	function touchStart(e) {
		updateInfo();
		// warningInfo();
	}

	function touchMove(e) {

		if(type) {
	        e.preventDefault();

	        var touches = e.touches[0];
	        // console.log(touches.clientX);

	        updateCircles({x: touches.clientX, y: touches.clientY, r: R});

	        // console.log(focusCircle);

	        context.clearRect(0, 0, WIDTH, HEIGHT);
	        drawCircle(canvas, context);
	        drawLine(canvas, context, {x: touches.clientX, y: touches.clientY, r: R});
		} else {
			warningInfo();
		}

	}

	function touchEnd(e) {

		if(type) {
			e.preventDefault();

			validatePassword();
		}

	}

	function updateCircles(circle) {
		// console.log(circles[0].x);
		circles.map(function(item, index, arr) {
			if(circle.x >= item.x - R + $('#canvas').offset().left && circle.x <= item.x + R + $('#canvas').offset().left && circle.y >= item.y - R + $('#canvas').offset().top && circle.y <= item.y + R + $('#canvas').offset().top) {
				focusCircle.add(arr[index]);
				return ;
			}
		});
	}

	function warningInfo() {
		// $('.info').stop().animate({ color:'red' }).done($('.info').animate({ color:'black' }));
		$('.info').stop().animate({ color:'red' }, function() {
			$('.info').animate({ color:'black' });
		});
	}

	function updateInfo(type) {
		// $('.info').stop().animate({ color:'red' }).done($('.info').animate({ color:'black' }));
		$('.info').text(info[type]);
	}
	// console.log($("input:radio"));
	$("input:radio").change(function() {
		if($(this).attr("id") == 'setPassword') {
			type = 1;
			updateInfo(type);
		}else {
			type = 2;
			updateInfo(type);
		}
	});
	document.addEventListener("touchstart", touchStart, false);
	canvas.addEventListener("touchmove", touchMove, false);
	document.addEventListener("touchend", touchEnd, false);
});