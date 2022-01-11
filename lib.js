

dkc2ldd.lib = (function(app=dkc2ldd){

	let o = {};

	// just hex string
	o.get_hexToStr = function(number, prefix=""){
		return prefix + number.toString(16).toUpperCase();
	};
	
	// 0 at left for one byte
	o.get_hex2str = function(number, prefix=""){
		let str = number.toString(16).toUpperCase();
		return prefix + (str.length===1 ? "0" : "") + str;
	};
	
	// avoid odd hex nibble length with adding one 0 at left
	o.get_0hexStr = function(number, prefix=""){
		let str = number.toString(16).toUpperCase();
		let odd = str.length - ((str.length>>1)<<1);
		return prefix + (odd ? "0"+str : ""+str);
	};

	// (fast process) avoid odd hex nibble length with adding one 0 at left
	o.fastGet_0hexStr = function(number){
		let str = number.toString(16);
		let odd = str.length & 0x1;
		return (odd ? "0"+str : str);
	};
	
	// add fix 0 nibble at left
	o.get_fix0hexStr = function(number, fix0, prefix=""){
		let str = number.toString(16).toUpperCase();
		let len = fix0 - str.length;
		for(let i=0; i<len; i++)
			str = "0" + str;
		return prefix + str;
	};
	
	o.arrayAsFunction = {};

	o.arrayAsFunction.create = function(a){
		return function(i,v){
			let _o = {};
			_o[0] = function(){ return a.length; };
			_o[1] = function(){ return [a[i], a, i]; };
			_o[2] = function(){ a[i] = v; };

			let arg = arguments.length;
			arg = ( {0:0,1:1,2:2,undefined:2} )[ ([0,1,2])[arg] ];
			return _o[arg]();
		};
	};

	o.arrayAsFunction.concat = function(a, b){
		let ab = [a, b];
		return function(i,v){
			let aLen = a();
			let bLen = b();
			
			let _o = {};
			_o[0] = function(){
				return aLen+bLen;
			};
			_o[1] = function(){
				let t = Math.floor(i/aLen);
				t = ( {0:0,1:1,undefined:1} )[ ([0,1])[t] ];
				i = ([i, i-aLen])[t];
				return ab[t](i);
			};
			_o[2] = function(){
				let t = Math.floor(i/aLen);
				t = ( {0:0,1:1,undefined:1} )[ ([0,1])[t] ];
				i = ([i, i-aLen])[t];
				ab[t](i,v);
			};

			let arg = arguments.length;
			arg = ( {0:0,1:1,2:2,undefined:2} )[ ([0,1,2])[arg] ];
			return _o[arg]();
		};
	};

	o.arrayAsFunction.make_arraySyntax = function(arrayFunction){

		let o = {};

		// existing array cell access
		let len = arrayFunction();
		for(let i=0; i<len; i++){
			Object.defineProperty(o, i, {
				get: function () { return arrayFunction(i)[0]; },
				set: function (value) { arrayFunction(i, value); }
			});
		}

		// push method
		o.push = function(value){
			let len = arrayFunction();
			let jsArray = arrayFunction(len-1)[1];
			jsArray.push(value);
			Object.defineProperty(o, len, {
				get: function () { return arrayFunction(len)[0] },
				set: function (value) { arrayFunction(len, value); }
			});
			o[len] = value;
		};

		// pop method
		o.pop = function(value){
			let len = arrayFunction();
			let jsArray = arrayFunction(len-1)[1];
			let ret = jsArray.pop(value);
			delete o[len-1];
			return ret;
		};

		// jsArray (get true js Array)
		o.jsArray = function(){
			let o = [];
			let len = arrayFunction();
			for(let i=0; i<len; i++)
				o[i] = arrayFunction(i)[0];
			return o;
		};

		// length property
		Object.defineProperty(o, 'length', {
			get: function () { return arrayFunction() }
		});

		return o;
	};

    o.checkVal = {};
    o.checkVal.A = [];    
    o.checkVal.undef = function(val, replace=0){
        this.A[val] = val; // at first
        this.A[undefined] = replace; // at end
        return this.A[val];
    };
	o.checkVal.nan = function(val, replace=0){
        this.A[val] = val; // at first
		this.A[NaN] = replace; // at end
        return this.A[val];
    };
	o.checkVal.both = function(val, replace=0){
        this.A[val] = val; // at first
        this.A[undefined] = replace; // at end
		this.A[NaN] = replace; // at end
        return this.A[val];
    };

	return o;

})();


