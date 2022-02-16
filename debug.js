


dkc2debug.simul_loadedData = function(app=dkc2ldd){
	
	let data = this.preload;
	let sfp = app.interface.srcFilePanel;

	sfp.palette.set_oneDataFile({name:'ship deck palette', data:data.palettes, useDec:false}, true);
	sfp.tileset.set_oneDataFile({name:'ship deck tileset', data:data.compressedTileset, useDec:true}, true);
	sfp.mapchip.set_oneDataFile({name:'ship deck mapchip', data:data.compressedMapchip, useDec:true}, true);
	sfp.bgtileset.set_oneDataFile({name:'ship deck bg tileset', data:data.compressedBGtileset, useDec:true}, true);
	sfp.background.set_oneDataFile({name:'ship deck bg tilemap', data:data.compressedBGtilemap, useDec:true}, true);
	sfp.tilemap.set_oneDataFile({name:'ship deck tilemap', data:data.copressedLvlTilemap, useDec:true}, true);
	sfp.tilemap.parameters.value = "h 16";
	sfp.collisionmap.set_oneDataFile({name:'ship deck tilemap', data:data.compressedCollisionmap, useDec:false}, true);

	sfp.tilemap.decompressed[0] [0] = 0xD6
	sfp.tilemap.decompressed[0] [1] = 0x00
	
	sfp.tilemap.decompressed[0] [16*2+0] = 0xD6
	sfp.tilemap.decompressed[0] [16*2+1] = 0x40
	
	sfp.tilemap.decompressed[0] [2] = 0xD6
	sfp.tilemap.decompressed[0] [3] = 0x80
	
	sfp.tilemap.decompressed[0] [16*2+2] = 0xD6
	sfp.tilemap.decompressed[0] [16*2+3] = 0xc0
};

dkc2debug.simul_loadedData();



dkc2debug.gfxTest = {};

