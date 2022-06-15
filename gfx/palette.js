
(function(app=dkc2ldd){

	app.gfx = app.gfx || {};
	let gfx = app.gfx;

	gfx.fast = gfx.fast || {};
	let fast = gfx.fast;

	gfx.safe = gfx.safe || {};
	let safe = gfx.safe;





	const _5to8 = [
		  0,   8,  16,  24,  33,  41,  49,  57,
		 66,  74,  82,  90,  99, 107, 115, 123,
		132, 140, 148, 156, 165, 173, 181, 189,
		198, 206, 214, 222, 231, 239, 247, 255
	];
	gfx._5to8 = _5to8;

	////////////////////////////////////////////
	// FIXED SIZE PALETTE (bit depth : 2 4 8) //
	////////////////////////////////////////////

	// use it just for palette drawing
	fast.decode_palette = function(snespal, bitDepth){
		let o = [], c, t = gfx._5to8;
		let data = snespal || [];
		let size = ({2:64,4:256,8:512})[bitDepth];
		for(let offset=0; offset<size; offset+=2){
			c = (data[offset+1] << 8) + data[offset];
			o.push( new Uint8Array( [t[(c&0x001F)], t[(c&0x03E0)>>5], t[(c&0x7C00)>>10]] ) );
		}
		return o;
	};
	fast.decode_snespal = fast.decode_palette;

	// use it for palette editing or for color getting in tileset using
	fast.format_palette = function(snespal, bitDepth){

		if(bitDepth === 8) return [fast.decode_palette(snespal, 8)];

		let o = [], c, p, t = gfx._5to8, iCol;
		let offset = 0;
		let data = snespal || [];
		let palLen = ({2:4,4:16})[bitDepth];
        for(let iPal=0; iPal<8; iPal++){
            p = [];
            o.push( p );
            for(iCol=0; iCol<palLen; iCol++){
				c = (data[offset+1] << 8) + data[offset];
				p.push( new Uint8Array( [t[(c&0x001F)], t[(c&0x03E0)>>5], t[(c&0x7C00)>>10]] ) );
				offset += 2;
            }
        }

		return o;
	};
	fast.format_snespal = fast.format_palette;


	fast.draw_decodedPalette = function(data, ctx){

		let len = data.length;
		let palMax = Math.floor(len / 16);

		// convert to 24 bits
		let c;
 
        let pixels = ctx.createImageData(16, palMax);
        let pix = 0;

		for(let i=0; i<len; i++){
		
			// (read) use byte swap
			c = data[i];
		
			// write
			pixels.data[pix  ] = c[0];
			pixels.data[pix+1] = c[1];
			pixels.data[pix+2] = c[2];
			pixels.data[pix+3] = 255;

			pix += 4;
		}
        
		ctx.putImageData(pixels, 0,0);

	};

	fast.draw_formatedPalette = function(palette, bitDepth, ctx){

		if(bitDepth === 8){
			fast.draw_decodedPalette(palette[0],ctx);
			return;
		}

		let palMax = palette.length;
		
        let pixels = ctx.createImageData(16, palMax);
        let pix = 0;

		let colPerPal = ({2:4,4:16})[bitDepth];

		for(let iPal=0; iPal<palMax; iPal++){
			for(let iCol=0; iCol<colPerPal; iCol++){
		
				pixels.data[pix  ] = palette[iPal][iCol][0]; // r
				pixels.data[pix+1] = palette[iPal][iCol][1]; // g
				pixels.data[pix+2] = palette[iPal][iCol][2]; // b
                pixels.data[pix+3] = 255;

				pix += 4;
			}
		}
        ctx.putImageData(pixels, 0,0);
	};


	////////////////////////////
	// UNLIMITED SIZE PALETTE //
	////////////////////////////


	//
	// // SNESPAL TO 24BITS
	//
	// returns formatedPalette with no limite of palettes

	fast.snespalTo24bits = function(data, bpp=4){

		let len = data.length >> 1; // div by 2
		let palMax = len >> bpp; // div by [4 | 16 | 256]
		
		// convert to 24 bits
		let offset = 0;
		let r,g,b, c;
		let palettes = [];
		let palette;
        let _5to8 = gfx._5to8;

		let colMax = 1 << bpp;

        for(let iPal=0; iPal<palMax; iPal++){
            palette = [];
            palettes.push( palette );
            for(let iCol=0; iCol<colMax; iCol++){
            
                // use byte swap
                c = (data[offset+1] << 8) + data[offset];

				offset += 2;
            
                r = (c & 0x001F);
                g = (c & 0x03E0) >> 5;
                b = (c & 0x7C00) >> 10;
                
                c = [_5to8[r], _5to8[g], _5to8[b]];

                palette.push(c);
            }
        }

		return palettes;
	};

	safe.snespalTo24bits = fast.snespalTo24bits;


	//
	// // DRAW SNESPAL (safe = fast)
	//
	// draws snespal with no limite of palettes

	// use scale preview
	fast.draw_snespal = function(data, ctx){

		// clamp odd size

		let len = data.length>>1;
		let palMax = Math.ceil(len / 16);

		len = len << 1; // len * 2

		// convert to 24 bits
		let r,g,b, c;
        let _5to8 = gfx._5to8;

        let pixels = ctx.createImageData(16, palMax);
        let pix = 0;

		for(let offset=0; offset<len; offset+=2){
		
			// (read) use byte swap
			c = (data[offset+1] << 8) + data[offset];
		
			r = (c & 0x001F);
			g = (c & 0x03E0) >> 5;
			b = (c & 0x7C00) >> 10;
			
			// write
			pixels.data[pix  ] = _5to8[r];
			pixels.data[pix+1] = _5to8[g];
			pixels.data[pix+2] = _5to8[b];
			pixels.data[pix+3] = 255;

			pix += 4;
		}
        
		ctx.putImageData(pixels, 0,0);

	};

	safe.draw_snespal = fast.draw_snespal;


	//
	// // DRAW PALETTES
	//
	// draws formatedPalette with no limite of palettes
    
	fast.draw_palettes = function(palettes, bpp=4, ctx){

		let len = palettes.length;
		let palHeight = ({2:len>>2,4:len,8:len<<4})[bpp];
		let palMax = len;
		
        let pixels = ctx.createImageData(16, palHeight);
        let pix = 0;

		let colMax = 1 << bpp;

		for(let iPal=0; iPal<palMax; iPal++){
			for(let iCol=0; iCol<colMax; iCol++){
		
				pixels.data[pix  ] = palettes[iPal][iCol][0]; // r
				pixels.data[pix+1] = palettes[iPal][iCol][1]; // g
				pixels.data[pix+2] = palettes[iPal][iCol][2]; // b
                pixels.data[pix+3] = 255;

				pix += 4;
			}
		}
        ctx.putImageData(pixels, 0,0);
	};

    safe.draw_palettes = function(palettes, ctx){

		let palMax = palettes.length;
		let palette, c;
		
        let pixels = ctx.createImageData(16, palMax);
        let pix = 0;

		for(let iPal=0; iPal<palMax; iPal++){
			for(let iCol=0; iCol<16; iCol++){
		
				palette = app.lib.checkVal.undef(palettes[iPal], []);
				c = app.lib.checkVal.undef(palette[iCol], []);

				pixels.data[pix  ] = app.lib.checkVal.undef(c[0], 0);
				pixels.data[pix+1] = app.lib.checkVal.undef(c[1], 0);
				pixels.data[pix+2] = app.lib.checkVal.undef(c[2], 0);
                pixels.data[pix+3] = 255;

				pix += 4;
			}
		}
        ctx.putImageData(pixels, 0,0);
	};








})();