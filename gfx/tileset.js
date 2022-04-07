
(function(app=dkc2ldd){

	app.gfx = app.gfx || {};
	let gfx = app.gfx;

	gfx.fast = gfx.fast || {};
	let fast = gfx.fast;

	gfx.safe = gfx.safe || {};
	let safe = gfx.safe;

	// UNDEFDAT : return empty array
	// NOLENGTH : return empty array
	// OVERFLOW : clip data overflow
	// WRONGVAL : get zero values

	fast.decode_2bppTileset = function(data, hFlip=0,vFlip=0){

		if(!data) return [];

		let len = data.length >> 4; // div by 16
		let tile, tileset = new Array(len);

		let iT, tOffset, rOfst, rLen;
		let iPix, pix;

		let b0, b1;

		if( (hFlip|vFlip) === 0 ){

			for(iT=0; iT<len; iT++){

				tileset[iT] = tile = new Uint8Array(64);
				tOffset = iT << 4; // mul by 16
				iPix = 0;
				rLen = tOffset + 16;

				// by row
				for(rOfst=tOffset; rOfst<rLen; rOfst+=2){

					b0 = data[rOfst]; b1 = data[rOfst+1];
					
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						tile[iPix] = 
							(b0 & pix ? 0x1 : 0x0) +
							(b1 & pix ? 0x2 : 0x0) ;

						iPix++;
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let row, fPix;

			for(iT=0; iT<len; iT++){

				tileset[iT] = tile = new Uint8Array(64);
				tOffset = iT << 4; // mul by 16
				iPix = 0;

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (flip8[row] << 1); // mul by 2
					
					b0 = data[rOfst]; b1 = data[rOfst+1];

					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						tile[iPix] = 
							(b0 & fPix ? 0x1 : 0x0) +
							(b1 & fPix ? 0x2 : 0x0) ;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};

	fast.decode_4bppTileset = function(data, hFlip=0,vFlip=0){

		if(!data) return [];

		let len = data.length >> 5; // div by 32
		let tile, tileset = [];

		let iT, tOffset, rOfst, rLen;
		let iPix, pix;

		let b0, b1, b2, b3;

		if( (hFlip|vFlip) === 0 ){

			for(iT=0; iT<len; iT++){

				tileset[iT] = tile = new Uint8Array(64);
				tOffset = iT << 5; // mul by 32
				iPix = 0;
				rLen = tOffset + 16;

				// by row
				for(rOfst=tOffset; rOfst<rLen; rOfst+=2){

					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						tile[iPix] =
							(b0 & pix ? 0x1 : 0x0) +
							(b1 & pix ? 0x2 : 0x0) +
							(b2 & pix ? 0x4 : 0x0) +
							(b3 & pix ? 0x8 : 0x0) ;

						iPix++;
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let row, fPix;

			for(iT=0; iT<len; iT++){

				tileset[iT] = tile = new Uint8Array(64);
				tOffset = iT << 5; // mul by 32
				iPix = 0;

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (flip8[row] << 1); // mul by 2
					
					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];

					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						tile[iPix] =
							(b0 & fPix ? 0x1 : 0x0) +
							(b1 & fPix ? 0x2 : 0x0) +
							(b2 & fPix ? 0x4 : 0x0) +
							(b3 & fPix ? 0x8 : 0x0) ;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};

	fast.decode_8bppTileset = function(data, hFlip=0,vFlip=0){

		if(!data) return [];

		let len = data.length >> 6; // div by 64
		let tile, tileset = [];

		let iT, tOffset, rOfst, rLen;
		let iPix, pix;

		let b0, b1, b2, b3, b4, b5, b6, b7;

		if( (hFlip|vFlip) === 0 ){

			for(iT=0; iT<len; iT++){

				tileset[iT] = tile = new Uint8Array(64);
				tOffset = iT << 6; // mul by 64
				iPix = 0;
				rLen = tOffset + 16;

				// by row
				for(rOfst=tOffset; rOfst<rLen; rOfst+=2){

					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					b4 = data[rOfst+32]; b5 = data[rOfst+33];
					b6 = data[rOfst+48]; b7 = data[rOfst+49];
					
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						tile[iPix] =
							(b0 & pix ? 0x01 : 0x0) +
							(b1 & pix ? 0x02 : 0x0) +
							(b2 & pix ? 0x04 : 0x0) +
							(b3 & pix ? 0x08 : 0x0) +
							(b4 & pix ? 0x10 : 0x0) +
							(b5 & pix ? 0x20 : 0x0) +
							(b6 & pix ? 0x40 : 0x0) +
							(b7 & pix ? 0x80 : 0x0) ;

						iPix++;
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let row, fPix;

			for(iT=0; iT<len; iT++){

				tileset[iT] = tile = new Uint8Array(64);
				tOffset = iT << 6; // mul by 64
				iPix = 0;

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (flip8[row] << 1); // mul by 2
					
					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					b4 = data[rOfst+32]; b5 = data[rOfst+33];
					b6 = data[rOfst+48]; b7 = data[rOfst+49];

					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						tile[iPix] =
							(b0 & fPix ? 0x01 : 0x0) +
							(b1 & fPix ? 0x02 : 0x0) +
							(b2 & fPix ? 0x04 : 0x0) +
							(b3 & fPix ? 0x08 : 0x0) +
							(b4 & fPix ? 0x10 : 0x0) +
							(b5 & fPix ? 0x20 : 0x0) +
							(b6 & fPix ? 0x40 : 0x0) +
							(b7 & fPix ? 0x80 : 0x0) ;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};

	fast.draw_decodedTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
		// OVERFLOW : crash function
		// WRONGDAT : crash function

		if(!data) return [];

		let len = data.length;
		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax << 3; // mul by 8
		let h = ytmax << 3; // mul by 8

		let c, pix;
		let pixels = ctx.createImageData(w, h);

		let tile;

		let xt, yt, xtp, ytp;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		let xtlen;

		if( (hFlip|vFlip) === 0 ){

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){
	
				tile = data[ (yt*xtmax)+xt ]; // data[iTile] // iTile=(yt*xtmax)+xt;
	
				for(ytp=0; ytp<8; ytp++)
				for(xtp=0; xtp<8; xtp++){
		
					//                    *8           // iPix = (ytp*8) + xtp;
					c = palette[ tile[(ytp<<3)+xtp] ]; // tile[iPix]
		
					//           *8                *8          * 4  // xp=(xt*8)+xtp; yp=(yt*8)+ytp
					pix = ( (((yt<<3)+ytp)*w) + (xt<<3)+xtp ) << 2; // ((yp*w) + xp) * 4
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let xf8 = flip8[hFlip], yf8 = flip8[vFlip];

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tile = data[ (yt*xtmax)+xt ]; // data[iTile] // iTile=(yt*xtmax)+xt;
	
				for(ytp=0; ytp<8; ytp++)
				for(xtp=0; xtp<8; xtp++){

					//                         *8                // iPix = (yf8[ytp]*8) + xf8[xtp]
					c = palette[ tile[(yf8[ytp]<<3)+xf8[xtp]] ]; // tile[iPix]
		
					//           *8                *8          * 4  // xp=(xt*8)+xtp; yp=(yt*8)+ytp
					pix = ( (((yt<<3)+ytp)*w) + (xt<<3)+xtp ) << 2; // ((yp*w) + xp) * 4
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}

		ctx.putImageData(pixels, x,y);
	};



	fast.format_2bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values ?
		// WRONGDAT : get zero values ?

		if(!data) return [];

		let len = data.length >> 4; // div by 16
		let tileset = new Array(len);

		let tile, row;
		
		let rOfst = 0;
		let b0, b1;

		let iTile, iRow, pix, iPix;
		
		if( (hFlip|vFlip) === 0 ){

			for(iTile=0; iTile<len; iTile++){

				tileset[iTile] = tile = new Array(8);
				
				// by row
				for(iRow=0; iRow<8; iRow++){
		
					tile[iRow] = row = new Uint8Array(8);
					iPix = 0;

					b0 = data[rOfst]; b1 = data[rOfst+1];

					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						row[iPix] =
							(b0 & pix ? 0x1 : 0x0) +
						    (b1 & pix ? 0x2 : 0x0) ;

						iPix++;
					}

					rOfst += 2;
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let tOffset, fPix;

			for(iTile=0; iTile<len; iTile++){

				tileset[iTile] = tile = new Array(8);
				tOffset = iTile << 4; // mul by 16

				// by row
				for(iRow=0; iRow<8; iRow++){
		
					tile[iRow] = row = new Uint8Array(8);
					iPix = 0;

					rOfst = tOffset + (flip8[iRow] << 1);

					b0 = data[rOfst]; b1 = data[rOfst+1];

					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						row[iPix] =
							(b0 & fPix ? 0x1 : 0x0) +
						    (b1 & fPix ? 0x2 : 0x0) ;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};

	fast.format_4bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values
		// WRONGDAT : get zero values

		if(!data) return [];

		let len = data.length >> 5; // div by 32
		let tileset = new Array(len);

		let tile, row;

		let rOfst = 0;
		let b0, b1, b2, b3;

		let iTile, iRow, pix, iPix;

		if( (hFlip|vFlip) === 0 ){

			for(iTile=0; iTile<len; iTile++){

				tileset[iTile] = tile = new Array(8);

				// by row
				for(iRow=0; iRow<8; iRow++){

					tile[iRow] = row = new Uint8Array(8);
					iPix = 0;

					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						row[iPix] =
							(b0 & pix ? 0x1 : 0x0) +
							(b1 & pix ? 0x2 : 0x0) +
							(b2 & pix ? 0x4 : 0x0) +
							(b3 & pix ? 0x8 : 0x0) ;

						iPix++;
					}

					rOfst += 2;
				}
				rOfst += 16;
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let tOffset, fPix;

			for(iTile=0; iTile<len; iTile++){

				tileset[iTile] = tile = new Array(8);
				tOffset = iTile << 5; // mul by 32

				// by row
				for(iRow=0; iRow<8; iRow++){
		
					tile[iRow] = row = new Uint8Array(8);
					iPix = 0;

					rOfst = tOffset + (flip8[iRow] << 1); // mul by 2

					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						row[iPix] =
							(b0 & fPix ? 0x1 : 0x0) +
							(b1 & fPix ? 0x2 : 0x0) +
							(b2 & fPix ? 0x4 : 0x0) +
							(b3 & fPix ? 0x8 : 0x0) ;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};

	fast.format_8bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values ?
		// WRONGDAT : get zero values ?

		if(!data) return [];

		let len = data.length >> 6; // div by 64
		let tileset = new Array(len);

		let tile, row;

		let rOfst = 0;
		let b0, b1, b2, b3, b4, b5, b6, b7;

		let iTile, iRow, pix, iPix;

		if( (hFlip|vFlip) === 0 ){

			for(iTile=0; iTile<len; iTile++){

				tileset[iTile] = tile = new Array(8);

				// by row
				for(iRow=0; iRow<8; iRow++){
		
					tile[iRow] = row = new Uint8Array(8);
					iPix = 0;

					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					b4 = data[rOfst+32]; b5 = data[rOfst+33];
					b6 = data[rOfst+48]; b7 = data[rOfst+49];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						row[iPix] =
							(b0 & pix ? 0x01 : 0x0) +
							(b1 & pix ? 0x02 : 0x0) +
							(b2 & pix ? 0x04 : 0x0) +
							(b3 & pix ? 0x08 : 0x0) +
							(b4 & pix ? 0x10 : 0x0) +
							(b5 & pix ? 0x20 : 0x0) +
							(b6 & pix ? 0x40 : 0x0) +
							(b7 & pix ? 0x80 : 0x0) ;

						iPix++;
					}
					rOfst += 2;
				}
				rOfst += 48;
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let tOffset, fPix;

			for(iTile=0; iTile<len; iTile++){

				tileset[iTile] = tile = new Array(8);
				tOffset = iTile << 6; // mul by 64

				// by row
				for(iRow=0; iRow<8; iRow++){
		
					tile[iRow] = row = new Uint8Array(8);
					iPix = 0;

					rOfst = tOffset + (flip8[iRow] << 1); // mul by 2
				
					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					b4 = data[rOfst+32]; b5 = data[rOfst+33];
					b6 = data[rOfst+48]; b7 = data[rOfst+49];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						row[iPix] =
							(b0 & fPix ? 0x01 : 0x0) +
							(b1 & fPix ? 0x02 : 0x0) +
							(b2 & fPix ? 0x04 : 0x0) +
							(b3 & fPix ? 0x08 : 0x0) +
							(b4 & fPix ? 0x10 : 0x0) +
							(b5 & fPix ? 0x20 : 0x0) +
							(b6 & fPix ? 0x40 : 0x0) +
							(b7 & fPix ? 0x80 : 0x0) ;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};

	fast.draw_formatedTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
		// OVERFLOW : crash function
		// WRONGDAT : crash function

		if(!data) return [];

		let len = data.length;
		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax << 3; // mul by 8
		let h = ytmax << 3; // mul by 8

		let c, pix;
		let pixels = ctx.createImageData(w, h);

		let tile;

		let xt, yt, xtp, ytp;

		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		let xtlen;

		if( (hFlip|vFlip) === 0 ){

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){
	
				tile = data[ (yt*xtmax)+xt ]; // data[iTile] // iTile=(yt*xtmax)+xt;
	
				for(ytp=0; ytp<8; ytp++)
				for(xtp=0; xtp<8; xtp++){
		
					c = palette[ tile[ytp][xtp] ];
		
					//           *8                *8          * 4  // xp=(xt*8)+xtp; yp=(yt*8)+ytp
					pix = ( (((yt<<3)+ytp)*w) + (xt<<3)+xtp ) << 2; // ((yp*w) + xp) * 4

					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let xf8 = flip8[hFlip], yf8 = flip8[vFlip];

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){
	
				tile = data[ (yt*xtmax)+xt ]; // data[iTile] // iTile=(yt*xtmax)+xt;

				for(ytp=0; ytp<8; ytp++)
				for(xtp=0; xtp<8; xtp++){
		
					c = palette[ tile[yf8[ytp]][xf8[xtp]] ];
		
					//           *8                *8          * 4  // xp=(xt*8)+xtp; yp=(yt*8)+ytp
					pix = ( (((yt<<3)+ytp)*w) + (xt<<3)+xtp ) << 2; // ((yp*w) + xp) * 4
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}

		ctx.putImageData(pixels, x,y);
	};



	fast.draw_2bppTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){

		// OVERFLOW : display zero values ?
		// WRONGDAT : display zero values ?

		if(!data) return [];

		let len = data.length >> 4; // div by 16
		let ytmax = Math.ceil(len / xtmax);
		
		let w = xtmax << 3; // mul by 8
		let h = ytmax << 3; // mul by 8
		
		let c, _pix;
		let pixels = ctx.createImageData(w, h);

		let tOffset, rOfst;
		let b0, b1;
		
		let bit = app.ref.bitvalToPixnum;

		let xt, yt, row, pix;

		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;
		
		if( (hFlip|vFlip) === 0 ){

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tOffset = ((yt*xtmax)+xt) << 4; // iTile*16 // iTile=(yt*xtmax)+xt

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (row<<1); // mul by 2
					
					b0 = data[rOfst]; b1 = data[rOfst+1];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						c = palette[
							(b0 & pix ? 0x1 : 0x0) +
							(b1 & pix ? 0x2 : 0x0)
						];

						//            *8                *8               * 4  // xp=(xt*8)+bit[pix]; yp=(yt*8)+row
						_pix = ( (((yt<<3)+row)*w) + (xt<<3)+bit[pix] ) << 2; // _pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let fPix;

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tOffset = ((yt*xtmax)+xt) << 4; // iTile*16 // iTile=(yt*xtmax)+xt

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (flip8[row]<<1); // mul by 2
					
					b0 = data[rOfst]; b1 = data[rOfst+1];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						c = palette[
							(b0 & fPix ? 0x1 : 0x0) +
							(b1 & fPix ? 0x2 : 0x0)
						];

						//            *8                *8               * 4  // xp=(xt*8)+bit[pix]; yp=(yt*8)+row
						_pix = ( (((yt<<3)+row)*w) + (xt<<3)+bit[pix] ) << 2; // _pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}
		}

		ctx.putImageData(pixels, x,y);
	};

	fast.draw_4bppTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){

		// OVERFLOW : display zero values ?
		// WRONGDAT : display zero values ?

		if(!data) return [];

		let len = data.length >> 5; // div by 32
		let ytmax = Math.ceil(len / xtmax);
		
		let w = xtmax << 3; // mul by 8
		let h = ytmax << 3; // mul by 8
		
		let c, _pix;
		let pixels = ctx.createImageData(w, h);
		
		let tOffset, rOfst;
		let b0, b1, b2, b3;

		let bit = app.ref.bitvalToPixnum;

		let xt, yt, row, pix;

		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;
		
		if( (hFlip|vFlip) === 0 ){

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tOffset = ((yt*xtmax)+xt) << 5; // iTile*32 // iTile=(yt*xtmax)+xt

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (row<<1); // mul by 2
					
					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
				
						c = palette[
							(b0 & pix ? 0x1 : 0x0) +
							(b1 & pix ? 0x2 : 0x0) +
							(b2 & pix ? 0x4 : 0x0) +
							(b3 & pix ? 0x8 : 0x0)
						];

						//            *8                *8               * 4  // xp=(xt*8)+bit[pix]; yp=(yt*8)+row
						_pix = ( (((yt<<3)+row)*w) + (xt<<3)+bit[pix] ) << 2; // _pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let fPix;

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tOffset = ((yt*xtmax)+xt) << 5; // iTile*32 // iTile=(yt*xtmax)+xt

				// by row
				for(row=0; row<8; row++){

					rOfst = tOffset + (flip8[row]<<1); // mul by 2

					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];

					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];

						c = palette[
							(b0 & fPix ? 0x1 : 0x0) +
							(b1 & fPix ? 0x2 : 0x0) +
							(b2 & fPix ? 0x4 : 0x0) +
							(b3 & fPix ? 0x8 : 0x0)
						];

						//            *8                *8               * 4  // xp=(xt*8)+bit[pix]; yp=(yt*8)+row
						_pix = ( (((yt<<3)+row)*w) + (xt<<3)+bit[pix] ) << 2; // _pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}
		}

		ctx.putImageData(pixels, x,y);
	};

	fast.draw_8bppTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){

		// OVERFLOW : display zero values ?
		// WRONGDAT : display zero values ?

		if(!data) return [];

		let len = data.length >> 6; // div by 64
		let ytmax = Math.ceil(len / xtmax);
		
		let w = xtmax << 3; // mul by 8
		let h = ytmax << 3; // mul by 8
		
		let c, _pix;
		let pixels = ctx.createImageData(w, h);
		
		let tOffset, rOfst;
		let b0, b1, b2, b3, b4, b5, b6, b7;

		let bit = app.ref.bitvalToPixnum;

		let xt, yt, row, pix;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;
		
		if( (hFlip|vFlip) === 0 ){

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tOffset = ((yt*xtmax)+xt) << 6; // iTile*64 // iTile=(yt*xtmax)+xt

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (row<<1); // mul by 2
					
					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					b4 = data[rOfst+32]; b5 = data[rOfst+33];
					b6 = data[rOfst+48]; b7 = data[rOfst+49];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						
						c = palette[
							(b0 & pix ? 0x01 : 0x0) +
							(b1 & pix ? 0x02 : 0x0) +
							(b2 & pix ? 0x04 : 0x0) +
							(b3 & pix ? 0x08 : 0x0) +
							(b4 & pix ? 0x10 : 0x0) +
							(b5 & pix ? 0x20 : 0x0) +
							(b6 & pix ? 0x40 : 0x0) +
							(b7 & pix ? 0x80 : 0x0)
						];

						//            *8                *8               * 4  // xp=(xt*8)+bit[pix]; yp=(yt*8)+row
						_pix = ( (((yt<<3)+row)*w) + (xt<<3)+bit[pix] ) << 2; // _pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8)[vFlip];
			let flipB = app.ref.get_flipTable('byte')[hFlip];
			let fPix;

			for(yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(xt=0; xt<xtlen; xt++){

				tOffset = ((yt*xtmax)+xt) << 6; // iTile*64 // iTile=(yt*xtmax)+xt

				// by row
				for(row=0; row<8; row++){
		
					rOfst = tOffset + (flip8[row]<<1); // mul by 2
					
					b0 = data[rOfst   ]; b1 = data[rOfst+1 ];
					b2 = data[rOfst+16]; b3 = data[rOfst+17];
					b4 = data[rOfst+32]; b5 = data[rOfst+33];
					b6 = data[rOfst+48]; b7 = data[rOfst+49];
				
					// by row pixel
					for(pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[pix];
						
						c = palette[
							(b0 & fPix ? 0x01 : 0x0) +
							(b1 & fPix ? 0x02 : 0x0) +
							(b2 & fPix ? 0x04 : 0x0) +
							(b3 & fPix ? 0x08 : 0x0) +
							(b4 & fPix ? 0x10 : 0x0) +
							(b5 & fPix ? 0x20 : 0x0) +
							(b6 & fPix ? 0x40 : 0x0) +
							(b7 & fPix ? 0x80 : 0x0)
						];

						//            *8                *8               * 4  // xp=(xt*8)+bit[pix]; yp=(yt*8)+row
						_pix = ( (((yt<<3)+row)*w) + (xt<<3)+bit[pix] ) << 2; // _pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}
		}

		ctx.putImageData(pixels, x,y);
	};


})();