dkc2debug.gfxTest.TILESET = (function(app=dkc2ldd, dbg=dkc2debug){

	let testTile = [
		0x80,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x80,
		0x01,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x01
	];
	let overflowTile = [0x81,0x81,0x81,0x81,0x81];

	let testDecodedTile = [
		0xF,0x0,0xC,0x0,0x0,0x6,0x0,0x5,
		0x0,0x1,0x0,0x0,0x0,0x0,0xF,0x0,
		0xD,0x0,0xE,0x0,0x0,0x7,0x0,0x4,
		0x0,0x0,0x0,0x1,0x0,0x0,0x0,0x0,
		0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
		0xA,0x0,0x9,0x0,0x0,0x1,0x0,0xC,
		0x0,0x2,0x0,0x0,0x0,0x0,0xE,0x0,
		0xB,0x0,0x8,0x0,0x0,0x2,0x0,0x3,
	];
	let overflowDecodedTile = [1,2,3,4,5,6,7];

	// //////////////////////////////////////////////////////////

	let o = {};
	
	let RAWDAT = {};
	RAWDAT.src = [];
	RAWDAT.overflow = [0x81,0x81,0x81,0x81,0x81];
	RAWDAT.wrongdat = [
		0x80,true, 0x00,undefined, 0x00,false, "...",0x00, 4.5,0x00,  NaN,0x00,  [],0x00,   {},0x80,
		0x01,0x00, 0x00,0x00,      0x00,0x00,  0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x01
	];

	let DECODEDTILE = {};
	DECODEDTILE.overflow = [1,2,3,4,5,6,7];
	DECODEDTILE.wrongdat = [
		0xF,true,0xC,false,0x0,0x6,'..',0x5,
		0x0,0x1,0x0,0x0,0x0,0x0,0xF,undefined,
		0xD,NaN,0xE,0x0,[],0x7,0x0,0x4,
		0x0,0x0,0x0,0x1,0x0,{},0x0,0x0,
		0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
		0xA,0x0,0x9,0x0,0x0,0x1,0x0,0xC,
		0x0,0x2,0x0,0x0,0x0,0x0,0xE,0x0,
		0xB,0x0,0x8,0x0,0x0,0x2,0x0,0x3,
	];

	let FORMATEDTILE = {};
	FORMATEDTILE.overflow = [
		[1,2,3,4,5,6,7,8],
		[9,8,7,6],
		[],
		[2,9,0,7],
		[3,15],
	];
	
	FORMATEDTILE.wrongdat = [
		[],
		[9,0,0,0,0,0x10,0,8],
		NaN,
		[9,0,2,0,0,4,0,8],
		[undefined, NaN, "...", true, false, 4.5, [], {}],
		[9,0,0,12,7,0,0,8],
		undefined,
		[9,0,11,0,0,6,0,8],
	];

	let gfx = app.gfx;

	let ctx;

	let pal;

	let sttObj; //settingsObject


	o.DRAW_4BPPTILE = function(process, index, ofwd){

		let data = [];

		if(index > -1){
			data = RAWDAT.src;
		}else{
			data = RAWDAT[ofwd];
			index = 0;
		}

		gfx[process].draw_4bppTile(data, index, pal, 0,0, ctx, 0,0);
		gfx[process].draw_4bppTile(data, index, pal, 1,0, ctx, 8,0);
		gfx[process].draw_4bppTile(data, index, pal, 0,1, ctx, 0,8);
		gfx[process].draw_4bppTile(data, index, pal, 1,1, ctx, 8,8);
	};

	o.DRAW_4BPPTILESET = function(process, overflow, wrongdat){

		let data = RAWDAT.src;
		if(wrongdat) data = data.concat(RAWDAT.wrongdat);
		if(overflow) data = data.concat(RAWDAT.overflow);

		let _ = sttObj._;
		let w = sttObj.w;
		let h = sttObj.h;
		let xtmax = sttObj.xtmax;

		gfx[process].draw_4bppTileset(data, pal, 0,0, xtmax, ctx,x=0,y=0);
		gfx[process].draw_4bppTileset(data, pal, 1,0, xtmax, ctx,w+_,0);
		gfx[process].draw_4bppTileset(data, pal, 0,1, xtmax, ctx,0,h+_);
		gfx[process].draw_4bppTileset(data, pal, 1,1, xtmax, ctx,w+_,h+_);
	}


	o.DECODE_4BPPTILE = function(process, draw, index, ofwd){
	
		let data = [];

		if(index > -1){
			data = RAWDAT.src;
		}else{
			data = RAWDAT[ofwd];
			index = 0;
		}

		let decodedTile;

		decodedTile = gfx[process].decode_4bppTile(data, index);
		gfx[draw].draw_decodedTile(decodedTile, pal, 0,0, ctx);

		decodedTile = gfx[process].decode_4bppTile(data, index, 1,0);
		gfx[draw].draw_decodedTile(decodedTile, pal, 0,0, ctx, 8,0);

		decodedTile = gfx[process].decode_4bppTile(data, index, 0,1);
		gfx[draw].draw_decodedTile(decodedTile, pal, 0,0, ctx, 0,8);

		decodedTile = gfx[process].decode_4bppTile(data, index, 1,1);
		gfx[draw].draw_decodedTile(decodedTile, pal, 0,0, ctx, 8,8);
	};

	o.DRAW_DECODEDTILE = function(process, draw, index, ofwd){
	
		let decodedTile = [];

		if(index > -1){
			decodedTile = gfx[process].decode_4bppTile(RAWDAT.src, index);
		}else{
			decodedTile = DECODEDTILE[ofwd];
		}

		gfx[draw].draw_decodedTile(decodedTile, pal, 0,0, ctx);
		gfx[draw].draw_decodedTile(decodedTile, pal, 1,0, ctx, 8,0);
		gfx[draw].draw_decodedTile(decodedTile, pal, 0,1, ctx, 0,8);
		gfx[draw].draw_decodedTile(decodedTile, pal, 1,1, ctx, 8,8);
	};


	o.DECODE_4BPPTILESET = function(process, draw, overflow, wrongdat){

		let data = RAWDAT.src;
		if(wrongdat) data = data.concat(RAWDAT.wrongdat);
		if(overflow) data = data.concat(RAWDAT.overflow);

		let decodedTileset;
		let _ = sttObj._;
		let w = sttObj.w;
		let h = sttObj.h;
		let xtmax = sttObj.xtmax;

		decodedTileset = gfx[process].decode_4bppTileset(data);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 0,0, xtmax, ctx);

		decodedTileset = gfx[process].decode_4bppTileset(data, 1,0);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 0,0, xtmax, ctx, w+_,0);

		decodedTileset = gfx[process].decode_4bppTileset(data, 0,1);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 0,0, xtmax, ctx, 0,h+_);

		decodedTileset = gfx[process].decode_4bppTileset(data, 1,1);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 0,0, xtmax, ctx, w+_,h+_);

	};

	o.DRAW_DECODEDTILESET = function(process, draw, overflow, wrongdat){

		let decodedTileset = gfx[process].decode_4bppTileset(RAWDAT.src);
		if(wrongdat) decodedTileset = decodedTileset.concat(DECODEDTILE.wrongdat);
		if(overflow) decodedTileset = decodedTileset.concat(DECODEDTILE.overflow);

		let _ = sttObj._;
		let w = sttObj.w;
		let h = sttObj.h;
		let xtmax = sttObj.xtmax;

		gfx[draw].draw_decodedTileset(decodedTileset, pal, 0,0, xtmax, ctx);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 1,0, xtmax, ctx, w+_,0);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 0,1, xtmax, ctx, 0,h+_);
		gfx[draw].draw_decodedTileset(decodedTileset, pal, 1,1, xtmax, ctx, w+_,h+_);

	};
	

	o.FORMAT_4BPPTILE =  function(process, draw, index, ofwd){

		let data = [];

		if(index > -1){
			data = RAWDAT.src;
		}else{
			data = RAWDAT[ofwd];
			index = 0;
		}

		let formatedTile;

		formatedTile = gfx[process].format_4bppTile(data, index);
		gfx[draw].draw_formatedTile(formatedTile, pal, 0,0, ctx);

		formatedTile = gfx[process].format_4bppTile(data, index, 1,0);
		gfx[draw].draw_formatedTile(formatedTile, pal, 0,0, ctx, 8,0);

		formatedTile = gfx[process].format_4bppTile(data, index, 0,1);
		gfx[draw].draw_formatedTile(formatedTile, pal, 0,0, ctx, 0,8);

		formatedTile = gfx[process].format_4bppTile(data, index, 1,1);
		gfx[draw].draw_formatedTile(formatedTile, pal, 0,0, ctx, 8,8);

	};

	o.DRAW_FORMATEDTILE = function(process, draw, index, ofwd){
	
		let formatedTile = [];

		if(index > -1){
			formatedTile = gfx[process].format_4bppTile(RAWDAT.src, index);
		}else{
			formatedTile = FORMATEDTILE[ofwd];
		}

		gfx[draw].draw_formatedTile(formatedTile, pal, 0,0, ctx);
		gfx[draw].draw_formatedTile(formatedTile, pal, 1,0, ctx, 8,0);
		gfx[draw].draw_formatedTile(formatedTile, pal, 0,1, ctx, 0,8);
		gfx[draw].draw_formatedTile(formatedTile, pal, 1,1, ctx, 8,8);
	};


	o.FORMAT_4BPPTILESET = function(process, draw, overflow, wrongdat){

		let data = RAWDAT.src;
		if(wrongdat) data = data.concat(RAWDAT.wrongdat);
		if(overflow) data = data.concat(RAWDAT.overflow);

		let formatedTileset;
		let _ = sttObj._;
		let w = sttObj.w;
		let h = sttObj.h;
		let xtmax = sttObj.xtmax;

		formatedTileset = gfx[process].format_4bppTileset(data);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 0,0, xtmax, ctx);

		formatedTileset = gfx[process].format_4bppTileset(data, 1,0);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 0,0, xtmax, ctx, w+_,0);

		formatedTileset = gfx[process].format_4bppTileset(data, 0,1);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 0,0, xtmax, ctx, 0,h+_);

		formatedTileset = gfx[process].format_4bppTileset(data, 1,1);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 0,0, xtmax, ctx, w+_,h+_);

	};

	o.DRAW_FORMATEDTILESET = function(process, draw, overflow, wrongdat){

		let formatedTileset = gfx[process].format_4bppTileset(RAWDAT.src);
		if(wrongdat) formatedTileset = formatedTileset.concat([FORMATEDTILE.wrongdat]);
		if(overflow) formatedTileset = formatedTileset.concat([FORMATEDTILE.overflow]);

		let _ = sttObj._;
		let w = sttObj.w;
		let h = sttObj.h;
		let xtmax = sttObj.xtmax;

		gfx[draw].draw_formatedTileset(formatedTileset, pal, 0,0, xtmax, ctx);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 1,0, xtmax, ctx, w+_,0);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 0,1, xtmax, ctx, 0,h+_);
		gfx[draw].draw_formatedTileset(formatedTileset, pal, 1,1, xtmax, ctx, w+_,h+_);

	};

	let params = {
		'f' : 'fast',
		's' : 'safe',

		'o' : 'overflow',
		'w' : 'wrongdat',

		'd4t'  : 'DRAW_4BPPTILE',
		'd4ts' : 'DRAW_4BPPTILESET',

		'dt'  : 'DECODE_4BPPTILE',
		'ddt' : 'DRAW_DECODEDTILE',
	
		'dts'  : 'DECODE_4BPPTILESET',
		'ddts' : 'DRAW_DECODEDTILESET',

		'ft'  : 'FORMAT_4BPPTILE',
		'dft' : 'DRAW_FORMATEDTILE',
	
		'fts'  : 'FORMAT_4BPPTILESET',
		'dfts' : 'DRAW_FORMATEDTILESET'

	};
	
	o.do = function(parameters, srcData, palettes, viewport, settingsObject){
	
		ctx = viewport;
		pal = palettes;
		RAWDAT.src = srcData;

		sttObj = settingsObject;

		let p = parameters;
	
		let func = params[ p[0] ];

		if(func==='DRAW_4BPPTILE'){
			let process  = params[ p[1] ];
			let ofwd = params[ p[2] ];
			if(!ofwd){
				var index = parseInt(p[2]) || 0;
				o[func](process, index);
			}else{
				o[func](process, -1, ofwd);
			}
		}

		if(func==='DRAW_4BPPTILESET'){
			let process  = params[ p[1] ];
			let overflow = parseInt(p[2]) || 0;
			let wrongdat = parseInt(p[3]) || 0;

			o[func](process, overflow, wrongdat);
		}

		if(func==='DECODE_4BPPTILE' || func==='DRAW_DECODEDTILE'
		|| func==='FORMAT_4BPPTILE' || func==='DRAW_FORMATEDTILE'){
			let process  = params[ p[1] ];
			let draw     = params[ p[2] ];
			let ofwd = params[ p[3] ];
			if(!ofwd){
				var index = parseInt(p[3]) || 0;
				o[func](process, draw, index);
			}else{
				o[func](process, draw, -1, ofwd);
			}
		}

		if(func==='DECODE_4BPPTILESET' || func==='DRAW_DECODEDTILESET'
		|| func==='FORMAT_4BPPTILESET' || func==='DRAW_FORMATEDTILESET'){
			let process  = params[ p[1] ];
			let draw     = params[ p[2] ];
			let overflow = parseInt(p[3]) || 0;
			let wrongdat = parseInt(p[4]) || 0;

			o[func](process, draw, overflow, wrongdat);
		}


	
		
		
	
	};


	return o;

})();



