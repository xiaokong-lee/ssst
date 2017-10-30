
/**
 * 对象返回浏览器控制台并在div上显示它们的消息。
 * 
 * @constructor
 * 
 * @param {String}
 *            id: div标记的id属性，用于显示消息
 * @param console:
 *            引用原始浏览器控制台
 */
function Console(id, console) {
	var div = document.getElementById(id);

	function createMessage(msg, color) {
		// Sanitize the input
		msg = msg.toString().replace(/</g, '&lt;');
		var span = document.createElement('SPAN');
		if (color != undefined) {
			span.style.color = color;
		}
		span.appendChild(document.createTextNode(msg));
		return span;
	}

	this._append = function(element) {
		div.appendChild(element);
		div.appendChild(document.createElement('BR'));
		// $(window).scrollTo('max', {duration: 500});
	};

	/**
	 * 在浏览器控制台和定义的div上显示错误消息
	 * 
	 * @param msg:
	 *            要显示的消息或对象
	 */
	this.error = function(msg) {
		console.error(msg);
		this._append(createMessage(msg, "#FF0000"));
	};

	/**
	 * 在浏览器控制台和定义的div上显示警告消息
	 * 
	 * @param msg:
	 *            要显示的消息或对象
	 */
	this.warn = function(msg) {
		console.warn(msg);
		this._append(createMessage(msg, "#FFA500"));
	};

	/**
	 * 在浏览器控制台和定义的div上显示信息消息
	 * 
	 * @param msg:
	 *            要显示的消息或对象
	 */
	this.info = this.log = function(msg) {
		console.info(msg);
		this._append(createMessage(msg));
	};

	/**
	 * 在浏览器控制台和定义的div上显示调试消息
	 * 
	 * @param msg:
	 *            要显示的消息或对象
	 */
	this.debug = function(msg) {
		console.log(msg);
		// this._append(createMessage(msg, "#0000FF"));
	};
}
