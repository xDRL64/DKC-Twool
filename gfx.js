

dkc2ldd.gfx = (function(app=dkc2ldd){

	let o = {};

	o.fast = {};
	o.safe = {};



	o.generate_palette2 = function(r, g, b, av){
		let o = [];
		for(let i=0; i<16; i++){
			let c = ((i+1)*16)-1;
			o[i] = [
				r ? c : av,
				g ? c : av,
				b ? c : av,
			];
		}
		return o;
	};
	
	o.generate_palette = function(r, g, b, av){
		let o = [];
		let s = (256-av) / 16;
		for(let i=0; i<16; i++){
			let c = ((i+1)*s)-1+av;
			c = c > 255 ? 255 : c;
			o[i] = [
				r ? c : 0,
				g ? c : 0,
				b ? c : 0,
			];
		}
		return o;
	};

	o.defaultPalette = o.generate_palette(false, true, false, 64);
	
	o.defaultPalettes = [

		o.generate_palette( true, false, false, 32),
		o.generate_palette(false,  true, false, 32),
		o.generate_palette(false, false,  true, 32),
		
		o.generate_palette(false,  true,  true, 32),
		o.generate_palette( true, false,  true, 32),
		o.generate_palette( true,  true, false, 32),
		
		o.generate_palette(true,   true,  true, 32),
		
		o.generate_palette(true,   true,  true, 96),
		
	];

	let simulate_palette = function(colorIndex){
		return o.defaultPalette[colorIndex];
	};

	let simulate_palette8 = function(paletteIndex, colorIndex){
		return o.defaultPalettes[paletteIndex][colorIndex];
	};

	let debugpal = [
		[0x00,0x00,0x00],[0xFF,0xFF,0xFF],[0xFF,0x00,0x00],[0x00,0xFF,0x00],
		[0x00,0x00,0xFF],[0x00,0xFF,0xFF],[0xFF,0x00,0xFF],[0xFF,0xFF,0x00],
		[0xFF,0x77,0x00],[0x77,0x77,0x77],[0x77,0x00,0x00],[0x00,0x77,0x00],
		[0x00,0x00,0x77],[0x00,0x77,0x77],[0x77,0x00,0x77],[0x77,0x77,0x00]
	];
	o.debugpal = debugpal;

	
	o.byteSwap_fromWord = function(data){
		let len = data.length / 2;
		
		let o = [];
		
		// byte swap in word
		for(let i=0; i<len; i++){
			o.push(data[(i*2)+1]);
			o.push(data[(i*2)+0]);
		}
		
		return o;
	};
	
	

	(function(){
		let _1=0x8
		let _4=0x21;
		let _6=0x31;
		let _7=0x39
		let _10=0x52;
		let _14=0x73;
		let _15=0x7b;
		let _16=0x84;
		let _19=0x9c;
		let _21=0xAD;
		let _24=0xc6;
		let _28=0xe7;
		o.def2bppPal = [
			[[0,0,0],[_14,_14,_21],[_16,_16,_24],[_19,_19,_28]],
			[[0,0,0],[_7,_7,_10],[_10,_10,_15],[_14,_14,_21]],
			[[0,0,0],[_4,_4,_6],[_7,_7,_10],[_10,_10,_15]],
			[[0,0,0],[_1,_1,_1],[_1,_1,_1],[_4,_4,_6]],

			[[0,0,0],[_14,_14,_21],[_16,_16,_24],[_19,_19,_28]],
			[[0,0,0],[_7,_7,_10],[_10,_10,_15],[_14,_14,_21]],
			[[0,0,0],[_4,_4,_6],[_7,_7,_10],[_10,_10,_15]],
			[[0,0,0],[_1,_1,_1],[_1,_1,_1],[_4,_4,_6]],
	
			[[0,0,0],[64,64,64],[128,128,128],[255,255,255]],
			[[0,0,0],[64,64,64],[128,128,128],[255,255,255]],
			[[0,0,0],[64,64,64],[128,128,128],[255,255,255]],
			[[0,0,0],[64,64,64],[128,128,128],[255,255,255]]
		];
		
	})();





	











	////////////////////////////////////////////////////////////////////////////////////////////////////


	//
	// // DRAW 4BPP TILE
	//

	o.fast.draw_4bppTile = function(data, index, palette, hFlip=0,vFlip=0, ctx,x=0,y=0){

		// OVERFLOW : display zero values
		// WRONGDAT : display zero values

		let tOffset = index * 32; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;

		let col, c;
		let _pix = 0;
		let pixels = ctx.createImageData(8, 8);
		
		if( (hFlip|vFlip) === 0 ){
			// by row
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

					c = palette[col];
					
					pixels.data[_pix  ] = c[0];
					pixels.data[_pix+1] = c[1];
					pixels.data[_pix+2] = c[2];
					pixels.data[_pix+3] = 255;
		
					_pix += 4;
				}
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			// by row
			for(let row=0; row<8; row++){
	
				rOffset = flip8[vFlip][row] * 2; // row offset
				bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
				
				b0 = data[ tOffset + bOffsets[0] ];
				b1 = data[ tOffset + bOffsets[1] ];
				b2 = data[ tOffset + bOffsets[2] ];
				b3 = data[ tOffset + bOffsets[3] ];
			
				// by row pixel
				for(let pix=0x80; pix>0x00; pix=pix>>1){
					fPix = flipB[hFlip][pix];
					col = 0;
					col += b0 & fPix ? 0x1 : 0x0;
					col += b1 & fPix ? 0x2 : 0x0;
					col += b2 & fPix ? 0x4 : 0x0;
					col += b3 & fPix ? 0x8 : 0x0;

					c = palette[col];
					
					pixels.data[_pix  ] = c[0];
					pixels.data[_pix+1] = c[1];
					pixels.data[_pix+2] = c[2];
					pixels.data[_pix+3] = 255;
		
					_pix += 4;
				}
			}
		}

		ctx.putImageData(pixels, x,y);
	};

	o.safe.draw_4bppTile = function(data, index, palette, hFlip=0,vFlip=0, ctx,x=0,y=0){

		// OVERFLOW : stop function
		// WRONGDAT : display zero values

		let tOffset = index * 32; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;

		let col, c;
		let _pix = 0;
		let pixels = ctx.createImageData(8, 8);
		
		if(data.length - tOffset < 32) return;

		if( (hFlip|vFlip) === 0 ){
			// by row
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

					c = palette[col];
					
					pixels.data[_pix  ] = c[0];
					pixels.data[_pix+1] = c[1];
					pixels.data[_pix+2] = c[2];
					pixels.data[_pix+3] = 255;
		
					_pix += 4;
				}
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			// by row
			for(let row=0; row<8; row++){
	
				rOffset = flip8[vFlip][row] * 2; // row offset
				bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
				
				b0 = data[ tOffset + bOffsets[0] ];
				b1 = data[ tOffset + bOffsets[1] ];
				b2 = data[ tOffset + bOffsets[2] ];
				b3 = data[ tOffset + bOffsets[3] ];
			
				// by row pixel
				for(let pix=0x80; pix>0x00; pix=pix>>1){
					fPix = flipB[hFlip][pix];
					col = 0;
					col += b0 & fPix ? 0x1 : 0x0;
					col += b1 & fPix ? 0x2 : 0x0;
					col += b2 & fPix ? 0x4 : 0x0;
					col += b3 & fPix ? 0x8 : 0x0;

					c = palette[col];
					
					pixels.data[_pix  ] = c[0];
					pixels.data[_pix+1] = c[1];
					pixels.data[_pix+2] = c[2];
					pixels.data[_pix+3] = 255;
		
					_pix += 4;
				}
			}
		}

		ctx.putImageData(pixels, x,y);
	};


	//
	// // DRAW 4BPP TILESET
	//

	o.fast.draw_4bppTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){

		// OVERFLOW : display zero values
		// WRONGDAT : display zero values

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;

		let len = data.length / 32;

		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax * 8;
		let h = ytmax * 8;

		let col, c;
		let _pix = 0;
		let pixels = ctx.createImageData(w, h);

		let bit = app.ref.bitvalToPixnum;

		let xp, yp;

		let iTile;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;
		
		if( (hFlip|vFlip) === 0 ){

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){

				iTile = (yt*xtmax) + xt;

				tOffset = iTile * 32;
				// by row
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
						
						c = palette[col];

						xp = (xt*8) + bit[pix];
						yp = (yt*8) + row;
		
						_pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){

				iTile = (yt*xtmax) + xt;

				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];

						col = 0;

						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						c = palette[col];

						xp = (xt*8) + bit[pix];
						yp = (yt*8) + row;
		
						_pix = ((yp*w) + xp) * 4;
					
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

	o.safe.draw_4bppTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){

		// OVERFLOW : stop function
		// WRONGDAT : display zero values

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;

		let len = Math.floor(data.length / 32);

		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax * 8;
		let h = ytmax * 8;

		let col, c;
		let _pix = 0;
		let pixels = ctx.createImageData(w, h);

		let bit = app.ref.bitvalToPixnum;

		let xp, yp;

		let iTile;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;
		
		if( (hFlip|vFlip) === 0 ){

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){

				iTile = (yt*xtmax) + xt;

				tOffset = iTile * 32;
				// by row
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
						
						c = palette[col];

						xp = (xt*8) + bit[pix];
						yp = (yt*8) + row;
		
						_pix = ((yp*w) + xp) * 4;
					
						pixels.data[_pix  ] = c[0];
						pixels.data[_pix+1] = c[1];
						pixels.data[_pix+2] = c[2];
						pixels.data[_pix+3] = 255;
					}
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){

				iTile = (yt*xtmax) + xt;

				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];

						col = 0;

						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						c = palette[col];

						xp = (xt*8) + bit[pix];
						yp = (yt*8) + row;
		
						_pix = ((yp*w) + xp) * 4;
					
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


	//
	// // DECODE 4BPP TILE
	//

	o.fast.decode_4bppTile = function(data, index, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values
		// WRONGDAT : get zero values

		let tOffset = index * 32; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tile = [];

		let col;
		
		if( (hFlip|vFlip) === 0 ){
			// by row
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
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			// by row
			for(let row=0; row<8; row++){
	
				rOffset = flip8[vFlip][row] * 2; // row offset
				bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
				
				b0 = data[ tOffset + bOffsets[0] ];
				b1 = data[ tOffset + bOffsets[1] ];
				b2 = data[ tOffset + bOffsets[2] ];
				b3 = data[ tOffset + bOffsets[3] ];
			
				// by row pixel
				for(let pix=0x80; pix>0x00; pix=pix>>1){
					fPix = flipB[hFlip][pix];
					col = 0;
					col += b0 & fPix ? 0x1 : 0x0;
					col += b1 & fPix ? 0x2 : 0x0;
					col += b2 & fPix ? 0x4 : 0x0;
					col += b3 & fPix ? 0x8 : 0x0;
					
					tile.push(col);
				}
			}
		}

		return tile;
	};

	o.safe.decode_4bppTile = function(data, index, hFlip=0,vFlip=0){

		// OVERFLOW : stop function
		// WRONGDAT : get zero values

		let tOffset = index * 32; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tile = [];

		let col;
		
		if(data.length - tOffset < 32) return tile;

		if( (hFlip|vFlip) === 0 ){
			// by row
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
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			// by row
			for(let row=0; row<8; row++){
	
				rOffset = flip8[vFlip][row] * 2; // row offset
				bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
				
				b0 = data[ tOffset + bOffsets[0] ];
				b1 = data[ tOffset + bOffsets[1] ];
				b2 = data[ tOffset + bOffsets[2] ];
				b3 = data[ tOffset + bOffsets[3] ];
			
				// by row pixel
				for(let pix=0x80; pix>0x00; pix=pix>>1){
					fPix = flipB[hFlip][pix];
					col = 0;
					col += b0 & fPix ? 0x1 : 0x0;
					col += b1 & fPix ? 0x2 : 0x0;
					col += b2 & fPix ? 0x4 : 0x0;
					col += b3 & fPix ? 0x8 : 0x0;
					
					tile.push(col);
				}
			}
		}

		return tile;
	};


	//
	// // DRAW DECODED TILE
	//

	o.fast.draw_decodedTile = function(data, palette, hFlip=0,vFlip=0, ctx,x=0,y=0){

		// OVERFLOW : crash function
		// WRONGDAT : crash function

		let pix = 0;
		let pixels = ctx.createImageData(8, 8);
		let c;

		if( (hFlip|vFlip) === 0 ){
			for(let iPix=0; iPix<64; iPix++){
	
				c = palette[ data[iPix] ];
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;
	
				pix += 4;
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let xp, yp, iPix;

			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
				xp = flip8[hFlip][x];
				yp = flip8[vFlip][y];

				iPix = (yp*8) + xp;

				c = palette[ data[iPix] ];
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;

				pix += 4;
			}
		}

		ctx.putImageData(pixels, x,y);
	};

	o.safe.draw_decodedTile = function(data, palette, hFlip=0,vFlip=0, ctx,x=0,y=0){

		// OVERFLOW : stop function
		// WRONGDAT : display zero values

		let pix = 0;
		let pixels = ctx.createImageData(8, 8);
		let c;

		if(data.length < 64) return;

		if( (hFlip|vFlip) === 0 ){
			for(let iPix=0; iPix<64; iPix++){
	
				c = palette[ data[iPix] ];
				c = app.lib.checkVal.undef(c, []);

				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;
	
				pix += 4;
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let xp, yp, iPix;

			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
				xp = flip8[hFlip][x];
				yp = flip8[vFlip][y];

				iPix = (yp*8) + xp;

				c = palette[ data[iPix] ];
				c = app.lib.checkVal.undef(c, []);
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;

				pix += 4;
			}
		}

		ctx.putImageData(pixels, x,y);
	};


	//
	// // DECODE 4BPP TILESET
	//

	o.fast.decode_4bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values
		// WRONGDAT : get zero values

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tileset = [];

		let col;

		let len = data.length / 32;
		
		if( (hFlip|vFlip) === 0 ){

			for(let iTile=0; iTile<len; iTile++){
				tOffset = iTile * 32;
				// by row
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
						
						tileset.push(col);
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;
						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						tileset.push(col);
					}
				}
			}
		}

		return tileset;
	};

	o.safe.decode_4bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : stop function
		// WRONGDAT : get zero values

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tileset = [];

		let col;

		let len = Math.floor(data.length / 32);

		if( (hFlip|vFlip) === 0 ){

			for(let iTile=0; iTile<len; iTile++){
				tOffset = iTile * 32;
				// by row
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
						
						tileset.push(col);
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;
						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						tileset.push(col);
					}
				}
			}
		}

		return tileset;
	};


	//
	// // DRAW DECODED TILESET
	//

	o.fast.draw_decodedTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
		// OVERFLOW : crash function
		// WRONGDAT : crash function

		let len = data.length / 64;
		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax * 8;
		let h = ytmax * 8;

		let pix;
		let pixels = ctx.createImageData(w, h);
		let c;

		let xp, yp;

		let iTile, iPix;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;

		if( (hFlip|vFlip) === 0 ){

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					iPix = (iTile*64) + (ytp*8) + xtp;
	
					c = palette[ data[iPix] ];
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let _xtp, _ytp;

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					_xtp = flip8[hFlip][xtp];
					_ytp = flip8[vFlip][ytp];

					iPix = (iTile*64) + (_ytp*8) + _xtp;
	
					c = palette[ data[iPix] ];
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
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

	o.safe.draw_decodedTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
		// OVERFLOW : stop function
		// WRONGDAT : display zero values

		let len = Math.floor(data.length / 64);
		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax * 8;
		let h = ytmax * 8;

		let pix;
		let pixels = ctx.createImageData(w, h);
		let c;

		let xp, yp;

		let iTile, iPix;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;

		if( (hFlip|vFlip) === 0 ){

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					iPix = (iTile*64) + (ytp*8) + xtp;
	
					c = palette[ data[iPix] ];
					c = app.lib.checkVal.undef(c, []);
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let _xtp, _ytp;

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					_xtp = flip8[hFlip][xtp];
					_ytp = flip8[vFlip][ytp];

					iPix = (iTile*64) + (_ytp*8) + _xtp;
	
					c = palette[ data[iPix] ];
					c = app.lib.checkVal.undef(c, []);
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
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


	//
	// // FORMAT 4BPP TILE
	//

	o.fast.format_4bppTile = function(data, index, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values
		// WRONGDAT : get zero values

		let tOffset = index * 32; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tile = [[],[],[],[], [],[],[],[]];

		let col;
		
		if( (hFlip|vFlip) === 0 ){
			// by row
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
					
					tile[row].push(col);
				}
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			// by row
			for(let row=0; row<8; row++){
	
				rOffset = flip8[vFlip][row] * 2; // row offset
				bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
				
				b0 = data[ tOffset + bOffsets[0] ];
				b1 = data[ tOffset + bOffsets[1] ];
				b2 = data[ tOffset + bOffsets[2] ];
				b3 = data[ tOffset + bOffsets[3] ];
			
				// by row pixel
				for(let pix=0x80; pix>0x00; pix=pix>>1){
					fPix = flipB[hFlip][pix];
					col = 0;
					col += b0 & fPix ? 0x1 : 0x0;
					col += b1 & fPix ? 0x2 : 0x0;
					col += b2 & fPix ? 0x4 : 0x0;
					col += b3 & fPix ? 0x8 : 0x0;
					
					tile[row].push(col);
				}
			}
		}

		return tile;
	};

	o.safe.format_4bppTile = function(data, index, hFlip=0,vFlip=0){

		// OVERFLOW : stop function
		// WRONGDAT : get zero values

		let tOffset = index * 32; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tile = [[],[],[],[], [],[],[],[]];

		let col;
		
		if(data.length - tOffset < 32) return tile;

		if( (hFlip|vFlip) === 0 ){
			// by row
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
					
					tile[row].push(col);
				}
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			// by row
			for(let row=0; row<8; row++){
	
				rOffset = flip8[vFlip][row] * 2; // row offset
				bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
				
				b0 = data[ tOffset + bOffsets[0] ];
				b1 = data[ tOffset + bOffsets[1] ];
				b2 = data[ tOffset + bOffsets[2] ];
				b3 = data[ tOffset + bOffsets[3] ];
			
				// by row pixel
				for(let pix=0x80; pix>0x00; pix=pix>>1){
					fPix = flipB[hFlip][pix];
					col = 0;
					col += b0 & fPix ? 0x1 : 0x0;
					col += b1 & fPix ? 0x2 : 0x0;
					col += b2 & fPix ? 0x4 : 0x0;
					col += b3 & fPix ? 0x8 : 0x0;
					
					tile[row].push(col);
				}
			}
		}

		return tile;
	};


	//
	// // DRAW FORMATED TILE
	//

	o.fast.draw_formatedTile = function(data, palette, hFlip=0,vFlip=0, ctx,x=0,y=0){

		// OVERFLOW : crash function
		// WRONGDAT : crash function

		let pix = 0;
		let pixels = ctx.createImageData(8, 8);
		let c;

		if( (hFlip|vFlip) === 0 ){
			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
	
				c = palette[ data[y][x] ];
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;
	
				pix += 4;
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let xp, yp;

			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
				xp = flip8[hFlip][x];
				yp = flip8[vFlip][y];

				c = palette[ data[yp][xp] ];
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;

				pix += 4;
			}
		}

		ctx.putImageData(pixels, x,y);
	};

	o.safe.draw_formatedTile = function(data, palette, hFlip=0,vFlip=0, ctx,x=0,y=0){

		// OVERFLOW : stop function
		// WRONGDAT : display zero values

		let pix = 0;
		let pixels = ctx.createImageData(8, 8);
		let c;

		let row;
		if(data.length < 8) return;

		if( (hFlip|vFlip) === 0 ){
			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
	
				row = app.lib.checkVal.undef(data[y], []);
				c = palette[ row[x] ];
				c = app.lib.checkVal.undef(c, []);
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;
	
				pix += 4;
			}
		}else{

			let flip8 = app.ref.get_flipTable(8);
			let xp, yp;

			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
				xp = flip8[hFlip][x];
				yp = flip8[vFlip][y];

				row = app.lib.checkVal.undef(data[yp], []);
				c = palette[ row[xp] ];
				c = app.lib.checkVal.undef(c, []);
	
				pixels.data[pix  ] = c[0];
				pixels.data[pix+1] = c[1];
				pixels.data[pix+2] = c[2];
				pixels.data[pix+3] = 255;

				pix += 4;
			}
		}

		ctx.putImageData(pixels, x,y);
	};


	//
	// // FORMAT 4BPP TILESET
	//

	o.fast.format_4bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values
		// WRONGDAT : get zero values

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tileset = [];

		let col;

		let len = data.length / 32;
		
		if( (hFlip|vFlip) === 0 ){

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( [] );

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
						
						tileset[iTile][row].push(col);
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( [] );

					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;
						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						tileset[iTile][row].push(col);
					}
				}
			}
		}

		return tileset;
	};

	o.safe.format_4bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : stop function
		// WRONGDAT : get zero values

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tileset = [];

		let col;

		let len = Math.floor(data.length / 32);
		
		if( (hFlip|vFlip) === 0 ){

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( [] );

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
						
						tileset[iTile][row].push(col);
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( [] );

					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;
						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						tileset[iTile][row].push(col);
					}
				}
			}
		}

		return tileset;
	};


	//
	// // DRAW FORMATED TILESET
	//

	o.fast.draw_formatedTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
		// OVERFLOW : crash function
		// WRONGDAT : crash function

		let len = data.length;
		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax * 8;
		let h = ytmax * 8;

		let pix;
		let pixels = ctx.createImageData(w, h);
		let c;

		let xp, yp;

		let iTile;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;

		if( (hFlip|vFlip) === 0 ){

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					c = palette[ data[iTile][ytp][xtp] ];
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let _xtp, _ytp;

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					_xtp = flip8[hFlip][xtp];
					_ytp = flip8[vFlip][ytp];

					c = palette[ data[iTile][_ytp][_xtp] ];
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
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

	o.safe.draw_formatedTileset = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
		// OVERFLOW : display zero values
		// WRONGDAT : display zero values

		let len = data.length;
		let ytmax = Math.ceil(len / xtmax);

		let w = xtmax * 8;
		let h = ytmax * 8;

		let pix;
		let pixels = ctx.createImageData(w, h);
		let c;

		let xp, yp;

		let iTile;
		let tile, row;
		
		let ytlast = ytmax-1;
		let xtlast = len - (ytlast*xtmax);
		let A = {}; A[ytlast] = xtlast; A[undefined] = xtmax;
		let B = {}; B[ytlast] = ytlast;
		
		let xtlen;

		if( (hFlip|vFlip) === 0 ){

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					tile = app.lib.checkVal.undef(data[iTile], []);
					row = app.lib.checkVal.undef(tile[ytp], []);
					c = palette[ row[xtp] ];
					c = app.lib.checkVal.undef(c, []);
		
					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
					pixels.data[pix  ] = c[0];
					pixels.data[pix+1] = c[1];
					pixels.data[pix+2] = c[2];
					pixels.data[pix+3] = 255;
				}
			}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let _xtp, _ytp;

			for(let yt=0; yt<ytmax; yt++){
			xtlen = A[ B[yt] ];
			for(let xt=0; xt<xtlen; xt++){
	
				iTile = (yt*xtmax) + xt;
	
				for(let ytp=0; ytp<8; ytp++)
				for(let xtp=0; xtp<8; xtp++){
		
					_xtp = flip8[hFlip][xtp];
					_ytp = flip8[vFlip][ytp];

					tile = app.lib.checkVal.undef(data[iTile], []);
					row = app.lib.checkVal.undef(tile[_ytp], []);
					c = palette[ row[_xtp] ];
					c = app.lib.checkVal.undef(c, []);

					xp = (xt*8) + xtp;
					yp = (yt*8) + ytp;
	
					pix = ((yp*w) + xp) * 4;
	
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









	o.fast._4bppPal_to_2bppPal = function(_4bppPal, colorDimensionDeepCopy=false, palStartOfst=0){
		let _o = [[],[],[],[],[],[],[],[]];

		let cddc = colorDimensionDeepCopy;

		/*
		let pal = _4bppPal[palStartOfst].concat( _4bppPal[palStartOfst+1] );

		for(let iPal=0; iPal<8; iPal++){
			_o.push( [] );
			for(let iCol=0; iCol<4; iCol++)
			let color = _4bppPal[palStartOfst]
			_o[i].push( cddc? [...] )
		}

		for(let i=0; i<8; i++){
			_o.push( [] );
			let color = _4bppPal[palStartOfst]
			_o[i].push( cddc? [...] )
		}
		*/

		let pal0 = _4bppPal[palStartOfst];
		let pal1 = _4bppPal[palStartOfst+1];

		_o[0].push( cddc ? [...(pal0[0])] : pal0[0] );
		_o[0].push( cddc ? [...(pal0[1])] : pal0[1] );
		_o[0].push( cddc ? [...(pal0[2])] : pal0[2] );
		_o[0].push( cddc ? [...(pal0[3])] : pal0[3] );

		_o[1].push( cddc ? [...(pal0[4])] : pal0[4] );
		_o[1].push( cddc ? [...(pal0[5])] : pal0[5] );
		_o[1].push( cddc ? [...(pal0[6])] : pal0[6] );
		_o[1].push( cddc ? [...(pal0[7])] : pal0[7] );

		_o[2].push( cddc ? [...(pal0[8])] : pal0[8] );
		_o[2].push( cddc ? [...(pal0[9])] : pal0[9] );
		_o[2].push( cddc ? [...(pal0[10])] : pal0[10] );
		_o[2].push( cddc ? [...(pal0[11])] : pal0[11] );

		_o[3].push( cddc ? [...(pal0[12])] : pal0[12] );
		_o[3].push( cddc ? [...(pal0[13])] : pal0[13] );
		_o[3].push( cddc ? [...(pal0[14])] : pal0[14] );
		_o[3].push( cddc ? [...(pal0[15])] : pal0[15] );

		_o[4].push( cddc ? [...(pal1[0])] : pal1[0] );
		//_o[4].push( cddc ? [...(pal0[0])] : pal0[0] );
		_o[4].push( cddc ? [...(pal1[1])] : pal1[1] );
		_o[4].push( cddc ? [...(pal1[2])] : pal1[2] );
		_o[4].push( cddc ? [...(pal1[3])] : pal1[3] );

		_o[5].push( cddc ? [...(pal1[4])] : pal1[4] );
		_o[5].push( cddc ? [...(pal1[5])] : pal1[5] );
		_o[5].push( cddc ? [...(pal1[6])] : pal1[6] );
		_o[5].push( cddc ? [...(pal1[7])] : pal1[7] );

		_o[6].push( cddc ? [...(pal1[8])] : pal1[8] );
		_o[6].push( cddc ? [...(pal1[9])] : pal1[9] );
		_o[6].push( cddc ? [...(pal1[10])] : pal1[10] );
		_o[6].push( cddc ? [...(pal1[11])] : pal1[11] );

		_o[7].push( cddc ? [...(pal1[12])] : pal1[12] );
		_o[7].push( cddc ? [...(pal1[13])] : pal1[13] );
		_o[7].push( cddc ? [...(pal1[14])] : pal1[14] );
		_o[7].push( cddc ? [...(pal1[15])] : pal1[15] );

		return _o;
	};





	o.fast.format_2bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values ?
		// WRONGDAT : get zero values ?

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tileset = [];

		let col;

		let len = data.length / 32;

		let iTile;
		
		if( (hFlip|vFlip) === 0 ){

			for(let iT=0; iT<len; iT++){
				tileset.push( [] );
				tileset.push( [] );
				tOffset = iT * 32;

				iTile = iT * 2;
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( [] );
					tileset[iTile+1].push( [] );

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
						tileset[iTile][row].push(col);

						col = 0;
						col += b2 & pix ? 0x1 : 0x0;
						col += b3 & pix ? 0x2 : 0x0;
						tileset[iTile+1][row].push(col);
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile * 32;
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( [] );

					rOffset = flip8[vFlip][row] * 2; // row offset
					bOffsets = [ rOffset, rOffset+1, rOffset+16, rOffset+17 ]; // byte offset
					
					b0 = data[ tOffset + bOffsets[0] ];
					b1 = data[ tOffset + bOffsets[1] ];
					b2 = data[ tOffset + bOffsets[2] ];
					b3 = data[ tOffset + bOffsets[3] ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;
						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;
						
						tileset[iTile][row].push(col);
					}
				}
			}
		}

		return tileset;
	};


	o.fast.animatedTiles_to_vramBackRef = function(animations, vramRefs, backRef){

		let len = animations.length;
		for(let iAnim=0; iAnim<len; iAnim++){
			let anim = vramRefs[iAnim];
			if(anim){
				let frameBytes = anim.tileCount * 32;
				let dstOfst = anim.destIndex * 32;
				for(let i=0; i<frameBytes; i++){
					// back ref
					backRef.isAnim[dstOfst] = 1;
					backRef.isAnim[dstOfst] = iAnim;
					backRef.isAnim[dstOfst] = i;
					dstOfst++;
				}
			}
		}
		
	};

	o.fast.animatedTiles_to_vramTileset = function(animations, vramRefs, vramTileset, iFrame, backRef=null){

		// normal working : does not set backRef
		if(!backRef){
			let len = animations.length;
			for(let iAnim=0; iAnim<len; iAnim++){
				let anim = vramRefs[iAnim];
				if(anim){
					let animTileset = animations[iAnim];
					let frameBytes = anim.tileCount * 32;
					let srcOfst = iFrame * frameBytes;
					let dstOfst = anim.destIndex * 32;
					for(let i=0; i<frameBytes; i++){
						vramTileset[dstOfst] = animTileset[srcOfst];
						srcOfst++;
						dstOfst++;
					}
				}
			}
		// special : sets backRef in the same time
		}else{
			let len = animations.length;
			for(let iAnim=0; iAnim<len; iAnim++){
				let anim = vramRefs[iAnim];
				if(anim){
					let animTileset = animations[iAnim];
					let frameBytes = anim.tileCount * 32;
					let srcOfst = iFrame * frameBytes;
					let dstOfst = anim.destIndex * 32;
					for(let i=0; i<frameBytes; i++){
						vramTileset[dstOfst] = animTileset[srcOfst]; // set vram

						// back ref
						backRef.isAnim[dstOfst] = 1;
						backRef.isAnim[dstOfst] = iAnim;
						backRef.isAnim[dstOfst] = i;

						srcOfst++;
						dstOfst++;
					}
				}
			}
		}

	};

	o.fast.vramTileset_to_animatedTiles = function(animations, vramRefs, vramTileset, iFrame){
		let len = animations.length;
		for(let iAnim=0; iAnim<len; iAnim++){
			let anim = vramRefs[iAnim];
			if(anim){
				let animTileset = animations[iAnim];
				let frameBytes = anim.tileCount * 32;
				let dstOfst = iFrame * frameBytes;
				let srcOfst = anim.destIndex * 32;
				for(let i=0; i<frameBytes; i++){
					animTileset[dstOfst] = vramTileset[srcOfst];
					dstOfst++;
					srcOfst++;
				}
			}
		}
	};









	// one mapchip holds many chip
	// one chip holds 16 fragments

	o.draw_oneChip = function(tileset, mapchips, iChip, palettes, ctx, hChipFlip=0, vChipFlip=0, xCtx=0,yCtx=0){

		let tiles = o.fast.format_4bppTileset(tileset);
		
		let chipOffset = iChip * 32;
		
		let xp,yp, xf,yf, x,y, xtp,ytp;
		let fragOffset, iTile;
		let lowByte, highByte, param;
		let iPal, iCol;
		let hFlip,vFlip, hF,vF;
		let flip2 = app.ref.get_flipTable(2);
		let flip4 = app.ref.get_flipTable(4);
		let flip8 = app.ref.get_flipTable(8);
		let pix;
		let pixels = ctx.createImageData(32, 32);
		
		// by chip fragment
		let iFrag, xFrag,yFrag;
	//	for(let iFrag=0; iFrag<16; iFrag++){
		for(let yf=0; yf<4; yf++)
		for(let xf=0; xf<4; xf++){
		
			xFrag = flip4[hChipFlip][xf];
			yFrag = flip4[vChipFlip][yf];
		
			iFrag = (yFrag*4) + xFrag;
		
			fragOffset = chipOffset + (iFrag*2);
			
			lowByte = mapchips[fragOffset];
			highByte = mapchips[fragOffset+1];
			
			iTile = ( (highByte & 0x03) << 8 ) + lowByte
			
			iPal = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
		
			hFlip = (highByte & 0x40) >> 6;
			vFlip = (highByte & 0x80) >> 7;
		
			// invert with chip flip
			hFlip = flip2[hChipFlip][hFlip];
			vFlip = flip2[vChipFlip][vFlip];
		
		//	hF = hFlip ? -1 : 1
		//	vF = vFlip ? -1 : 1
		
		//	xf = iFrag % 4;
		//	yf = Math.floor(iFrag/4);
			
			// by pixel (absolute position)
			for(yp=0; yp<8; yp++)
				for(xp=0; xp<8; xp++){

				// tile pixel sampling position relative to flip
				//xtp = (hFlip*7) + (xp*hF);
				//ytp = (vFlip*7) + (yp*vF);
				xtp = flip8[hFlip][xp];
				ytp = flip8[vFlip][yp];
				
				// relative pixel position on chip draw
				x = (xf*8) + xp;
				y = (yf*8) + yp;
				
				// pixel color
				iCol = tiles[iTile][ytp][xtp];
				c = palettes[iPal][iCol];
				
				// pixel index in ImageData type
				pix = (y*pixels.width) + x;
				
				// set rgba ImageData
				pixels.data[(pix*4)+0] = c[0];
				pixels.data[(pix*4)+1] = c[1];
				pixels.data[(pix*4)+2] = c[2];
				pixels.data[(pix*4)+3] = 255;
			}
		}
		//ctx.putImageData(pixels, 0,0);
		ctx.putImageData(pixels, xCtx,yCtx);
	};



	o.draw_mapchip = function(tileset, mapchips, palettes, xcmax, ctx){

		let tiles = o.fast.format_4bppTileset(tileset);
		
		let len = Math.floor(mapchips.length / 32);
		
		let xp,yp, xf,yf, x,y, xtp,ytp;
		let fragOffset, iTile;
		let lowByte, highByte, param;
		let iPal, iCol;
		let hFlip,vFlip, hF,vF;
		
		//let xcmax = 16;
		
		let pix;
		let pixels = ctx.createImageData(xcmax*32, Math.ceil(len/xcmax)*32);
		
		// by chip
		for(let iChip=0; iChip<len; iChip++){
		
			let chipOffset = iChip * 32;
		
			xc = iChip % xcmax;
			yc = Math.floor(iChip/xcmax);
		
			// by chip fragment
			for(let iFrag=0; iFrag<16; iFrag++){
			
				fragOffset = chipOffset + (iFrag*2);
				
				lowByte = mapchips[fragOffset];
				highByte = mapchips[fragOffset+1];
				
				iTile = ( (highByte & 0x03) << 8 ) + lowByte;
				
				iPal = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
			
				hFlip = (highByte & 0x40) >> 6;
				vFlip = (highByte & 0x80) >> 7;
			
				hF = hFlip ? -1 : 1;
				vF = vFlip ? -1 : 1;
			
				xf = iFrag % 4;
				yf = Math.floor(iFrag/4);
				
				// by pixel (absolute position)
				for(yp=0; yp<8; yp++)
					for(xp=0; xp<8; xp++){

					// tile pixel sampling position relative to flip
					xtp = (hFlip*7) + (xp*hF);
					ytp = (vFlip*7) + (yp*vF);
					
					// relative pixel position on chip draw
					x = (xc*32) + (xf*8) + xp;
					y = (yc*32) + (yf*8) + yp;
					
					
					// debug
						iTile = tiles[iTile]===undefined? 0 : iTile;
						//iTile = tiles[iTile]===undefined? tiles.length-1 : iTile; 
					// end debug
					
					
					// pixel color
					iCol = tiles[iTile][ytp][xtp];
					c = palettes[iPal][iCol];
					
					// pixel index in ImageData type
					pix = (y*pixels.width) + x;
					
					// set rgba ImageData
					pixels.data[(pix*4)+0] = c[0];
					pixels.data[(pix*4)+1] = c[1];
					pixels.data[(pix*4)+2] = c[2];
					pixels.data[(pix*4)+3] = 255;
				}
			}
		
		}
		
		ctx.putImageData(pixels, 0,0);
	};


	// draw_background8x8
	o.draw_background = function(tileset, bgtilemap, palettes, xtmax, ctx){
	
		let tiles = o.fast.format_2bppTileset(tileset);
		//let tiles = o.fast.format_4bppTileset(tileset);
		//let tiles = o.fast.format_8bppTileset(tileset);
	
		let len = bgtilemap.length / 2;
		
		//let xtmax = 32;
		
		let pix;
		let pixels = ctx.createImageData(xtmax*8, Math.ceil(len/xtmax)*8);
		
		for(let iTmap=0; iTmap<len; iTmap++){

			offset = iTmap * 2;
		
			lowByte = bgtilemap[offset];
			highByte = bgtilemap[offset+1];
			
			iTile = ( (highByte & 0x03) << 8 ) + lowByte
			
			iPal = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
			//console.log(iPal);
		
			hFlip = (highByte & 0x40) >> 6;
			vFlip = (highByte & 0x80) >> 7;
	
			hF = hFlip ? -1 : 1
			vF = vFlip ? -1 : 1
		
			xt = iTmap % xtmax;
			yt = Math.floor(iTmap/xtmax);
		
			// by pixel (absolute position)
			for(yp=0; yp<8; yp++)
				for(xp=0; xp<8; xp++){

				// tile pixel sampling position relative to flip
				xtp = (hFlip*7) + (xp*hF);
				ytp = (vFlip*7) + (yp*vF);
				
				// relative pixel position on chip draw
				x = (xt*8) + xp;
				y = (yt*8) + yp;
				
				// pixel color
				iCol = tiles[iTile][ytp][xtp];
				c = palettes[iPal][iCol];
				
				// pixel index in ImageData type
				pix = (y*pixels.width) + x;
				
				// set rgba ImageData
				pixels.data[(pix*4)+0] = c[0];
				pixels.data[(pix*4)+1] = c[1];
				pixels.data[(pix*4)+2] = c[2];
				pixels.data[(pix*4)+3] = 255;
			}
		
		}
	
		ctx.putImageData(pixels, 0,0);
	};
	


	// ne sert a rien
	o.draw_background16x8 = function(tileset, bgtilemap, palettes, xtmax, ctx){
	
		let tiles = o.fast.format_2bppTileset(tileset);
		//let tiles = o.fast.format_4bppTileset(tileset);
		//let tiles = o.fast.format_8bppTileset(tileset);
	
		let len = bgtilemap.length >> 1;
		
		//let xtmax = 32;
		
		let pix;
		let pixels = ctx.createImageData(xtmax*8, Math.ceil(len/xtmax)*8);
		
		let iTmap;

		for(let iT=0; iT<len-1; iT++){

			iTmap = (iT&0x1) ? iT-1 : iT+1;

			offset = iTmap * 2;
		
			lowByte = bgtilemap[offset];
			highByte = bgtilemap[offset+1];
			
			iTile = ( (highByte & 0x03) << 8 ) + lowByte
			
			iPal = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
			//console.log(iPal);
		
			hFlip = (highByte & 0x40) >> 6;

			//hFlip ^= 1;

			vFlip = (highByte & 0x80) >> 7;
		
			hF = hFlip ? -1 : 1
			vF = vFlip ? -1 : 1
		
			xt = iT % xtmax;
			yt = Math.floor(iT/xtmax);
		
			// by pixel (absolute position)
			for(yp=0; yp<8; yp++)
				for(xp=0; xp<8; xp++){

				// tile pixel sampling position relative to flip
				xtp = (hFlip*7) + (xp*hF);
				ytp = (vFlip*7) + (yp*vF);
				
				// relative pixel position on chip draw
				x = (xt*8) + xp;
				y = (yt*8) + yp;
				
				// pixel color
				iCol = tiles[iTile][ytp][xtp];
				c = palettes[iPal][iCol];
				
				// pixel index in ImageData type
				pix = (y*pixels.width) + x;
				
				// set rgba ImageData
				pixels.data[(pix*4)+0] = c[0];
				pixels.data[(pix*4)+1] = c[1];
				pixels.data[(pix*4)+2] = c[2];
				pixels.data[(pix*4)+3] = 255;
			}
		
		}
	
		ctx.putImageData(pixels, 0,0);
	};
	
	

	o.draw_hLvlTilemap = function(tileset, ytmax, mapchips, lvltilemap, palettes, ctx){

		let tiles = o.fast.format_4bppTileset(tileset);
		
		let len = Math.floor(lvltilemap.length / 2);
		
		let xp,yp, xf,yf, xlt,ylt, x,y, xtp,ytp;
		let fragOffset, iTile;
		let lowByte, highByte, param;
		let iPal, iCol;
		let hFlip,vFlip, hF,vF;
		
		//let ytmax = 512 / 32;
		
		let iChip, chipOffset;
		let hMapFlip,vMapFlip, hMF,vMF;
		let inv = [[0,1],[1,0]];
		let iFrag;
		
		let pix;
		let pixels = ctx.createImageData(Math.ceil(len/ytmax)*32, ytmax*32);
		
		var priorityFlag;
		
		// by level tile
		for(let iLTM=0; iLTM<len; iLTM++){
		
			// get iChip
			lowByte = lvltilemap[(iLTM*2)+0];
			highByte = lvltilemap[(iLTM*2)+1];

//vh00 000t tttt tttt (shipdeck fg metamap in tilemap theory)
//console.log(highByte&(0xFF-0xC1));

			iChip = ((highByte&0x0F)<<8) + lowByte;
			chipOffset = iChip * 32;
			
			hMapFlip = (highByte & 0x40) >> 6;
			vMapFlip = (highByte & 0x80) >> 7;
			
			hMF = hMapFlip ? -1 : 1
			vMF = vMapFlip ? -1 : 1
		
			xlt = Math.floor(iLTM/ytmax);
			ylt = iLTM % ytmax;
		
			// by chip fragment
			for(let iyFrag=0; iyFrag<4; iyFrag++)
			for(let ixFrag=0; ixFrag<4; ixFrag++){
			
				xFrag = (hMapFlip*3) + (ixFrag*hMF);
				yFrag = (vMapFlip*3) + (iyFrag*vMF);
			
				iFrag = (yFrag*4) + xFrag;
			
				fragOffset = chipOffset + (iFrag*2);
				
				lowByte = mapchips[fragOffset];
				highByte = mapchips[fragOffset+1];
				
				iTile = ( (highByte & 0x03) << 8 ) + lowByte
				
				iPal = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
			
				hFlip = (highByte & 0x40) >> 6;
				vFlip = (highByte & 0x80) >> 7;
			
				// revert flip from tilemap
				hFlip = inv[hMapFlip][hFlip];
				vFlip = inv[vMapFlip][vFlip];

				hF = hFlip ? -1 : 1
				vF = vFlip ? -1 : 1
				
				xf = ixFrag; //iFrag % 4;
				yf = iyFrag; //Math.floor(iFrag/4);
				
				
				// get priority
				priorityFlag = (highByte&0x20) >> 5;
				
				
				// by pixel (absolute position)
				for(yp=0; yp<8; yp++)
					for(xp=0; xp<8; xp++){

					// tile pixel sampling position relative to flip
					xtp = (hFlip*7) + (xp*hF);
					ytp = (vFlip*7) + (yp*vF);
					
					// relative pixel position on chip draw
					x = (xlt*32) + (xf*8) + xp;
					y = (ylt*32) + (yf*8) + yp;
					
					// pixel color
					iCol = tiles[iTile][ytp][xtp];
					c = palettes[iPal][iCol];
					
					
					
					
					// overwrite color for priority flag test
					/*
					if(priorityFlag===1) c = this.defaultPalettes[1][iCol];
					*/
					
					
//					// overwrite color for tilemap flip flag test
//					if(hMapFlip===1) c = this.defaultPalettes[0][iCol];
//					if(vMapFlip===1) c = this.defaultPalettes[1][iCol];
//					if(hMapFlip===1 && vMapFlip===1) c = this.defaultPalettes[2][iCol];
//					
//					if((highByte&0x40)>>6) c = this.defaultPalettes[3][iCol];
//					if((highByte&0x80)>>7) c = this.defaultPalettes[4][iCol];
//					if( ((highByte&0x40)>>6) && ((highByte&0x80)>>7) ) c = this.defaultPalettes[5][iCol];
					
					
					/*
					if(hMapFlip===1){
						if( ((highByte&0x40)>>6) )
							if((highByte&0x80)>>7)
								c = this.defaultPalettes[4][iCol];
					}
					*/
					//if(vMapFlip===1) c = this.defaultPalettes[0][iCol];
					
					
					
					
					// pixel index in ImageData type
					pix = (y*pixels.width) + x;
					
					// set rgba ImageData
					pixels.data[(pix*4)+0] = c[0];
					pixels.data[(pix*4)+1] = c[1];
					pixels.data[(pix*4)+2] = c[2];
					pixels.data[(pix*4)+3] = 255;
				}
			}
		
		}
		
		ctx.putImageData(pixels, 0,0);
	};


	o.draw_vLvlTilemap = function(tileset, xtmax, mapchips, lvltilemap, palettes, ctx){

		let tiles = o.fast.format_4bppTileset(tileset);
		
		let len = Math.floor(lvltilemap.length / 2);
		
		let xp,yp, xf,yf, xlt,ylt, x,y, xtp,ytp;
		let fragOffset, iTile;
		let lowByte, highByte, param;
		let iPal, iCol;
		let hFlip,vFlip, hF,vF;
		
		//let xtmax = 512 / 32;
		
		let iChip, chipOffset;
		let hMapFlip,vMapFlip, hMF,vMF;
		let inv = [[0,1],[1,0]];
		let iFrag;
		
		let pix;
		//let pixels = ctx.createImageData(Math.ceil(len/xtmax)*32, xtmax*32);
		let pixels = ctx.createImageData(xtmax*32, Math.ceil(len/xtmax)*32);
		
		var priorityFlag;
		
		// by level tile
		for(let iLTM=0; iLTM<len; iLTM++){
		
			// get iChip
			lowByte = lvltilemap[(iLTM*2)+0];
			highByte = lvltilemap[(iLTM*2)+1];
			
			iChip = ((highByte&0x0F)<<8) + lowByte;
			chipOffset = iChip * 32;
			
			hMapFlip = (highByte & 0x40) >> 6;
			vMapFlip = (highByte & 0x80) >> 7;
			
			hMF = hMapFlip ? -1 : 1
			vMF = vMapFlip ? -1 : 1
		
			//xlt = Math.floor(iLTM/xtmax);
			//ylt = iLTM % xtmax;
			xlt = iLTM % xtmax;
			ylt = Math.floor(iLTM/xtmax);
		
			// by chip fragment
			for(let iyFrag=0; iyFrag<4; iyFrag++)
			for(let ixFrag=0; ixFrag<4; ixFrag++){
			
				xFrag = (hMapFlip*3) + (ixFrag*hMF);
				yFrag = (vMapFlip*3) + (iyFrag*vMF);
			
				iFrag = (yFrag*4) + xFrag;
			
				fragOffset = chipOffset + (iFrag*2);
				
				lowByte = mapchips[fragOffset];
				highByte = mapchips[fragOffset+1];
				
				iTile = ( (highByte & 0x03) << 8 ) + lowByte
				
				iPal = (highByte & 0x1C) >> 2; // 0001 1100 0x1C palette id mask
			
				hFlip = (highByte & 0x40) >> 6;
				vFlip = (highByte & 0x80) >> 7;
			
				// revert flip from tilemap
				hFlip = inv[hMapFlip][hFlip];
				vFlip = inv[vMapFlip][vFlip];

				hF = hFlip ? -1 : 1
				vF = vFlip ? -1 : 1
				
				xf = ixFrag; //iFrag % 4;
				yf = iyFrag; //Math.floor(iFrag/4);
				
				
				// get priority
				priorityFlag = (highByte&0x20) >> 5;
				
				
				// by pixel (absolute position)
				for(yp=0; yp<8; yp++)
					for(xp=0; xp<8; xp++){

					// tile pixel sampling position relative to flip
					xtp = (hFlip*7) + (xp*hF);
					ytp = (vFlip*7) + (yp*vF);
					
					// relative pixel position on chip draw
					x = (xlt*32) + (xf*8) + xp;
					y = (ylt*32) + (yf*8) + yp;
					
					// pixel color
					iCol = tiles[iTile][ytp][xtp];
					c = palettes[iPal][iCol];
					
					
					
					
					// overwrite color for priority flag test
					/*
					if(priorityFlag===1) c = this.defaultPalettes[1][iCol];
					*/
					
					
					// overwrite color for tilemap flip flag test
					if(hMapFlip===1) c = this.defaultPalettes[0][iCol];
					if(vMapFlip===1) c = this.defaultPalettes[1][iCol];
					if(hMapFlip===1 && vMapFlip===1) c = this.defaultPalettes[2][iCol];
					
					if((highByte&0x40)>>6) c = this.defaultPalettes[3][iCol];
					if((highByte&0x80)>>7) c = this.defaultPalettes[4][iCol];
					if( ((highByte&0x40)>>6) && ((highByte&0x80)>>7) ) c = this.defaultPalettes[5][iCol];
					
					
					/*
					if(hMapFlip===1){
						if( ((highByte&0x40)>>6) )
							if((highByte&0x80)>>7)
								c = this.defaultPalettes[4][iCol];
					}
					*/
					//if(vMapFlip===1) c = this.defaultPalettes[0][iCol];
					
					
					
					
					// pixel index in ImageData type
					pix = (y*pixels.width) + x;
					
					// set rgba ImageData
					pixels.data[(pix*4)+0] = c[0];
					pixels.data[(pix*4)+1] = c[1];
					pixels.data[(pix*4)+2] = c[2];
					pixels.data[(pix*4)+3] = 255;
				}
			}
		
		}
		
		ctx.putImageData(pixels, 0,0);
	};


	

	return o;

})();
