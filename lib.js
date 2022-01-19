

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
	

	// arrayAsFunction : for very code friendly reading and writing within multiple arrays as one big array
	// (very code friendly but very slow too, for offset range process)
	// use jsArray() to make a copy as true js Array for reading offset range
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
		let _o = o;

		o.buffer = []; // read only (uses jsArray or updateBuffer)

		// existing array cell access
		let len = arrayFunction();
		for(let i=0; i<len; i++){
			o.buffer.push( arrayFunction(i)[0] ); // update buffer
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
		o.jsArray = function(updateBuffer=true){
			let o = [];
			let len = arrayFunction();
			if(updateBuffer){
				let val;
				_o.buffer = [];
				for(let i=0; i<len; i++){
					val = arrayFunction(i)[0];
					o.push(val);
					_o.buffer.push(val);
				}
			}else
				for(let i=0; i<len; i++)
					o.push(arrayFunction(i)[0]);
			return o;
		};

		// update buffer
		o.updateBuffer = function(){
			let len = arrayFunction();
			o.buffer = [];
			for(let i=0; i<len; i++)
				o.buffer.push(arrayFunction(i)[0]);
		};

		// length property
		Object.defineProperty(o, 'length', {
			get: function () { return arrayFunction() }
		});

		return o;
	};

	o.arrayAsFunction.fromArrayList = function(arrayList, arraySyntax=true){
		let len = arrayList.length;
		let one;
		let all = o.arrayAsFunction.create(arrayList[0]);
		for(let i=1; i<len; i++){
			one = o.arrayAsFunction.create(arrayList[i]);
			all = o.arrayAsFunction.concat(all,one);
		}
		if(arraySyntax)
			return o.arrayAsFunction.make_arraySyntax(all);
		else
			return all;
	};

	// loopList : for one very fast offset range over writing with multiple arrays as one big array
	o.loopList = {};

	o.loopList.create = function(start, length, arrayList){

		// create loopList
		let loopList = (function(){
			let listLen = arrayList.length;
	
			let end = start + length - 1;
	
			let totalLen = 0;
			let lastLen;
			let arrayLen;
	
			let startNotFound = true;
	
			let loopList = [];
			let iList = 0;
	
			loopList.start = start;
			loopList.d = start;
	
			for(let i=0; i<listLen; i++){
	
				arraySrc = arrayList[i];
				arrayLen = arraySrc.length;
				lastLen = totalLen;
				totalLen += arrayLen;
	
				// debug
				//arraySrc = arraySrc.join();
	
				if(startNotFound){
					if(start < totalLen){
						// start found
						loopList.push( [] );
						loopList[iList].push( start - lastLen );
						if(end < totalLen){ // end is in this current array
							loopList[iList].push( end - lastLen + 1 );
							loopList[iList].push( arraySrc );
							return loopList;
						} // end is in another array
						loopList[iList].push( arrayLen );
						loopList[iList].push( arraySrc );
						startNotFound = !startNotFound;
						iList++;
					}
				}else{
					loopList.push( [] );
					loopList[iList].push( 0 );
					if(end < totalLen){ // end is in this current array
						loopList[iList].push( end - lastLen + 1 );
						loopList[iList].push( arraySrc );
						return loopList;
					}
					loopList[iList].push( arrayLen );
					loopList[iList].push( arraySrc );
					iList++;
				}
			}

			return loopList;
		})();

		// no callback return
		loopList.procedureCallback = function(callback=(function(loop, index, scr, iSrc){}), args=[]){

			let L = this;
			let len = L.length;

			for(L.i=0,L.l=L[L.i], L.s=L.l[0],L._=L.l[1],L.S=L.l[2], L.n=L.d,L.N=0, L.k=1; L.k; ){
			for(L.c=L.s; L.c<L._; L.c++,L.n++,L.N++){

				callback(L.N, L.n, L.S, L.c, args);

			}L.i++;if(L.i<len){L.l=L[L.i],L.s=L.l[0],L._=L.l[1],L.S=L.l[2]}else{L.k=0}
			}
		};

		// capture each callback return
		loopList.functionCallback = function(callback=(function(loop, index, scr, iSrc){}), args=[]){
			let R = [];
			
			let L = this;
			let len = L.length;

			for(L.i=0,L.l=L[L.i], L.s=L.l[0],L._=L.l[1],L.S=L.l[2], L.n=L.d,L.N=0, L.k=1; L.k; ){
			for(L.c=L.s; L.c<L._; L.c++,L.n++,L.N++){

				R.push( callback(L.N, L.n, L.S, L.c, args) );

			}L.i++;if(L.i<len){L.l=L[L.i],L.s=L.l[0],L._=L.l[1],L.S=L.l[2]}else{L.k=0}
			}
		
			return R;
		};

		return loopList;
	};

	// DON'T USE THIS FUNCTION LIKE THAT, COPY AND USE FORLOOP CODE FOR READING loopList
	o.loopList.usingDemoExample = function(loopList){
		let R = [];

		let L = loopList;
		let len = L.length;

		for(L.i=0,L.l=L[L.i], L.s=L.l[0],L._=L.l[1],L.S=L.l[2], L.n=L.d,L.N=0, L.k=1; L.k; ){
		for(L.c=L.s; L.c<L._; L.c++,L.n++,L.N++){

			// your code ... ( L : i l s S _ n N c k )
			// L : loopList	
				// i : iLoop
				// l : loop
				// s : loopStart
				// S : ArraySource
				// _ : loopLength
				// n : loopListIndex
				// N : wholeProcessIndex
				// c : sourceReadIndex
				// k : keepProcessCondition

				// as developer use especially : N n S c
					// N : start to 0 (relative to process)
					// n : start to index in the "considerated big array" formed by all arrays in loopList
					// S : source array to read in and write in (corresponding to n)
					// c : index (corresponding to n) to read and write in S

					// example process code
					console.log( L.N, L.n, L.S[L.c] );
					R.push(L.S[L.c]);

		}L.i++;if(L.i<len){L.l=L[L.i],L.s=L.l[0],L._=L.l[1],L.S=L.l[2]}else{L.k=0}
		}
	
		return R;
	};

	// the same than o.loopList.usingDemoExample but the simplest possible for developer reading
	o.loopList.usingDemoExample2 = function(loopList){
		
		let listLen = loopList.length;
		let loop, start, length, source;
	
		let _i = 0;
		let index = loopList.start;
	
		for(let i=0; i<listLen; i++){
	
			loop = loopList[i];
			start = loop[0];
			length = loop[1];
			source = loop[2];
	
			for(let c=start; c<length; c++){

				// your code ...
				console.log( _i, index, source[c] );
				// your code end

				_i++;
				index++;
			}
	
		}
	};



	o.untitledTechnic = {};
	
	o.untitledTechnic.create = function(arrayList, getCell=true){

		let o = [];
		let iCell;

		if(getCell)
			for(let array of arrayList){
				iCell = 0;
				for(let cell of array){
					o.push( [iCell, array, cell] )
					iCell++;
				}
			}
		else
			for(let array of arrayList){
				iCell = 0;
				for(let cell of array){
					o.push( [iCell, array] )
					iCell++;
				}
			}

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


