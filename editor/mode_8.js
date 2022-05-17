
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 8 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...

		let makelabel = (label, height) => {
			let o = document.createElement('span');
			o.textContent = label;
			o.style.display = "inline-flex";
			o.style.alignItems = "center";
			o.style.height = height;
			o.style.verticalAlign = "top";
			return o;
		};


		// PAL
		//

		let snes = srcFilePanel.palette.get_data()[0];
		let pal = dkc2ldd.gfx.fast.snespalTo24bits(snes);

		// test (white col 0 like SGM2)
		pal[0][0][0] = 255; pal[0][0][1] = 255; pal[0][0][2] = 255;
		pal[1][0][0] = 255; pal[1][0][1] = 255; pal[1][0][2] = 255;
		pal[2][0][0] = 255; pal[2][0][1] = 255; pal[2][0][2] = 255;
		pal[3][0][0] = 255; pal[3][0][1] = 255; pal[3][0][2] = 255;
		pal[4][0][0] = 255; pal[4][0][1] = 255; pal[4][0][2] = 255;
		pal[5][0][0] = 255; pal[5][0][1] = 255; pal[5][0][2] = 255;
		pal[6][0][0] = 255; pal[6][0][1] = 255; pal[6][0][2] = 255;
		pal[7][0][0] = 255; pal[7][0][1] = 255; pal[7][0][2] = 255;
		// end test (white col 0 like SGM2)


		// TILESET
		//

		let tileset = srcFilePanel.tileset.get_data()[0];
		let _4tileset = dkc2ldd.gfx.fast.create_4formated4bppTileset(tileset);
		

		// MAPCHIP
		//

		let mapchip = srcFilePanel.mapchip.get_data()[0];

		// performance test
		let timeA, timeB, timeC;

		// 
		//

		let len = mapchip.length >> 5; // div by 32
		let xcmax = 16;

		let h = Math.ceil( len / xcmax ) * 32;
		let w = xcmax * 32;

		let viewport_mcgb = wLib.create_preview(w*4,h, 1);
		let viewport_mcgb_OLD_0 = wLib.create_preview(w*4,h, 1);
		let viewport_mcgb_OLD_1 = wLib.create_preview(w*4,h, 1);
		let viewport_1 = wLib.create_preview(w*4,h, 1);

		// test (white col 0 like SGM2)
		viewport_mcgb.ctx.fillStyle = "white";
		viewport_mcgb.ctx.fillRect(0,0, w*4,h);
		viewport_mcgb_OLD_0.ctx.fillStyle = "white";
		viewport_mcgb_OLD_0.ctx.fillRect(0,0, w*4,h);
		viewport_mcgb_OLD_1.ctx.fillStyle = "white";
		viewport_mcgb_OLD_1.ctx.fillRect(0,0, w*4,h);
		viewport_1.ctx.fillStyle = "white";
		viewport_1.ctx.fillRect(0,0, w*4,h);
		// end test (white col 0 like SGM2)


		// create_mapchipGfxBuffer()

		// *** normal run

		/* timeA = performance.now();
		let mcgb = dkc2ldd.gfx.fast.create_mapchipGfxBuffer(mapchip, _4tileset, pal);
		timeB = performance.now();
		timeC = timeB-timeA;
		viewport_mcgb.elem.appendChild(makelabel('mcgb : '+timeC,h));

		timeA = performance.now();
		let mcgb_OLD_0 = dkc2ldd.gfx.fast.create_mapchipGfxBuffer_OLD_0(mapchip, _4tileset, pal);
		timeB = performance.now();
		timeC = timeB-timeA;
		viewport_mcgb_OLD_0.elem.appendChild(makelabel('mcgb_OLD_0 : '+timeC,h));

		timeA = performance.now();
		let mcgb_OLD_1 = dkc2ldd.gfx.fast.create_mapchipGfxBuffer_OLD_1(mapchip, _4tileset, pal);
		timeB = performance.now();
		timeC = timeB-timeA;
		viewport_mcgb_OLD_1.elem.appendChild(makelabel('mcgb_OLD_1 : '+timeC,h)); */


		// *** test speed
		let i, test = 50;

		let mcgb; i=0;
		timeA = performance.now();
		while(i<test){ mcgb = dkc2ldd.gfx.fast.create_mapchipGfxBuffer(mapchip, _4tileset, pal); i++}
		timeB = performance.now();
		timeC = timeB-timeA;
		viewport_mcgb.elem.appendChild(makelabel('mcgb : '+timeC,h));

		let mcgb_OLD_0; i=0;
		timeA = performance.now();
		while(i<test){ mcgb_OLD_0 = dkc2ldd.gfx.fast.create_mapchipGfxBuffer_OLD_0(mapchip, _4tileset, pal); i++}
		timeB = performance.now();
		timeC = timeB-timeA;
		viewport_mcgb_OLD_0.elem.appendChild(makelabel('mcgb_OLD_0 : '+timeC,h));

		let mcgb_OLD_1; i=0;
		timeA = performance.now();
		while(i<test){ mcgb_OLD_1 = dkc2ldd.gfx.fast.create_mapchipGfxBuffer_OLD_1(mapchip, _4tileset, pal); i++}
		timeB = performance.now();
		timeC = timeB-timeA;
		viewport_mcgb_OLD_1.elem.appendChild(makelabel('mcgb_OLD_1 : '+timeC,h));

		

		for(let i=0; i<len; i++){

			let x = (i % xcmax) * 32;
			let y = (Math.floor(i / xcmax)) * 32;

			viewport_mcgb.ctx.putImageData( mcgb.n[i], x,       y);
			viewport_mcgb.ctx.putImageData( mcgb.h[i], x+(w),   y);
			viewport_mcgb.ctx.putImageData( mcgb.v[i], x+(w*2), y);
			viewport_mcgb.ctx.putImageData( mcgb.a[i], x+(w*3), y);

			viewport_mcgb_OLD_0.ctx.putImageData( mcgb_OLD_0.n[i], x,       y);
			viewport_mcgb_OLD_0.ctx.putImageData( mcgb_OLD_0.h[i], x+(w),   y);
			viewport_mcgb_OLD_0.ctx.putImageData( mcgb_OLD_0.v[i], x+(w*2), y);
			viewport_mcgb_OLD_0.ctx.putImageData( mcgb_OLD_0.a[i], x+(w*3), y);

			viewport_mcgb_OLD_1.ctx.drawImage( mcgb_OLD_1.n[i].canvas, x,       y);
			viewport_mcgb_OLD_1.ctx.drawImage( mcgb_OLD_1.h[i].canvas, x+(w),   y);
			viewport_mcgb_OLD_1.ctx.drawImage( mcgb_OLD_1.v[i].canvas, x+(w*2), y);
			viewport_mcgb_OLD_1.ctx.drawImage( mcgb_OLD_1.a[i].canvas, x+(w*3), y);

			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 0,0, x,       y);
			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 1,0, x+(w),   y);
			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 0,1, x+(w*2), y);
			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 1,1, x+(w*3), y);

		}

		// workspace element connexion
		let noflexdiv = document.createElement("div");
		noflexdiv.style.width = "fit-content";
		noflexdiv.style.height = "fit-content";
		//noflexdiv.style.overflow = "hidden";
		noflexdiv.style.whiteSpace = "nowrap";
			noflexdiv.appendChild(viewport_mcgb.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_mcgb_OLD_0.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_mcgb_OLD_1.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_1.elem);
		workspace.elem.appendChild(noflexdiv);

		// update
		o.update = function(trigger){

		};

		// close
		o.close = function(){
			// app.mode[ 8 ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();
