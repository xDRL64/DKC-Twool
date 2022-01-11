
dkc2ldd.ref = (function(){

	let o = {};

	let get_flipTable = function(type){
	
		if(type === 2)
			return [ [0,1], [1,0] ];
	
		if(type === 4)
			return [ [0,1,2,3], [3,2,1,0] ];
	
		if(type === 8)
			return [ [0,1,2,3,4,5,6,7], [7,6,5,4,3,2,1,0] ];
	
		if(type === 32)
			return [
				[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
				[31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]
			];
		
		if(type === 'byte')
			return [
				{0x01:0x01,0x02:0x02,0x04:0x04,0x08:0x08,0x10:0x10,0x20:0x20,0x40:0x40,0x80:0x80},
				{0x01:0x80,0x02:0x40,0x04:0x20,0x08:0x10,0x10:0x08,0x20:0x04,0x40:0x02,0x80:0x01}
			];
		
	};
	o.get_flipTable = get_flipTable;


	o.bitvalToBitnum = {0x01:0, 0x02:1, 0x04:2, 0x08:3, 0x10:4, 0x20:5, 0x40:6, 0x80:7};
	o.bitvalToPixnum = {0x01:7, 0x02:6, 0x04:5, 0x08:4, 0x10:3, 0x20:2, 0x40:1, 0x80:0};

	o._4bpp = {
		_1 : {0x00:0, 0x01:1, 0x02:1, 0x04:1, 0x08:1, 0x10:1, 0x20:1, 0x40:1, 0x80:1},
		_2 : {0x00:0, 0x01:2, 0x02:2, 0x04:2, 0x08:2, 0x10:2, 0x20:2, 0x40:2, 0x80:2},
		_4 : {0x00:0, 0x01:4, 0x02:4, 0x04:4, 0x08:4, 0x10:4, 0x20:4, 0x40:4, 0x80:4},
		_8 : {0x00:0, 0x01:8, 0x02:8, 0x04:8, 0x08:8, 0x10:8, 0x20:8, 0x40:8, 0x80:8},
	};
	
	let get_4bppRowOffsetTable = function(){
		return [ 0, 1, 16, 17 ];
	};
	o.get_4bppRowOffsetTable = get_4bppRowOffsetTable;
	
	let get_4bppRowOffset = function(iR){
		let rOffset = iR * 2;
		return [ rOffset, rOffset+1, rOffset+16, rOffset+17 ];
	};
	o.get_4bppRowOffset = get_4bppRowOffset;
	
	let get_8bitsMaskTable = function(){
		return [ 0x01, 0x02, 0x04, 0x08,  0x10, 0x20, 0x40, 0x80 ];
	};
	o.get_8bitsMaskTable = get_8bitsMaskTable;
	
	
	o.hTilemapPixpos_to_tile = function(xp,yp, ytmax, hLvlTilemap){
		
		let o = {};
		
		// [0 to xytmax] tile coordinates on 2D tilemap
		o.xt = Math.floor(xp / 32);
		o.yt = Math.floor(yp / 32);
		
		// [0 to 32] tile pixel coordinates on 2D tile
		o.xtp = xp % 32;
		o.ytp = yp % 32;
		
		// [0 to xyfmax] absolute chip frag coordinates
		o.xtf = Math.floor(xp / 8);
		o.ytf = Math.floor(yp / 8);
		
		// tile index in tilemap data
		o.iT = (o.xt*ytmax) + o.yt;
		
		// first byte position of tile in tilemap data
		let offset = o.iT * 2;
		
		let A = hLvlTilemap[offset];
		let B = hLvlTilemap[offset+1];
		
		let highByte = B;
		let lowByte = A;
		
		o.chipIndex = ((highByte&0x0F)<<8) + lowByte;
		//chipOffset = iChip * 32;
		
		o.hFlip = (highByte & 0x40) >> 6;
		o.vFlip = (highByte & 0x80) >> 7;
		
		o.offset = offset;
		o.rawData = [A,B];
		o.swapped = [B,A];
		
		return o;
	};
	
	o.chipPixpos_to_chipFrag = function(xp,yp, iChip, mapchip, hFlip=0,vFlip=0){
	
		let o = {};
	
		// [0 to 3] screen chip frag position
		o.xcf = Math.floor(xp / 8);
		o.ycf = Math.floor(yp / 8);
	
		// [0 to 7] chip frag coordinates
		o.x8p = xp % 8;
		o.y8p = yp % 8;
		
		// [7 to 0] chip frag coordinates relative to flip
		let flip8 = get_flipTable(8);
		o.xf8 = flip8[hFlip][o.x8p];
		o.yf8 = flip8[vFlip][o.y8p];
	
		// [31 to 0] flipped tile pixel position
		let pixflip = get_flipTable(32);
		o.xcp = pixflip[hFlip][xp];
		o.ycp = pixflip[vFlip][yp];
	
		// [3 to 0] flipped chip frag position
		let fragflip = get_flipTable(4);
		o.xFrag = fragflip[hFlip][o.xcf];
		o.yFrag = fragflip[vFlip][o.ycf];
	
		// chip frag index
		o.iFrag = (o.yFrag*4) + o.xFrag;
		
		let fragOffset = o.iFrag * 2;
		
		let offset = (iChip*32) + fragOffset;
		
		let A = mapchip[offset];
		let B = mapchip[offset+1];
		
		let highByte = B;
		let lowByte = A;
		
		o.tile8x8Index = ( (highByte & 0x03) << 8 ) + lowByte;
				
		o.paletteIndex = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
	
		o.hFlip = (highByte & 0x40) >> 6;
		o.vFlip = (highByte & 0x80) >> 7;
		
		o.priority = (highByte & 0x20) >> 5;
		
		o.offset = offset;
		o.rawData = [A,B];
		o.swapped = [B,A];
	
		return o;
	};

	
	o.t8x8PixPos_to_4bppData = function(xp, yp, iTile, tileset, hFlip=0,vFlip=0){
	
		let o = {};
		
		let flip8 = get_flipTable(8);
		
		o.iRow = flip8[vFlip][yp];
		
		o.iPix = flip8[hFlip][xp];
		
		o.iBit = flip8[1][o.iPix];
		
		o.mask = get_8bitsMaskTable()[o.iBit];
		
		o.tileOffset = iTile * 32;
		
		let o4bpp = get_4bppRowOffset(o.iRow);
		
		o.rowOffsets = [
			o.tileOffset + o4bpp[0],
			o.tileOffset + o4bpp[1],
			o.tileOffset + o4bpp[2],
			o.tileOffset + o4bpp[3]
		];
		
		let A = tileset[ o.rowOffsets[0] ];
		let B = tileset[ o.rowOffsets[1] ];
		let C = tileset[ o.rowOffsets[2] ];
		let D = tileset[ o.rowOffsets[3] ];
		
		o.iCol = 0;
		
		o.iCol += A & o.mask ? 0x1 : 0x0;
		o.iCol += B & o.mask ? 0x2 : 0x0;
		o.iCol += C & o.mask ? 0x4 : 0x0;
		o.iCol += D & o.mask ? 0x8 : 0x0;
		
		o.rawData = [A,B,C,D];
		
		return o;
	
	};
	

	return o;

})();