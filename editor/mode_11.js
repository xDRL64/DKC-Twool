
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 11 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...
		let xtmax  = 8;
		let h = Math.ceil(1024 / xtmax) * 8;
		let w = xtmax * 8;
	
		let viewport = wLib.create_preview(w,h, 2);
		workspace.elem.appendChild(viewport.elem);
		let ctx = viewport.ctx;

		let pal = app.gfx.defaultPalettes[1];

		let _pal = app.gfx.defaultPalettes;
		let pal256 = _pal[0].concat(_pal[1]).concat(_pal[2]).concat(_pal[3]).
					concat(_pal[4]).concat(_pal[5]).concat(_pal[6]).concat(_pal[7]);
		pal256 = pal256.concat(pal256);

		let tilesetSlot = srcFilePanel.tileset;
		let animationSlot = srcFilePanel.animation;

		let TST = app.component.Tileset(
			//{ownerRefs:tilesetSlot.get_dataWithOwnerAccess(), byteOffset:0, vramOffset:32*32},
			{ownerRefs:tilesetSlot.get_dataWithOwnerAccess(), byteOffset:0, vramOffset:tilesetSlot.vramRefs?.[0]?.offset || 0},
			8,
			{ownerRefs:animationSlot.get_dataWithOwnerAccess(), vramRefs:animationSlot.vramRefs, srcBppPriority:true},
		);

		TST.init();
		TST.load();
		
		let debugtile = [ // 32bytes
			24,24,24,24,24,24,255,255, 255,255,24,24,24,24,24,24,
			24,219,24,153,24,24,255,255, 255,255,24,24,24,153,24,219
		];
		let tileset = TST.get_vram().buffer;
		//tileset.set(debugtile);
		
		let decoded2bpp = app.gfx.fast.decode_2bppTileset(tileset);
		let d2 = decoded2bpp;
		let decoded4bpp = app.gfx.fast.decode_4bppTileset_NEW(tileset);
		let d4 = decoded4bpp;
		let decoded8bpp = app.gfx.fast.decode_8bppTileset(tileset);
		let d8 = decoded8bpp;

		let test2 = [
			d2[40], d2[41], d2[42], d2[43], d2[44], d2[45], d2[46], d2[47],
			d2[0], d2[0], 
		];
		let test4 = [
			d4[40], d4[41], d4[42], d4[43], d4[44], d4[45], d4[46], d4[47],
			d4[0], d4[0], 
		];
		let test8 = [
			d8[40], d8[41], d8[42], d8[43], d8[44], d8[45], d8[46], d8[47],
			d8[0], d8[0], 
		];


		//app.write.decodedTileset(tileset, test2, 2);
		//decoded2bpp = app.gfx.fast.decode_2bppTileset(tileset);
		//app.gfx.fast.draw_decodedTileset_NEW(decoded2bpp, pal, 0,0, xtmax, ctx);

		//app.write.decodedTileset(tileset, test4, 4);
		//decoded4bpp = app.gfx.fast.decode_4bppTileset_NEW(tileset);
		//app.gfx.fast.draw_decodedTileset_NEW(decoded4bpp, pal, 0,0, xtmax, ctx);

		//app.write.decodedTileset(tileset, test8, 8);
		decoded8bpp = app.gfx.fast.decode_8bppTileset(tileset, 1,1);
		app.gfx.fast.draw_decodedTileset_NEW(decoded8bpp, pal256, 0,0, xtmax, ctx);

		/*
		let iframe = 0;
		setInterval(function(){
			TST.anim(iframe);
			app.gfx.fast.draw_4bppTileset(tileset, pal, 0,0, xtmax, ctx);
			iframe++;
			iframe = iframe % 8;
		},100);
		*/

		// update
		o.update = function(trigger){

		};

		// close
		o.close = function(){
			// app.mode[ /**/put its mode id/**/ ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();
