
dkc2ldd.write = (function(app=dkc2ldd){

	let o = {};

	o.ext = {};
	o.def = {};
	

	o.get_clampedLength2 = function(sA, sB, oA, oB, l){
		// args : sizeA, sizeB, ofstA, ofstB, length
		let min = Math.min;
		let max = Math.max;
		return max( min( min(sA,oA+l)-oA, min(sB,oB+l)-oB ), 0 );
	};

	o.get_clampedLength = function(size, ofst, len){
		return Math.min(size,ofst+len) - ofst;
	};


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