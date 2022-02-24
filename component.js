dkc2ldd.component = {};

dkc2ldd.component = (function(app=dkc2ldd){

	let o = {};

	let data = {
		ownerRefs : [], // array cell : {data,owner,index}
		byteOffset : 0
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

	o.Palette = function(data, gfxlib=gfxlib.palette){

		let obj = {};

		let buffer = new Uint8Array(512); obj.get_buffer = function(){return buffer};
		
		let src = (data?.ownerRefs) || [];

		let offset = (data?.byteOffset) || 0;

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

		/*let get_typeDirect = function(iSrc,iDst,len){
			let type = obj.type;
			let copy = {iSrc:iSrc,iDst:iDst,len:len};
			return {
				decoded2  : {func:gfxlib.writeD2, args:[buffer,type.decoded2,copy]},
				decoded4  : {func:gfxlib.writeD4, args:[buffer,type.decoded4,copy]},
				decoded8  : {func:gfxlib.writeD8, args:[buffer,type.decoded8,copy]},
				formated2 : {func:gfxlib.writeF2, args:[buffer,type.formated2,2,copy]},
				formated4 : {func:gfxlib.writeF4, args:[buffer,type.formated4,4,copy]},
				formated8 : {func:gfxlib.writeF8, args:[buffer,type.formated8,8,copy]},
			};
		};*/

		let dataListToBuffer = {sens:0, copy:copy};
		let bufferToDataList = {sens:1, copy:copy};

		// from src to buffer
		obj.init = function(){
			dataListToBuffer.copy(buffer, src, offset);
		};

		// from buffer to type
		obj.update = function(typeName=[]){
			let typeUpdate = get_typeUpdate();
			let name, update;
			for(name of typeName){
				update = typeUpdate[name];
				obj.type[name] = update.func(...(update.args));
			}
		};

		// from type to buffer to src
		obj.save = function(typeName=[]){
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
		
		/*// from type to src
		obj.direct = function(typeName, iSrc=0,iDst=0,len=0){
			let typeDirect = get_typeDirect(iSrc,iDst,len);
			let direct = typeDirect[typeName];
			direct.func(...(direct.args));
		};*/


		return obj;

	};

	

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
			len = Math.min(bufferSize, data.length-ofst);

			if(sens === 0){
				for(let i=0; i<len; i++){
					buffer[i] = data[ofst];
					ofst++;
				}
				return;
			}
			if(sens === 1){
				for(let i=0; i<len; i++){
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
			len = Math.min(bufferSize, size-ofst);
			let loops = app.lib.loopList.create(ofst, len, list);
			(function(L){ let len=L.length, $i,$l,$s,$_,$k, $N,$n,$S,$c;
				if(sens === 0){
					for($i=0,$l=L[$i], $s=$l[0],$_=$l[1],$S=$l[2], $n=L.d,$N=0, $k=1; $k; ){
					for($c=$s; $c<$_; $c++,$n++,$N++){
						// PROCESS CODE
						buffer[$N] = $S[$c];
						// END 
					}$i++;if($i<len){$l=L[$i],$s=$l[0],$_=$l[1],$S=$l[2]}else{$k=0}
					}
					return;
				}
				if(sens === 1){
					for($i=0,$l=L[$i], $s=$l[0],$_=$l[1],$S=$l[2], $n=L.d,$N=0, $k=1; $k; ){
					for($c=$s; $c<$_; $c++,$n++,$N++){
						// PROCESS CODE
						$S[$c] = buffer[$N];
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