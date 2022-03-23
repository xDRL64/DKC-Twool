
dkc2ldd.write = (function(app=dkc2ldd){

	let o = {};

	o.ext = {};
	o.def = {};
	
	//////////////////////////////////////////////
	//////////// BYTE BUFFER /////////////////////
	//////////////////////////////////////////////

	o.get_clampedLength2 = function(sA, sB, oA, oB, l){
		// args : sizeA, sizeB, ofstA, ofstB, length
		let min = Math.min;
		let max = Math.max;
		return max( min( min(sA,oA+l)-oA, min(sB,oB+l)-oB ), 0 );
	};

	o.get_clampedLength = function(size, ofst, len){
		return Math.min(size,ofst+len) - ofst;
	};

	o.clampedCopy = function(iSrc,iDst,bSrc,bDst,len){
		len = o.get_clampedLength2(bSrc.length,bDst.length, iSrc,iDst, len);
		o.copy_byteToByte(iSrc,iDst,bSrc,bDst,len);
	};

	o.copy_byteToByte = function(iSrc,iDst,bSrc,bDst,len){
		for(let i=0; i<len; i++){
			bDst[iDst] = bSrc[iSrc];
			iSrc++;
			iDst++;
		}
	};

	o.copy_byteToByteWithSrcMask = function(iSrc,iDst,bSrc,bDst,len, srcMask, maskCopyVal){
		for(let i=0; i<len; i++){
			if(srcMask[iSrc] === maskCopyVal)
				bDst[iDst] = bSrc[iSrc];
			iSrc++;
			iDst++;
		}
	};

	//////////////////////////////////////////////
	/////////////// PALETTE TYPE /////////////////
	//////////////////////////////////////////////

	o.decodedPalette = function(snespal, palette){

		let len = Math.min(palette.length, snespal.length>>1);
		let p = palette, c;
		let dstOfst = 0;

		for(let i=0; i<len; i++){
			// convert & encode
			c = ((p[i][2]>>3)<<10) + ((p[i][1]>>3)<<5) + ((p[i][0]>>3));
			// swap
			snespal[dstOfst]   = (c&0x00FF);      // A
			snespal[dstOfst+1] = (c&0xFF00) >> 8; // B
			dstOfst += 2;
		}
	};

	o.formatedPalette = function(snespal, palette, bitDepth){

		if(bitDepth === 8){
			o.decodedPalette(snespal, palette[0]);
			return;
		}

		let colPerPal = ({2:4,4:16})[bitDepth];

		let dstOfst = 0;

		let p, c;

		for(let iPal=0; iPal<8; iPal++){
			p = palette[iPal];
			for(let iCol=0; iCol<colPerPal; iCol++){
				// convert & encode
				c = ((p[iCol][2]>>3)<<10) + ((p[iCol][1]>>3)<<5) + ((p[iCol][0]>>3));
				// swap
				snespal[dstOfst]   = (c&0x00FF);      // A
				snespal[dstOfst+1] = (c&0xFF00) >> 8; // B
				dstOfst += 2;
			}

		}

	};


	// extended version
	// takes : source color index, destination color index, color length to write

	o.ext.decodedPalette = function(snespal, palette, len,iSrc=0,iDst=0){

		if(len === 0) return;

		len = len || Math.min(palette.length, snespal.length>>1);
		let dstOfst = iDst * 2;

		let p = palette, c;
		let end = iSrc + len;
		for(let i=iSrc; i<end; i++){
			// convert & encode
			c = ((p[i][2]>>3)<<10) + ((p[i][1]>>3)<<5) + ((p[i][0]>>3));
			// swap
			snespal[dstOfst]   = (c&0x00FF);      // A
			snespal[dstOfst+1] = (c&0xFF00) >> 8; // B
			dstOfst += 2;
		}

	};

	o.ext.formatedPalette = function(snespal, palette, bitDepth, len, iSrc=0,iDst=0){

		if(len === 0) return;

		if(bitDepth === 8){
			o.ext.decodedPalette(snespal, palette[0], len, iSrc,iDst);
			return;
		}

		let colPerPal = ({2:4,4:16})[bitDepth];

		let dstOfst = iDst * 2;

		len = len || Math.min(colPerPal*8, snespal.length>>1);
		
		let p, c;

		let palStart = Math.floor(iSrc / colPerPal);
		let colStart = iSrc % colPerPal;

		let srcLast = iSrc + len - 1;
		let palLast = Math.floor(srcLast / colPerPal);
		let palLen = palLast + 1;
		let colLast = srcLast % colPerPal;
		let colLen;

		for(let iPal=palStart; iPal<palLen; iPal++){
			p = palette[iPal];
			colLen = iPal===palLast ? colLast+1 : colPerPal;
			for(let iCol=colStart; iCol<colLen; iCol++){
				// convert & encode
				c = ((p[iCol][2]>>3)<<10) + ((p[iCol][1]>>3)<<5) + ((p[iCol][0]>>3));
				// swap
				snespal[dstOfst]   = (c&0x00FF);      // A
				snespal[dstOfst+1] = (c&0xFF00) >> 8; // B
				dstOfst += 2;
			}
			colStart = 0;
		}


	};




	//////////////////////////////////////////////
	/////////////// TILESET TYPE /////////////////
	//////////////////////////////////////////////


	let tileBppSize = app.gfx.tileBpp.size;
	let tileBppBitshif = app.gfx.tileBpp.bitshit;

	o.decodedTileset = function(byteBuffer, tileset, bpp){

		//let len = Math.max(1024, tileset.length);
		let len = 1024;
		let defTile = new Uint8Array(64); // default decoded tile
		defTile.fill(0);

		let tOfst = 0;
		let rOfst;
		let ofst = 0;

		let tile, iPix;

		let A,B,C,D, E,F,G,H;

		let c;

		if(bpp === 2){
			for(let iTile=0; iTile<len; iTile++){
	
				tile = tileset[iTile] || defTile;
				//rOfst = 0;
				iPix = 0;
	
				for(let row=0; row<8; row++){
					A = 0; B = 0;
					for(let bit=0x80; bit>0x0; bit=bit>>1){
		
						c = tile[iPix];
							
						A += c & 0x01 ? bit : 0;
						B += c & 0x02 ? bit : 0;
	
						iPix++;
					}
					//byteBuffer[tOfst + rOfst    ] = A;
					//byteBuffer[tOfst + rOfst + 1] = B;
					byteBuffer[ofst    ] = A;
					byteBuffer[ofst + 1] = B;
		
					//rOfst += 2;
					ofst += 2;
				}
	
				//tOfst += 16;
				
			}
			return;
		}

		if(bpp === 4){
			for(let iTile=0; iTile<len; iTile++){
	
				tile = tileset[iTile] || defTile;
				//rOfst = 0;
				iPix = 0;
	
				for(let row=0; row<8; row++){
					A = 0; B = 0; C = 0; D = 0;
					for(let bit=0x80; bit>0x0; bit=bit>>1){
		
						c = tile[iPix];
							
						A += c & 0x01 ? bit : 0;
						B += c & 0x02 ? bit : 0;
						C += c & 0x04 ? bit : 0;
						D += c & 0x08 ? bit : 0;
	
						iPix++;
					}
					//byteBuffer[tOfst + rOfst    ] = A;
					//byteBuffer[tOfst + rOfst + 1] = B;
					byteBuffer[ofst    ] = A;
					byteBuffer[ofst + 1] = B;
					byteBuffer[ofst + 16] = C;
					byteBuffer[ofst + 17] = D;
		
					//rOfst += 2;
					ofst += 2;
				}
	
				//tOfst += 16;
				ofst += 16;
				
			}
			return;
		}

		if(bpp === 8){
			for(let iTile=0; iTile<len; iTile++){
	
				tile = tileset[iTile] || defTile;
				//rOfst = 0;
				iPix = 0;
	
				for(let row=0; row<8; row++){
					A = 0; B = 0; C = 0; D = 0;
					E = 0; F = 0; G = 0; H = 0;
					for(let bit=0x80; bit>0x0; bit=bit>>1){
		
						c = tile[iPix];
							
						A += c & 0x01 ? bit : 0;
						B += c & 0x02 ? bit : 0;
						C += c & 0x04 ? bit : 0;
						D += c & 0x08 ? bit : 0;
	
						E += c & 0x10 ? bit : 0;
						F += c & 0x20 ? bit : 0;
						G += c & 0x40 ? bit : 0;
						H += c & 0x80 ? bit : 0;
	
						iPix++;
					}
					//byteBuffer[tOfst + rOfst    ] = A;
					//byteBuffer[tOfst + rOfst + 1] = B;
					byteBuffer[ofst    ] = A;
					byteBuffer[ofst + 1] = B;
					byteBuffer[ofst + 16] = C;
					byteBuffer[ofst + 17] = D;
					
					byteBuffer[ofst + 32] = E;
					byteBuffer[ofst + 33] = F;
					byteBuffer[ofst + 48] = G;
					byteBuffer[ofst + 49] = H;
		
					//rOfst += 2;
					ofst += 2;
				}
	
				//tOfst += 16;
				ofst += 48;
				
			}
			return;
		}

	};





	// not still tested !!!
	o.formatedTileset = function(byteBuffer, tileset, bpp){

		//let len = Math.max(1024, tileset.length);
		//let len = 1024;
		let bufferTileCount = byteBuffer.length >> tileBppBitshif[bpp];
		let len = Math.min(bufferTileCount, tileset.length);

		let defTile = new Array(8); // default formated tile
		defTile.fill(new Uint8Array(8));

		let tOfst = 0;
		let rOfst;
		let ofst = 0;

		let tile, iPix;

		let A,B,C,D, E,F,G,H;

		let c;

		if(bpp === 2){
			for(let iTile=0; iTile<len; iTile++){
	
				tile = tileset[iTile] || defTile;
				
				for(let row=0; row<8; row++){
					iPix = 0;
					A = 0; B = 0;
					for(let bit=0x80; bit>0x0; bit=bit>>1){
		
						c = tile[row][iPix];
							
						A += c & 0x01 ? bit : 0;
						B += c & 0x02 ? bit : 0;
	
						iPix++;
					}

					byteBuffer[ofst    ] = A;
					byteBuffer[ofst + 1] = B;
		
					ofst += 2;
				}
			}
			return;
		}

		if(bpp === 4){
			for(let iTile=0; iTile<len; iTile++){
	
				tile = tileset[iTile] || defTile;

				for(let row=0; row<8; row++){
					iPix = 0;
					A = 0; B = 0; C = 0; D = 0;
					for(let bit=0x80; bit>0x0; bit=bit>>1){
		
						c = tile[row][iPix];
							
						A += c & 0x01 ? bit : 0;
						B += c & 0x02 ? bit : 0;
						C += c & 0x04 ? bit : 0;
						D += c & 0x08 ? bit : 0;
	
						iPix++;
					}

					byteBuffer[ofst     ] = A;
					byteBuffer[ofst +  1] = B;
					byteBuffer[ofst + 16] = C;
					byteBuffer[ofst + 17] = D;
		
					ofst += 2;
				}
				ofst += 16;
			}
			return;
		}

		if(bpp === 8){
			for(let iTile=0; iTile<len; iTile++){
	
				tile = tileset[iTile] || defTile;
				
				for(let row=0; row<8; row++){
					iPix = 0;
					A = 0; B = 0; C = 0; D = 0;
					E = 0; F = 0; G = 0; H = 0;
					for(let bit=0x80; bit>0x0; bit=bit>>1){
		
						c = tile[row][iPix];
							
						A += c & 0x01 ? bit : 0;
						B += c & 0x02 ? bit : 0;
						C += c & 0x04 ? bit : 0;
						D += c & 0x08 ? bit : 0;
	
						E += c & 0x10 ? bit : 0;
						F += c & 0x20 ? bit : 0;
						G += c & 0x40 ? bit : 0;
						H += c & 0x80 ? bit : 0;
	
						iPix++;
					}

					byteBuffer[ofst     ] = A;
					byteBuffer[ofst +  1] = B;
					byteBuffer[ofst + 16] = C;
					byteBuffer[ofst + 17] = D;
					
					byteBuffer[ofst + 32] = E;
					byteBuffer[ofst + 33] = F;
					byteBuffer[ofst + 48] = G;
					byteBuffer[ofst + 49] = H;
		
					ofst += 2;
				}
				ofst += 48;
			}
			return;
		}

	};





	o.set_4bppPix = function(tileset, byteOffsets, bitMask, colorIndex, rawData){
	
		let _o = byteOffsets;
		
		let d = [...rawData];
		
		let m = bitMask;
		
		let m0 = 0xFF - m; // AND
		let m1 = m; // OR
		
		let c = colorIndex; // color index
		
		d[0] = c&0x1 ? d[0]|m1 : d[0]&m0;
		d[1] = c&0x2 ? d[1]|m1 : d[1]&m0;
		d[2] = c&0x4 ? d[2]|m1 : d[2]&m0;
		d[3] = c&0x8 ? d[3]|m1 : d[3]&m0;
		
		tileset[ _o[0] ] = d[0];
		tileset[ _o[1] ] = d[1];
		tileset[ _o[2] ] = d[2];
		tileset[ _o[3] ] = d[3];
	
	};


	return o;

})();