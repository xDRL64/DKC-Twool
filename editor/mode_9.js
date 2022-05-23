
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 9 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...

		let iFrame = 0; // vram
		let lastFrame = 7;
        let intervalRoutine = setInterval(function(){iFrame++;iFrame=iFrame>lastFrame?0:iFrame;o.update()}, 100);

		srcFilePanel.background.parameters.onkeydown = function(e){
            if(e.code === 'Enter') o.update();
        };

		// update
		o.update = function(trigger){

			let _p = srcFilePanel.background.parameters.value.match(/[\w=\.]{1,}/g) || [];
            let p = new URLSearchParams(_p.join('&'));

			if(p.has('frame')) lastFrame = (parseInt(p.get('frame'))||8) - 1;

			// parameters : format=8x8 iBgFile scale
			if(p.has('format') && p.get('format')==='8x8'){
				let iBG = parseInt(_p[1]) || 0;
				if(srcFilePanel.check_slot('bganimation')){
					let vram_tileset = [];
					let animation = srcFilePanel.bganimation.get_data()[iBG];
                    let animRef = srcFilePanel.bganimation.vramRefs[iBG];
                    app.gfx.fast.animatedTiles_to_vramTileset([animation], [animRef], vram_tileset, iFrame);
					let formatedTileset;
					if(animRef.bpp===2)
						formatedTileset = app.gfx.fast.format_2bppTileset(vram_tileset);
					else
						formatedTileset = app.gfx.fast.format_4bppTileset(vram_tileset);
					
					// create viewport
					workspace.elem.textContent = "";
                    let W = 64;
                    let H = 64;
    
					let scale = parseInt(_p[2]) || 1;
                    o.viewport = wLib.create_preview(W, H, scale);
                    workspace.elem.appendChild(o.viewport.view);
                    	
                    // draw
					app.gfx.fast.draw_formatedTileset(
						formatedTileset, app.gfx.defaultPalettes[1], 0,0, 8, o.viewport.ctx
					);

				}
			// normal bg mapchip
			}else{
				if(srcFilePanel.check_slot('bganimation')){

					let xtmax = parseInt(_p[0]) || 32//debugxtmax//32;

					let vram_tileset = [];
					let animation = srcFilePanel.bganimation.get_data()[0];
                    let animRef = srcFilePanel.bganimation.vramRefs[0];
                    app.gfx.fast.animatedTiles_to_vramTileset([animation], [animRef], vram_tileset, iFrame);
					let formatedTileset;

					let bpp = animRef.bpp;

					if(bpp===2)
						formatedTileset = app.gfx.fast.format_2bppTileset(vram_tileset);
					else
						formatedTileset = app.gfx.fast.format_4bppTileset(vram_tileset);
					
					let background = srcFilePanel.background.get_data()[0];
					let len = background.length >> 1;



					let palDataAccess = srcFilePanel.palette.get_dataWithOwnerAccess();
					let PAL = app.component.Palette( {ownerRefs:palDataAccess, byteOffset:0} );
					PAL.init();
					PAL.update('formated'+bpp);
					let palettes = PAL.type['formated'+bpp];

					// create viewport
					workspace.elem.textContent = "";
                    let W = xtmax * 8;
					let H = Math.ceil(len/xtmax) * 8;
    
					let scale = parseInt(_p[1]) || 1;
                    o.viewport = wLib.create_preview(W, H, scale);
                    workspace.elem.appendChild(o.viewport.view);
                    	
                    // draw
					/* app.gfx.fast.draw_formatedTileset(
						formatedTileset, app.gfx.defaultPalettes[1], 0,0, 8, o.viewport.ctx
					); */
					app.gfx.draw_background(formatedTileset, background, palettes, xtmax, o.viewport.ctx);

				}
			}
		};

		// close
		o.close = function(){
			// app.mode[ 9 ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
			clearInterval(intervalRoutine);
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();
