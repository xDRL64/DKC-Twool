
(function(app=dkc2ldd){

	app.gfx = app.gfx || {};
	let gfx = app.gfx;

	gfx.fast = gfx.fast || {};
	let fast = gfx.fast;

	gfx.safe = gfx.safe || {};
	let safe = gfx.safe;

	fast.decode_2bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values ?
		// WRONGDAT : get zero values ?

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3;
		let tileset = [];

		let col;

		let len = data.length >> 4;

		let iPix;
		let rLen;
		
		if( (hFlip|vFlip) === 0 ){

			for(let iT=0; iT<len; iT++){

				tileset.push( new Uint8Array(64) );
				tOffset = iT << 4;
				iPix = 0;
				rLen = tOffset + 16;

				// by row
				for(let rOfst=tOffset; rOfst<rLen; rOfst+=2){

					b0 = data[ rOfst     ];
					b1 = data[ rOfst + 1 ];

					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
				
						col = 0;
						col += b0 & pix ? 0x1 : 0x0;
						col += b1 & pix ? 0x2 : 0x0;
						tileset[iT][iPix] = col;

						iPix++;
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){

				tileset.push( new Uint8Array(64) );
				tOffset = iTile << 4;
				iPix = 0;

				// by row
				for(let row=0; row<8; row++){
		
					rOffset = tOffset + (flip8[vFlip][row] * 2); // row offset
					
					b0 = data[ rOffset     ];
					b1 = data[ rOffset + 1 ];

					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;
						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						
						tileset[iTile][iPix] = col;
						iPix++;
					}
				}
			}
		}

		return tileset;
	};



	fast.draw_decodedTileset_NEW = function(data, palette, hFlip=0,vFlip=0, xtmax, ctx,x=0,y=0){
		
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
		
					iPix = (ytp*8) + xtp;
	
					c = palette[ data[iTile][iPix] ];
		
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

					iPix = (_ytp*8) + _xtp;
	
					c = palette[ data[iTile][iPix] ];
		
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











	fast.format_8bppTileset = function(data, hFlip=0,vFlip=0){

		// OVERFLOW : get zero values ?
		// WRONGDAT : get zero values ?

		let tOffset; // 8x8 tile offset
		let rOffset; // 8x8 row offset
		let bOffsets // 8x8 byte offsets
		let b0, b1, b2, b3, b4, b5, b6, b7;
		let tileset = [];

		let col;

		let len = data.length >> 6; // div by 64
		
		let iPix;


		if( (hFlip|vFlip) === 0 ){

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile << 6; // mul by 64

				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( new Uint8Array(8) );
					iPix = 0;

					rOffset = tOffset + (row << 1); // row offset
					
					b0 = data[ rOffset      ];
					b1 = data[ rOffset + 1  ];
					b2 = data[ rOffset + 16 ];
					b3 = data[ rOffset + 17 ];
				
					b4 = data[ rOffset + 32 ];
					b5 = data[ rOffset + 33 ];
					b6 = data[ rOffset + 48 ];
					b7 = data[ rOffset + 49 ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
				
						col = 0;
						
						col += b0 & pix ? 0x1 : 0x0;
						col += b1 & pix ? 0x2 : 0x0;
						col += b2 & pix ? 0x4 : 0x0;
						col += b3 & pix ? 0x8 : 0x0;

						col += b4 & pix ? 0x16 : 0x0;
						col += b5 & pix ? 0x32 : 0x0;
						col += b6 & pix ? 0x64 : 0x0;
						col += b7 & pix ? 0x128 : 0x0;
						
						tileset[iTile][row][iPix] = col;

						iPix++;
					}
				}
			}

		}else{

			let flip8 = app.ref.get_flipTable(8);
			let flipB = app.ref.get_flipTable('byte');
			let fPix;

			for(let iTile=0; iTile<len; iTile++){
				tileset.push( [] );
				tOffset = iTile << 6; // mul by 64
				// by row
				for(let row=0; row<8; row++){
		
					tileset[iTile].push( new Uint8Array(8) );
					iPix = 0;

					rOffset = tOffset + (flip8[vFlip][row] << 1); // row offset
				
					b0 = data[ rOffset      ];
					b1 = data[ rOffset + 1  ];
					b2 = data[ rOffset + 16 ];
					b3 = data[ rOffset + 17 ];
				
					b4 = data[ rOffset + 32 ];
					b5 = data[ rOffset + 33 ];
					b6 = data[ rOffset + 48 ];
					b7 = data[ rOffset + 49 ];
				
					// by row pixel
					for(let pix=0x80; pix>0x00; pix=pix>>1){
						fPix = flipB[hFlip][pix];
						col = 0;

						col += b0 & fPix ? 0x1 : 0x0;
						col += b1 & fPix ? 0x2 : 0x0;
						col += b2 & fPix ? 0x4 : 0x0;
						col += b3 & fPix ? 0x8 : 0x0;

						col += b4 & fPix ? 0x16 : 0x0;
						col += b5 & fPix ? 0x32 : 0x0;
						col += b6 & fPix ? 0x64 : 0x0;
						col += b7 & fPix ? 0x128 : 0x0;
						
						tileset[iTile][row][iPix] = col;

						iPix++;
					}
				}
			}
		}

		return tileset;
	};










})();