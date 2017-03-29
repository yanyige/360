$(document).ready(function() {

	let type = 0;
	/**
	*** running mode of system
	*** mode    0    init   mode(no input)
	*** mode    1    set    password(first time)
	*** mode    2    verify password with localStorage
	*** mode    3    verify input password is the same as previous input
	*/

	let firstPassword = []; // password set by mode 1

	let canvas = document.getElementById('canvas');

	let context = canvas.getContext('2d');

	let R = 14; // radius of password panel

	let circles = []; // circles on the password panel

	let focusCircle = new Set(); // circles focused by user, unique array

	const info = ['请选择操作', '请输入手势密码', '请输入手势密码', '请再次输入手势密码', '密码太短， 至少需要5个点', '两次输入的不一致', '密码设置成功', '输入的密码不正确', '密码正确!']; // operation info

	const HEIGHT = canvas.height = $('.gesture').height() *0.4;
	const WIDTH = canvas.width = $('.gesture').width() * 0.6;

	(function(){

		loadCircles(); // load position and id of circle on canvas

		initCanvas(); // initialize circles on canvas

		bindEvents(); // bind events

	})();

	function loadCircles() {
		let offsetX = (WIDTH - 2 * (R + 2)) >> 1;
		let offsetY = (HEIGHT - 2 * (R + 2)) >> 1;
		for (let i = 0; i < 3; i ++) {
            for (let j = 0; j < 3; j ++) {
                circles.push(new Circle(R + 1 + offsetX * j, R + 1 + offsetY * i, i * 3 + j));
            }
        }
	}

	function initCanvas() { // init canvas and circles
		context.clearRect(0, 0, WIDTH, HEIGHT);
		drawCircle(canvas, context);
	}

	function Circle(x, y, id) { // constructor of a circle
		this.x = x;
		this.y = y;
		this.id = id;
	}

	function drawCircle(canvas, context) { // draw cicles
		for (var i = 0; i < circles.length; i ++) {
            var _circle = circles[i];
            if(!circleFocused(_circle)) {
	            context.fillStyle = "#bbbbbb";
                context.beginPath();
                context.arc(_circle.x, _circle.y, R, 0, Math.PI * 2, true);
                context.fill();
                context.closePath();
                context.beginPath();
                context.fillStyle = "#ffffff";
                context.arc(_circle.x, _circle.y, R - 1, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
	        } else {
	        	context.fillStyle = "#fb9005";
                context.beginPath();
                context.arc(_circle.x, _circle.y, R, 0, Math.PI * 2, true);
                context.fill();
                context.closePath();
                context.beginPath();
                context.fillStyle = "#ffa726";
                context.arc(_circle.x, _circle.y, R - 1, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
	        }
        }
	}

	function circleFocused(circle) { // add users password to a set.
		for( let item of focusCircle.keys() ) {
			if(circle == item) return true;
		}
		return false;
	}

	function drawLine(canvas, context, cursor) {
		context.beginPath();
		for( let item of focusCircle.keys() ) {
			context.lineTo(item.x, item.y);
		}
		context.lineWidth = 2;
        context.strokeStyle = "#dd191d";

        if(cursor) {
        	context.lineTo(cursor.x - $('#canvas').offset().left, cursor.y - $('#canvas').offset().top);
        }

		context.stroke();
        context.closePath();
	}

	function touchStart(e) { // update info for users
		updateInfo(type);
	}

	function touchMove(e) { // draw line and circle

		if(type) {
	        e.preventDefault();

	        var touches = e.touches[0];

	        updateCircles({x: touches.clientX, y: touches.clientY, r: R});

	        context.clearRect(0, 0, WIDTH, HEIGHT);
	        drawCircle(canvas, context);
	        drawLine(canvas, context, {x: touches.clientX, y: touches.clientY, r: R});
		} else {
			warningInfo();
		}
	}

	function touchEnd(e) { // main logic part
		if(type) {
			e.preventDefault();
			context.clearRect(0, 0, WIDTH, HEIGHT);
	        drawCircle(canvas, context);
	        drawLine(canvas, context, false);
	        switch(type) {
	        	case 1: // first input password
	        		if(validateInputPassword(focusCircle)) {
	        			firstPassword = circleToArr(focusCircle);
	        			switchMode(3);
	        			updateInfo(3);
	        		} else {
	        			switchMode(1);
	        			updateInfo(4);
	        		}
	        		break;
	        	case 2: // verify password
	        		if(validatePassword(focusCircle)) {
	        			switchMode(2)
	        			updateInfo(8);
	        		} else {
	        			switchMode(2)
	        			updateInfo(7);
	        		}
	        		warningInfo();
	        		break;
	        	case 3: // second input password
	        		if(validateInputPassword(focusCircle)) {
		        		if(validateSecondPassword(focusCircle)) {
		        			savePassword(focusCircle);
		        			$("#verifyPassword").click();
		        			updateInfo(6);
		        		} else {
		        			switchMode(1); //password save fail, back to mode 1
		        			updateInfo(5);
		        		}
	        		} else {
	        			switchMode(1); // wrong input, back to mode 1
	        			updateInfo(4);
	        		}
	        		break;
	        }
		}

	}

	function circleToArr(circles) { // change set to circle ID of array
		return Array.apply(null, Array.from(circles)).map(function(item, index) {return item.id});
	}

	function updateCircles(circle) {
		circles.map(function(item, index, arr) {
			if(circle.x >= item.x - R + $('#canvas').offset().left && circle.x <= item.x + R + $('#canvas').offset().left && circle.y >= item.y - R + $('#canvas').offset().top && circle.y <= item.y + R + $('#canvas').offset().top) {
				focusCircle.add(arr[index]);
				return ;
			}
		});
	}

	function savePassword(circles) {
		var _password = circleToArr(circles);
		localStorage.setItem("gesture", _password.toString());
		// console.log(localStorage.getItem("gesture"));
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

	function validateInputPassword(password) {
		if(password.size > 4) return true;
		else return false;
	}

	function compareArr(arr1, arr2) {
		if(arr1.length != arr2.length) {
			return false;
		} else {
			return arr1.every(function(item, index) {
				return arr2[index] == item;
			});
		}
	}

	function validateSecondPassword(password) {
		let _secPass = circleToArr(password);

		return compareArr(_secPass, firstPassword);
	}

	function validatePassword(password) {
		let _userPassword = circleToArr(password).toString();
		var _systemPassword = localStorage.getItem("gesture");
		if(!_systemPassword) return false;
		return _userPassword == _systemPassword;
	}

	function switchMode(_type) {
		switch(_type) {
			case 1:
				focusCircle.clear();
				firstPassword = []; // clear first password by user
				break;
			case 2:
				focusCircle.clear();
				break;
			case 3:
				focusCircle.clear();
				break;
		}
		// updateInfo(_type);
		initCanvas();
		type = _type;
	}

	$("input:radio").change(function() { // change type
		if($(this).attr("id") == 'setPassword') {
			type = 1;
			// updateInfo(type);
			switchMode(type);
			updateInfo(type);
		}else {
			type = 2;
			// updateInfo(type);
			switchMode(type);
			updateInfo(type);
		}
	});

	function bindEvents() {
		canvas.addEventListener("touchstart", touchStart, false);
		canvas.addEventListener("touchmove", touchMove, false);
		canvas.addEventListener("touchend", touchEnd, false);
	}
});