// perfomance test
(function(){

	dkc2debug.performance = {};
	
	dkc2debug.performance.test = {};
	
	dkc2debug.performance.test.parseInt_VS_mathFloor = {};
	
	dkc2debug.performance.test.parseInt_VS_mathFloor.count = 100000000;
	
	dkc2debug.performance.test.parseInt_VS_mathFloor.parseInt = 0;
	dkc2debug.performance.test.parseInt_VS_mathFloor.mathFloor = 0;
	
	dkc2debug.performance.test.parseInt = function(){
	
		// parseInt faster than Math.floor
	
		let count = dkc2debug.performance.test.parseInt_VS_mathFloor.count;
		let mid = count / 2;
		let t, tt;
	
		let a = 0;
	
		t = performance.now();
		for(let i=0; i<count; i++)
			a += parseInt(i/mid);
		tt = performance.now(); - t;
	
		dkc2debug.performance.test.parseInt_VS_mathFloor.parseInt += tt
		console.log("parseInt   : ", tt, a);
	
	};
	
	dkc2debug.performance.test.mathFloor = function(){
	
		// parseInt faster than Math.floor
	
		let count = 100000000;
		let mid = count / 2;
		let t, tt;
	
		let a = 0;
	
		t = performance.now();
		for(let i=0; i<count; i++)
			a += Math.floor(i/mid);
		tt = performance.now(); - t;
	
		dkc2debug.performance.test.parseInt_VS_mathFloor.mathFloor += tt;
		console.log("Math.floor : ", tt, a);
	
	};
	
	dkc2debug.performance.test.parseInt_mathFloor = function(){
	
		// parseInt faster than Math.floor
	
		let count = 100000000;
		let mid = count / 2;
		let t, tt;
	
		let a = 0;
		let b = 0;
	
		let C = [];
	
		for(let i=0; i<count; i++){
			a += parseInt(i/mid);
			b += Math.floor(i/mid);
			if(a !== b) C.push(i);
		}
	
	
	
		dkc2debug.performance.test.parseInt_VS_mathFloor.mathFloor += tt;
		console.log(" : ", a, b, C);
	
	};
	
	// !!!! parseInt(2e-8)   === 2 : bad
	// !!!! Math.floor(2e-8) === 0 : good
	// math floor and parse int are not comparable
	
	dkc2debug.performance.test.intDivInt_withMathFloor_VS_without = function(){
	
		// (int/int)/int faster than Math.floor(int/int)/int (force int division is not faster)
	
		let count = 10000000000;
		let mid = count / 2;
	
		let a=0, b=0, c=0, d=0;
	
		let t, tt0, tt1;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			a = (i / 2);
			b += (a / 33);
		}
		tt0 = performance.now() - t;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			c = Math.floor(i / 2);
			d += (c / 33);
		}
		tt1 = performance.now() - t;
	
		console.log("without floor : ", tt0, b);
		console.log("with floor    : ", tt1, d);
	
	};
	
	dkc2debug.performance.test.arrayPush_VS_arrayLength = function(){
	
		// array.push as faster as array[array.length]=
		// not sure
	
		let count = 10000000/2;
		let mid = count / 2;
	
		let a = [];
		let b = [];
	
		let c = 0;
	
		let t, tt0, tt1;
	
		for(let i=0; i<count; i++){
			c++;
		}
	
		t = performance.now();
		for(let i=0; i<count; i++){
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
			a.push( i );
		}
		tt0 = performance.now() - t;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
			b[b.length] = i;
		}
		tt1 = performance.now() - t;
	
	
	
	
	
	
		console.log("push   : ", tt0);
		console.log("length : ", tt1);
	
	};
	
	dkc2debug.performance.test.incPlusPlus_VS_incPlus2 = function(){
	
		// inc++ as faster as than +=2
		// not sure
	
		let count = 1000000000;
		let mid = count / 2;
	
		let a = 0;
		let b = 0;
	
		let t, tt, tt0=0, tt1=0, tt2=0;
	
		let ttt;
	
		ttt = performance.now();
	
		t = performance.now();
		for(let i=0; i<count; i++){
			a++;
		}
		tt0 = performance.now() - t;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			b += 2;
		}
		tt1 = performance.now() - t;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			a++;
		}
		tt2 = performance.now() - t;
	
		console.log("inc++ : ", tt0);
		console.log("+= 2  : ", tt1);
		console.log("inc++ : ", tt2);
	
		return ttt;
	};
	
	dkc2debug.performance.test.forI64_VS_forXY8 = function(){
	
		// for i 64 faster than for xy 8
	
		let count = 10000000;
		let mid = count / 2;
	
		let a = 0;
		let b = 0;
	
		let t, tt, tt0=0, tt1=0, tt2=0;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			for(let y=0; y<8; y++){
			for(let x=0; x<8; x++){
				a++;
			}}
		}
		tt1 = performance.now();
		tt1 -= t;
	
		t = performance.now();
		for(let i=0; i<count; i++){
			for(let ii=0; ii<64; ii++){
				b++;
			}
		}
		tt0 = performance.now();
		tt0 -= t;
	
		
	
		
	
		console.log("i 64 : ", tt0);
		console.log("xy 8 : ", tt1);
	
		return a+b;
	};





	dkc2debug.normalfast_decode_4bppTile = function(data, index){
		let tOffset = index * 32;
		let rOffset;
		let bOffsets
		let b0, b1, b2, b3;
		let tile = [];
		let col;
		for(let row=0; row<8; row++){
			rOffset = row * 2; // row offset
			bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
			b0 = data[ tOffset + bOffsets[0] ];
			b1 = data[ tOffset + bOffsets[1] ];
			b2 = data[ tOffset + bOffsets[2] ];
			b3 = data[ tOffset + bOffsets[3] ];
			// by row pixel
			for(let pix=0x80; pix>0x00; pix=pix>>1){
				col = 0;
				col += b0 & pix ? 0x1 : 0x0;
				col += b1 & pix ? 0x2 : 0x0;
				col += b2 & pix ? 0x4 : 0x0;
				col += b3 & pix ? 0x8 : 0x0;
				tile.push(col);
			}
		}
		return tile;
	};
	dkc2debug.veryfast_decode_4bppTile = function(data, index){
		let tOffset = index * 32;
		let rOffset;
		let bOffsets
		let b0, b1, b2, b3;
		let tile = [];
		let col;
		let _1 = dkc2ldd.ref._4bpp._1;
		let _2 = dkc2ldd.ref._4bpp._2;
		let _4 = dkc2ldd.ref._4bpp._4;
		let _8 = dkc2ldd.ref._4bpp._8;
		for(let row=0; row<8; row++){
			rOffset = row * 2; // row offset
			bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
			b0 = data[ tOffset + bOffsets[0] ];
			b1 = data[ tOffset + bOffsets[1] ];
			b2 = data[ tOffset + bOffsets[2] ];
			b3 = data[ tOffset + bOffsets[3] ];
			// by row pixel
			for(let pix=0x80; pix>0x00; pix=pix>>1){
				col = 0;
				col += _1[b0&pix];
				col += _2[b1&pix];
				col += _4[b2&pix];
				col += _8[b3&pix];
				tile.push(col);
			}
		}
		return tile;
	};
	dkc2debug.performance.test.ternaire_VS_reftbl = function(){
	
		// ternaire(normalfast_decode_4bppTile) faster than reftbl(veryfast_decode_4bppTile)
	
		let count = 10000000;
		let mid = count / 2;
	
		let a;
		let b;
	
		let t, tt, tt0=0, tt1=0, tt2=0;

		let data = dkc2ldd.interface.srcFilePanel.tileset.get_data__OLD();
	
		t = performance.now();
		for(let i=0; i<count; i++){
			b = dkc2debug.veryfast_decode_4bppTile(data, 15);
		}
		tt1 = performance.now();
		tt1 -= t;

		t = performance.now();
		for(let i=0; i<count; i++){
			a = dkc2debug.normalfast_decode_4bppTile(data, 15);
		}
		tt0 = performance.now();
		tt0 -= t;
		
		console.log("normalfast : ", tt0);
		console.log("veryfast   : ", tt1);
	
		return [a, b];
	};


})();
