window.template = {};
(function(_) {
	Number.prototype.mapx = function(a) {
		return a(this.valueOf(), 0, this);
	};
	Object.prototype.mapx = function(a) {
		var key = Object.keys(this),
			l = key.length,
			res = {},
			i = "";
		for (var j = 0; j < l; ++j) {
			i = key[j];
			if (typeof this[i] === "object") {
				res[i] = this[i].mapx(a);
			} else {
				if (typeof this[i] === "function") {
					continue;
				} else {
					res[i] = a(this[i], i, this);
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
		this.toRegex = function(flags) {
			return new RegExp(this.str, flags);
		};
		this.interpolate = function(scope) {
			scope=scope||function(func){return eval(func);}
			this.str = this.str.replace(/\{\{(([^\}]|\}[^\}])*)\}\}/g, function(a, b) {
				return scope(b);
			});
			return this;
		};
		this.escape = function(escapeFunctionList) {
			var efl = escapeFunctionList === undefined ? defaultEscape : escapeFunctionList,$=this.str;
			efl.mapx(function(a){
				$=a($);
			});
			this.str=$;
			return this;
		};
		this.dup=function(){
			return new ts(this.str.valueOf())
		}
		this.toLambdaFunction=function(lambdaArgs,innerVariables){
			var inner="",inners=[],$=this,i=innerVariables;
			innerVariables.mapx(function(a,i){
				inners.push(i+" = i[\""+i+"\"]");
			});
			if((inner=inners.join(",\n\t"))!==""){
				inner="\tvar "+inner+";\n";
			}
			console.log(inner="(function("+lambdaArgs.join(", ")+") {\n"+inner+"\treturn $.dup().interpolate();\n})")
			return eval(inner);
		}
	};
	var defaultEscape = [];
	_.escapers = {};
	(function($) {
		//escape
		$.nameChar = {
			"Alpha": "Α",
			"Beta": "Β",
			"Gamma": "Γ",
			"Delta": "Δ",
			"Epsilon": "Ε",
			"Zeta": "Ζ",
			"Eta": "Η",
			"Theta": "Θ",
			"Iota": "Ι",
			"Kappa": "Κ",
			"Lambda": "Λ",
			"Mu": "Μ",
			"Nu": "Ν",
			"Xi": "Ξ",
			"Omicron": "Ο",
			"Pi": "Π",
			"Rho": "Ρ",
			"Sigma": "Σ",
			"Tau": "Τ",
			"Upsilon": "Υ",
			"Phi": "Φ",
			"Chi": "Χ",
			"Psi": "Ψ",
			"Omega": "Ω",
			"alpha": "α",
			"beta": "β",
			"gamma": "γ",
			"delta": "δ",
			"epsilon": "ε",
			"zeta": "ζ",
			"eta": "η",
			"theta": "θ",
			"iota": "ι",
			"kappa": "κ",
			"lambda": "λ",
			"mu": "μ",
			"nu": "ν",
			"xi": "ξ",
			"omicron": "ο",
			"pi": "π",
			"rho": "ρ",
			"sigma": "ς",
			"osigma":"σ",
			"tau": "τ",
			"upsilon": "υ",
			"phi": "φ",
			"chi": "χ",
			"psi": "ψ",
			"omega": "ω",
			"sup0":"⁰",
			"sup1":"¹",
			"sup2":"²",
			"sup3":"³",
			"sup4":"⁴",
			"sup5":"⁵",
			"sup6":"⁶",
			"sup7":"⁷",
			"sup8":"⁸",
			"sup9":"⁹",
			"sup+":"⁺",
			"sup-":"⁻",
			"sup=":"⁼",
			"supLeftBracket":"⁽",
			"supRightBracket":"⁾",
			"supn":"ⁿ",
			"^0":"⁰",/*short*/
			"^1":"¹",
			"^2":"²",
			"^3":"³",
			"^4":"⁴",
			"^5":"⁵",
			"^6":"⁶",
			"^7":"⁷",
			"^8":"⁸",
			"^9":"⁹",
		};
		$.newLine = function(a) {
			return a.replace(/\\n/g, "\n");
		};
		$.tab = function(a) {
			return a.replace(/\\t/g, "\t");
		};
		$.tab2space = function(a, size) {
			size = size === undefined ? 3 : size;
			var b = new Array(size);
			for (var i = 0; i < size; ++i) {
				b[i] = " ";
			};
			b = b.join("");
			return a.replace(/\\t|\t/g, b);
		}
		$.named = function(a) {
			return a.replace(/\\f\{([a-zA-Z0-9\_\s\^\:\+\-\=]*)\}/, function(a,b) {
				return b.split(" ").mapx(function(a) {
					return $.nameChar[a];
				}).join("");
			});
		}
		defaultEscape.push($.named);
	})(_.escapers);
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
