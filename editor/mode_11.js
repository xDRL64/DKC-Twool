
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 11 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "t";

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

		let tilesetSlot = srcFilePanel.tileset;
		let animationSlot = srcFilePanel.animation;

		let TST = app.component.Tileset(
			{ownerRefs:tilesetSlot.get_dataWithOwnerAccess(), byteOffset:0, vramOffset:32*32},
			{ownerRefs:animationSlot.get_dataWithOwnerAccess(), vramRefs:animationSlot.vramRefs},
		);

		TST.init();
		TST.load();
		
		let debugtile = [
			24,24,24,24,24,24,255,255,255,255,
			24,24,24,24,24,24,24,219,24,153,24,
			24,255,255,255,255,24,24,24,153,24,219
		];
		let tileset = TST.get_vram().buffer;
		//tileset.set(debugtile);
		
		let iframe = 0;
		
		setInterval(function(){
			TST.anim(iframe);
			app.gfx.fast.draw_4bppTileset(tileset, pal, 0,0, xtmax, ctx);
			iframe++;
			iframe = iframe % 8;
		},100);

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
