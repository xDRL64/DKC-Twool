dkc2ldd.component = {};

dkc2ldd.component = (function(app=dkc2ldd){

	let o = {};

	let data = {
		ownerRefs : [], // array cell : {data,owner,index|prop}
		byteOffset : 0, // files to buffer
		vramOffset : 0, // buffer to vram
	};

	let anim = {
		ownerRefs : [], // array cell : {data,owner,index|prop}
		vramRefs : []
	};

	let gfxlib = {};
	let doNothing = function(){};
	let unsetLib = doNothing;

	gfxlib.palette = {
		decode2 : app?.gfx?.fast?.decode_palette || unsetLib,
		decode4 : app?.gfx?.fast?.decode_palette || unsetLib,
		decode8 : app?.gfx?.fast?.decode_palette || unsetLib,

		format2 : app?.gfx?.fast?.format_palette || unsetLib,
		format4 : app?.gfx?.fast?.format_palette || unsetLib,
		format8 : app?.gfx?.fast?.format_palette || unsetLib,

		writeD2 : app?.write?.decodedPalette || unsetLib,
		writeD4 : app?.write?.decodedPalette || unsetLib,
		writeD8 : app?.write?.decodedPalette || unsetLib,

		writeF2 : app?.write?.formatedPalette || unsetLib,
		writeF4 : app?.write?.formatedPalette || unsetLib,
		writeF8 : app?.write?.formatedPalette || unsetLib,
	};

	gfxlib.tileset = {
		vramBackRef : app?.gfx?.fast?.animatedTiles_to_vramBackRef || unsetLib,
		anim_vram : app?.gfx?.fast?.animatedTiles_to_vramTileset || unsetLib,
		vram_anim : app?.gfx?.fast?.vramTileset_to_animatedTiles || unsetLib,
		clampLen2 : app?.write?.get_clampedLength2 || unsetLib,
		clampCopy : app?.write?.clampedCopy || unsetLib,
		ignoreAnim : app?.write?.copy_byteToByte || unsetLib,
		avoidAnim : app?.write?.copy_byteToByteWithSrcMask || unsetLib,

		decode2 : null || unsetLib,
		decode4 : null || unsetLib,
		decode8 : null || unsetLib,
		
		_4decode2 : null || unsetLib,
		_4decode4 : null || unsetLib,
		_4decode8 : null || unsetLib,

		format2 : null || unsetLib,
		format4 : null || unsetLib,
		format8 : null || unsetLib,

		_4format2 : null || unsetLib,
		_4format4 : null || unsetLib,
		_4format8 : null || unsetLib,
		
		writeD2 : null || unsetLib,
		writeD4 : null || unsetLib,
		writeD8 : null || unsetLib,

		writeF2 : null || unsetLib,
		writeF4 : null || unsetLib,
		writeF8 : null || unsetLib,
	};

	o.Palette = function(data, gfxlib=gfxlib.palette){

		let obj = {};

		let buffer = new Uint8Array(512); obj.get_buffer = function(){return buffer};
		
		let src = data.ownerRefs;

		let offset = data.byteOffset || 0;

		obj.type = {
			decoded2  : null,
			decoded4  : null,
			decoded8  : null,
			formated2 : null,
			formated4 : null,
			formated8 : null,
		};


		let get_typeUpdate = function(){
			return {
				decoded2  : {func:gfxlib.decode2, args:[buffer,2]},
				decoded4  : {func:gfxlib.decode4, args:[buffer,4]},
				decoded8  : {func:gfxlib.decode8, args:[buffer,8]},
				formated2 : {func:gfxlib.format2, args:[buffer,2]},
				formated4 : {func:gfxlib.format4, args:[buffer,4]},
				formated8 : {func:gfxlib.format8, args:[buffer,8]},
			};
		};


		let get_typeSync = function(){
			let type = obj.type;
			return {
				decoded2  : {func:gfxlib.writeD2, args:[buffer,type.decoded2]},
				decoded4  : {func:gfxlib.writeD4, args:[buffer,type.decoded4]},
				decoded8  : {func:gfxlib.writeD8, args:[buffer,type.decoded8]},
				formated2 : {func:gfxlib.writeF2, args:[buffer,type.formated2,2]},
				formated4 : {func:gfxlib.writeF4, args:[buffer,type.formated4,4]},
				formated8 : {func:gfxlib.writeF8, args:[buffer,type.formated8,8]},
			};
		};


		let dataListToBuffer = {sens:0, copy:copy};
		let bufferToDataList = {sens:1, copy:copy};


		// reset src and settings
		obj.reset = function(data){
			src = data.ownerRefs;
			offset = data.byteOffset || 0;
		};


		// from src to buffer
		obj.init = function(){
			dataListToBuffer.copy(buffer, src, offset);
		};

		// from buffer to type
		obj.update = function(){
			let typeName = arguments;
			let typeUpdate = get_typeUpdate();
			let name, update;
			for(name of typeName){
				update = typeUpdate[name];
				obj.type[name] = update.func(...(update.args));
			}
		};

		// from type to buffer to src
		obj.save = function(typeName){
			obj.sync(typeName);
			obj.write();
		};
		
		// from type to buffer
		obj.sync = function(typeName){
			let typeSync = get_typeSync();
			let sync = typeSync[typeName];
			sync.func(...(sync.args));
		};

		// from buffer to src
		obj.write = function(){
			bufferToDataList.copy(buffer, src, offset);
		};
		

		return obj;

	};


	
	let gfxlibtileset = gfxlib.tileset;

	o.Tileset = function(data, bpp=4, animated=null, gfxlib=gfxlibtileset){

		let obj = {};

		let main = {};
		// 1024 * 32 = 32768

		let bufferSize = ({2:1024*16,4:1024*32,8:1024*64})[bpp];

		main.buffer = new Uint8Array(bufferSize);
		obj.get_buffer = function(){return main.buffer};
		main.src = data.ownerRefs;
		main.offset = data.byteOffset || 0;
		main.vramOfst = data.vramOffset || 0;

		let vram = {};
		vram.buffer = new Uint8Array(bufferSize),  // [byte, ...]
		vram.backRef = null;


		
		let anim = animated ? {} : null;
		if(anim){
			anim.buffers = [];
			anim.maxFrame = 0;
			let len = animated.ownerRefs.length;
			anim.len = len;
			anim.src = animated.ownerRefs;
			anim.vramRefs = JSON.parse(JSON.stringify(animated.vramRefs));
			anim._vramRefs = animated.vramRefs;
			for(let i=0; i<len; i++){
				anim.buffers[i] = new Uint8Array(bufferSize);
				anim.maxFrame = Math.max(anim.maxFrame, anim.vramRefs[i].frameCount);
				anim.vramRefs[i].destOffset += main.vramOfst;
			}
			
			// vram
			// multiple byte map stack
			vram.backRef = {
				// 0 : use main.buffer, 1 : use anim.buffers
				isAnim: new Uint8Array(bufferSize),
				// ref to an index in anim.buffers; use like that : anim.buffers[backRef.iAnim[i]]
				iAnim:  new Uint8Array(bufferSize),
				// ref to an index in anim.buffers[]; use like that : anim.buffers[backRef.iAnim[i]][backRef.iByte[i]]
				iByte:  new Uint16Array(bufferSize),
			};
			let backRef = vram.backRef;
			backRef.isAnim.fill(0);
			backRef.iAnim.fill(0);
			backRef.iByte.fill(0);
			gfxlib.vramBackRef(anim.buffers, anim.vramRefs, backRef);

			// Tileset obj
			anim.frame = 0;
		}

		/* obj.type = {
			decoded2  : [null,null,null,null],
			decoded4  : [null,null,null,null],
			decoded8  : [null,null,null,null],
			formated2 : [null,null,null,null],
			formated4 : [null,null,null,null],
			formated8 : [null,null,null,null],
		}; */

		let dataListToBuffer = {sens:0, copy:copy};
		let bufferToDataList = {sens:1, copy:copy};


		// from src to buffer/buffers
		obj.init = function(){
			dataListToBuffer.copy(main.buffer, main.src, main.offset);

			if(anim){
				// anim buffers
				let len = anim.len;
				let buffers = anim.buffers;
				for(let i=0; i<len; i++)
					//buffers[i].set(anim.src[i].data);
					gfxlib.clampCopy(0,0, anim.src[i].data,buffers[i], bufferSize);
			}
		};

		// from buffer to vram
		obj.load = function(){
			if(main.vramOfst < bufferSize)
				//vram.buffer.set(main.buffer, main.vramOfst);
				gfxlib.clampCopy(0,main.vramOfst, main.buffer,vram.buffer, bufferSize);
		};

		// from buffers to vram
		obj.anim = function(frame=0){
			if(frame < anim.maxFrame){
				gfxlib.anim_vram(anim.buffers, anim.vramRefs, vram.buffer, frame);
				anim.frame = frame;
			}
		};

		// from vram to buffer
		obj.vram = function(ignoreAnim=false){
			let len = gfxlib.clampLen2(bufferSize,bufferSize, 0,main.vramOfst, bufferSize);
			if(!anim || ignoreAnim){
				// copy all, no overlap checking
				gfxlib.ignoreAnim(main.vramOfst,0, vram.buffer,main.buffer, len);
			}else{
				// copy only not animated tiles
				gfxlib.avoidAnim(main.vramOfst,0, vram.buffer,main.buffer, len, vram.backRef.isAnim, 0);
			}
		};

		// from vram to buffers
		obj.frame = function(){
			gfxlib.vram_anim(anim.buffers, anim.vramRefs, vram.buffer, anim.frame);
		};

		// from vram to type
		obj.update = function(){

		};

		// from type to vram
		obj.sync = function(typeName){

		};

		// from type to vram to buffer/buffers to src
		obj.save = function(typeName){
			obj.sync(typeName);
			//obj.write();
		};

		// from buffer/buffers to src
		obj.write = function(){
			bufferToDataList.copy(main.buffer, main.src, main.offset);

			if(anim){
				// anim buffers
				let len = anim.len;
				let buffers = anim.buffers;
				for(let i=0; i<len; i++)
					gfxlib.clampCopy(0,0, buffers[i],anim.src[i].data, bufferSize);
			}
		};

		// debug
		//

		obj.get_vram = function(){
			return vram;
		};

		obj.get_allBuffer = function(){
			return {buffer:main.buffer, buffers:anim.buffers};
		};

		obj._vram = vram.buffer;
		obj._buffer = main.buffer;
		obj._buffers = anim.buffers;


		return obj;
	};



	// NO FINALLY NO DSTOFFSET, INSTEAD VRAMOFFSET SYSTEM
	// todo : add dstOffset
	let copy = function(buffer, dataList, srcOffset){
		let src = dataList;
		let len = src.length;
		let ofst = srcOffset;

		let bufferSize = buffer.length;

		let sens = this.sens;

		// zero data input
		if(len === 0) return;

		// one data input
		if(len === 1){

			let data = src[0].data;
			len = Math.min(bufferSize, data.length-ofst); // todo : bufferSize-dstOffset
			// len = Math.max(len, 0);

			if(sens === 0){
				for(let i=0; i<len; i++){ // todo : i=dstOffset
					buffer[i] = data[ofst];
					ofst++;
				}
				return;
			}
			if(sens === 1){
				for(let i=0; i<len; i++){ // todo : i=dstOffset
					data[ofst] = buffer[i];
					ofst++;
				}
				return;
			}
		// multiple data input
		}else{

			// make array list
			let list = [];
			let size = 0;
			let array;
			for(let i=0; i<len; i++){
				array = src[i].data;
				list.push(array);
				size += array.length;
			}

			// use HARD loopList system
			len = Math.min(bufferSize, size-ofst); // todo : bufferSize-dstOffset
			// len = Math.max(len, 0);
			let loops = app.lib.loopList.create(ofst, len, list);
			(function(L){ let len=L.length, $i,$l,$s,$_,$k, $N,$n,$S,$c;
				if(sens === 0){
					for($i=0,$l=L[$i], $s=$l[0],$_=$l[1],$S=$l[2], $n=L.d,$N=0, $k=1; $k; ){
					for($c=$s; $c<$_; $c++,$n++,$N++){
						// PROCESS CODE
						buffer[$N] = $S[$c]; // todo : $N+dstOffset
						// END 
					}$i++;if($i<len){$l=L[$i],$s=$l[0],$_=$l[1],$S=$l[2]}else{$k=0}
					}
					return;
				}
				if(sens === 1){
					for($i=0,$l=L[$i], $s=$l[0],$_=$l[1],$S=$l[2], $n=L.d,$N=0, $k=1; $k; ){
					for($c=$s; $c<$_; $c++,$n++,$N++){
						// PROCESS CODE
						$S[$c] = buffer[$N]; // todo : $N+dstOffset
						// END 
					}$i++;if($i<len){$l=L[$i],$s=$l[0],$_=$l[1],$S=$l[2]}else{$k=0}
					}
					return;
				}
			})(loops);

		}
	};

	return o;

})();