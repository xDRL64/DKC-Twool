
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


		let tileset = srcFilePanel.tileset.get_data()[0];
		let mapchip = srcFilePanel.mapchip.get_data()[0];

		let _4tileset = dkc2ldd.gfx.fast.create_4formated4bppTileset(tileset);

		let time0, time1;
		time0 = performance.now();
		let mcBuff = dkc2ldd.gfx.fast.create_mapchipGfxBuffer(mapchip, _4tileset, pal);
		time1 = performance.now(); time = time1-time0;



		let len = mapchip.length / 32;
		let xcmax = 16;

		let h = Math.ceil( len / xcmax ) * 32;
		let w = xcmax * 32;

		let viewport_0 = wLib.create_preview(w*4,h, 1);
		let viewport_1 = wLib.create_preview(w*4,h, 1);

		// test (white col 0 like SGM2)
		viewport_0.ctx.fillStyle = "white";
		viewport_0.ctx.fillRect(0,0, w*4,h);
		viewport_1.ctx.fillStyle = "white";
		viewport_1.ctx.fillRect(0,0, w*4,h);
		// end test (white col 0 like SGM2)

		for(let i=0; i<len; i++){

			let x = (i % xcmax) * 32;
			let y = (Math.floor(i / xcmax)) * 32;

			viewport_0.ctx.putImageData( mcBuff.n[i], x,       y);
			viewport_0.ctx.putImageData( mcBuff.h[i], x+(w), y);
			viewport_0.ctx.putImageData( mcBuff.v[i], x+(w*2), y);
			viewport_0.ctx.putImageData( mcBuff.a[i], x+(w*3), y);

			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 0,0, x,       y);
			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 1,0, x+(w), y);
			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 0,1, x+(w*2), y);
			app.gfx.draw_oneChip(tileset, mapchip, i, pal, viewport_1.ctx, 1,1, x+(w*3), y);

		}

		// workspace element connexion
		let noflexdiv = document.createElement("div");
		noflexdiv.appendChild(viewport_0.elem);
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
