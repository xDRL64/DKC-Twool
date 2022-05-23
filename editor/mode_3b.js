
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ '3b' ] = function(editModePanParams){

		// interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let paletteSlot = srcFilePanel.palette;
		let tilesetSlot = srcFilePanel.bgtileset;
		let wLib = app.editor;

		// current workspace object
		let o = {};

		// code ...
		let bpp = tilesetSlot.vramRefs?.[0]?.bpp || 4;
		let bppSize = ({2:16,4:32,8:64})[bpp];

		let debugOfst = 0;
		let tilesize = 16;
		let debugxtmax = 0//9;
		srcFilePanel.background.parameters.onkeydown = function(e){
			if(e.code === 'Enter') o.update();
			if(e.code === 'ArrowUp') debugOfst++;
			if(e.code === 'ArrowDown') debugOfst--;
			if(e.code === 'ArrowRight') debugxtmax++;
			if(e.code === 'ArrowLeft') debugxtmax--;
			console.log(debugOfst,debugxtmax);
			//this.value = debugOfst * bppSize;
		};

		// update
		o.update = function(trigger){
			if(srcFilePanel.palette.multi > 0)
			if(srcFilePanel.bgtileset.multi > 0)
			if(srcFilePanel.background.multi > 0){
			
				// empty workspace (to empty html child elements)
				workspace.elem.textContent = "mode 3b";

				// get source file slot parameters (mapchip)
				let parameters = srcFilePanel.background.parameters.value.match(/\w{1,}/g) || [];

				let xtmax = parseInt(parameters[0]) || 32//debugxtmax//32;
				let scale = parseInt(parameters[1]) || 1;

				let palDataAccess = paletteSlot.get_dataWithOwnerAccess();
				let PAL = app.component.Palette( {ownerRefs:palDataAccess, byteOffset:0} );
				PAL.init();
				PAL.update('formated'+bpp);
				let palettes = PAL.type['formated'+bpp];
				
				//let bgtileset = srcFilePanel.bgtileset.get_data()[0];
				let tlstDataAccess = tilesetSlot.get_dataWithOwnerAccess();
				let TLST = app.component.Tileset(
					{ownerRefs:tlstDataAccess, byteOffset:0, vramOffset:(tilesetSlot.vramRefs?.[0]?.tileOfst||0)*bppSize},
					//{ownerRefs:tlstDataAccess, byteOffset:0, vramOffset:0},
					//{ownerRefs:tlstDataAccess, byteOffset:0, vramOffset:debugOfst*bppSize},
					bpp,
					{ownerRefs:[], vramRefs:[]}
				);
				TLST.init();
				TLST.load();
				TLST.update('formated'+bpp);
				bgtileset = TLST.type['formated'+bpp];

				let background = srcFilePanel.background.get_data()[0];
			   
				let len = background.length >> 1;

				// create backgound viewport
				let W = xtmax * 8;
				let H = Math.ceil(len/xtmax) * 8;

				o.viewport = wLib.create_preview(W, H, scale);
				workspace.elem.appendChild(o.viewport.view);

				//palettes = app.gfx.fast._4bppPal_to_2bppPal(palettes);
				//palettes = app.gfx.fast.format_palette(snespal, 2);
				//palettes = app.gfx.def2bppPal;

				let _pal = app.gfx.defaultPalettes;
				let pal256 = _pal[0].concat(_pal[1]).concat(_pal[2]).concat(_pal[3]).
							concat(_pal[4]).concat(_pal[5]).concat(_pal[6]).concat(_pal[7]);
				pal256 = pal256.concat(pal256);
				//palettes = [pal256,pal256,pal256,pal256, pal256,pal256,pal256,pal256,];

				// draw background

				//bgtileset = app.gfx.fast.format_2bppTileset(bgtileset);
				//bgtileset = app.gfx.fast.format_4bppTileset(bgtileset);
				//bgtileset = app.gfx.fast.format_8bppTileset(bgtileset);

				app.gfx.draw_background(bgtileset, background, palettes, xtmax, o.viewport.ctx);
				//app.gfx.draw_background16x8(bgtileset, background, palettes, xtmax, o.viewport.ctx);
			}

		};

		o.close = function(){
			// app.mode[ /**/put its mode id/**/ ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export update methode)
		workspace.current = o;

	};

})();
