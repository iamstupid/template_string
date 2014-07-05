window.template = {};
(function(_) {
	Number.prototype.mapx = function(a) {
		return a(this.valueOf(), 0, this);
	};
	Object.prototype.mapx = function(a) {
		var key=Object.keys(this),l=key.length,res={},i="";
		for(var j=0;j<l;++j){
			i=key[j];
			if(typeof this[i]==="object"){
				res[i]=this[i].mapx(a);
			}else{
				if(typeof this[i]==="function"){
					continue;
				}else{
					res[i]=a(this[i],i,this);
				}
			}
		}
		return res;
	};
	Array.prototype.mapx = function(f) {
		var b = this.length,
			a = new Array(b);
		for (var i = 0; i < b; i++) {
			a[i] = f(this[i], i, this);
		}
		return a;
	};
	var ts = _.templateString = _.ts = function(a) {
		this.str = a.valueOf();
		//ts is mutable
		this.valueOf = this.toString = this.toLocaleString = function() {
			return this.str.valueOf(); //un permitive are not allowed
		};
		this.plus = function(b) {
			this.str = this.str + b.valueOf();
			return this;
		};
		this.join = function(a) {
			this.str += a.join("");
			return this;
		};
		this.concat = function() {
			var a = Array.prototype.slice.call(arguments);
			this.str = a.unshift(this.str).join("");
			return this;
		};
		this.charAt = function(a) {
			var $ = this.str;
			return a.mapx(function(c) {
				return $.charAt(c);
			});
		};
		this.charCodeAt = function(a) {
			var $ = this.str;
			return a.mapx(function(c) {
				return $.charCodeAt(c);
			});
		};
		this.multiply = this.repeat = function(t) {
			var a = new Array(t);
			for (var i = 0; i < t; ++i) {
				a[i] = this.str;
			}
			this.str = a.join("");
			return this;
		};
		this.replace = function(a, b) {
			this.str = this.str.replace(a, b);
			return this;
		};
	};
	String.prototype.toTemplate = function() {
		//these two can be converted very well
		return new ts(this);
	};
	(function() {
		function isRegExp(a) {
			return a.constructor === RegExp;
		}

		function isString(a) {
			return typeof a.valueOf() === "string"; // templateString is included
		}

		function escape(string) {
			return ('' + string).replace(/["'\\\n\r\u2028\u2029]/g, function(character) {
				// Escape all characters not included in SingleStringCharacters and
				// DoubleStringCharacters on
				// http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
				switch (character) {
					case '"':
					case "'":
					case '\\':
						return '\\' + character
							// Four possible LineTerminator characters need to be escaped:
					case '\n':
						return '\\n'
					case '\r':
						return '\\r'
					case '\u2028':
						return '\\u2028'
					case '\u2029':
						return '\\u2029'
				}
			});
		}
		ts.prototype.search = function(a) {
			var res = [];
			if (isRegExp(a)) {
				this.replace(a, function(a, i) {
					res.push(i);
					return a
				});
			} else {
				if (isString(a)) {
					res = this.search(new RegExp(escape(a), "g"));
				} else {
					res = this.search(new RegExp(a.map(function(a) {
						return (a.source === undefined ? escape(a) : a.source)
					}).join("|"), "g"));
				}
			}
			return res;
		}
	})();
	_.raw = function toMultilineString(a) {
		var b;
		a.toString().replace(/\/\*([^]*)\*\//, function(a, c) {
			b = c.replace(/\*\/\/\*/g, "*/");
		});
		return new ts(b);
	}
})(template);
