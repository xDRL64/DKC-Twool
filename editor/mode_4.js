
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ 4 ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

        // empty workspace (to empty html child elements)
        workspace.elem.textContent = "";

        // current workspace object
        let o = {};

        // code ...
        srcFilePanel.tilemap.parameters.onkeydown = function(e){
            if(e.code === 'Enter') o.update();
        };

        // editor memory  
        let _gfx = 'fast';
        let lvlDirection;
        let tileMax;

        let currentColorIndex = 0;
        let currentChipfragPos = [0,0];

        let snespal;
        let palettes;
        let tileset;
        let mapchip;
        let tilemap;

        let _tileset;
        let _mapchip;
        let _tilemap;

        let make_editor = function(wViewport, hViewport){

            // viewport
            o.viewport = wLib.create_hoverPreview(wViewport, hViewport, 1, [['main',32,32, 1],['scnd',8,8, 1]], 0);
			o.viewport.init(workspace.elem);
			
			// preview panel
			o.previewPanel = document.createElement("div");
			o.previewPanel.style.position = "absolute";
			o.previewPanel.style.display = "flex";
			//o.previewPanel.style.flex = "none";
			o.previewPanel.style.width = "fit-content";
			o.previewPanel.style.whiteSpace = "nowrap";
			
			o.previewPanel.style.left = 0;
			o.previewPanel.style.bottom = 0;
			
			workspace.elem.appendChild(o.previewPanel);
			
			// 4 tiles preview panel
			o.tilePrevPan = wLib.create_4previewPanel(32, 32, 2, [['main',8,8, 1],['scnd',1,1, 1]]);
			o.previewPanel.appendChild(o.tilePrevPan.elem);
			o.tilePrevPan.elem.style.flex = "none";
			//o.tilePrevPan.nFlip.cursor.main.setBorderSize(2);
			
			
			// 4 8x8 tiles preview panel
			o.t8x8PrevPan = wLib.create_4previewPanel(8, 8, 8, [['main',1,1, 1]]);
			o.t8x8PrevPan.elem.style.flex = "none";
			o.previewPanel.appendChild(o.t8x8PrevPan.elem);
		
		
			// flipped 8x8 tile preview
			o.f8x8Prev = wLib.create_hoverPreview(8,8, 16, [['main',1,1, 1]], 3, 0);
			o.f8x8Prev.elem.style.flex = "none";
			o.f8x8Prev.init(o.previewPanel);
		
		
			// pal preview
			o.palPreview = wLib.create_preview(16,8, 16, [['main',16,1, 1],['scnd',1,1, 1],['third',1,8, 1]], 3);
			o.previewPanel.appendChild(o.palPreview.elem);
			let ctx_palPrev = o.palPreview.ctx;

			// pal prev cursors
			o.palPreview.cursor.main.setColor('#ff0000');
			o.palPreview.cursor.main.setBorderSize(3);
			o.palPreview.cursor.scnd.setColor('#00ff00');
			o.palPreview.cursor.scnd.setBorderSize(3);
			o.palPreview.cursor.third.setColor('#ffff00');
			o.palPreview.cursor.third.setBorderSize(3);
        };



        let set_event = function(){
			// prototype editor version
			////////////////////////////
	
			o.f8x8Prev.elem.onmousemove = function(e){
				let pos = o.f8x8Prev.get_mousePos(e);
                let scale = o.f8x8Prev.S;
                let xt = Math.floor(pos.x/scale);
                let yt = Math.floor(pos.y/scale);

                let x = xt + (currentChipfragPos[0]*8);
                let y = yt + (currentChipfragPos[1]*8);
                let _pos = {x,y};

                o.f8x8Prev.cursor.main.gridMove(xt,yt);

                if(e.buttons)
                    drawMousePos(_pos);

                // quick draw update
                o.f8x8Prev.lastDrawReq();
                
				console.log(xt,yt);
			};
	
	
			o.palPreview.view.onclick = function(e){
				let pos = {x:e.offsetX, y:e.offsetY};
				currentColorIndex = Math.floor(pos.x/16); // replace 16 by scale system value

				//console.log(currentColorIndex)
				//o.viewport.elem.onmousemove(e);

                // update current pen color index
				o.palPreview.cursor.third.gridMove(currentColorIndex,0);
			};

			
			let drawMousePos = function(pos){
			
				let processRef = app.features.write_tilemap_to_4bppPix(
					tilemap, lvlDirection, tileMax, mapchip, tileset, pos.x,pos.y, currentColorIndex);

				let tileObj = processRef.tile;
				let chipObj = processRef.chip;
					
				let _hFlip = tileObj.hFlip ^ chipObj.hFlip;
				let _vFlip = tileObj.vFlip ^ chipObj.vFlip;
				app.gfx[_gfx].draw_4bppTile(
					tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex],
					_hFlip,_vFlip, o.viewport.ctx, tileObj.xtf*8, tileObj.ytf*8);
			};
			
			o.viewport.elem.onclick = function(e){
				let pos = o.viewport.get_mousePos(e);
				drawMousePos(pos);
				o.viewport.elem.onmousemove(e);
			};

            	
			o.viewport.elem.onmousemove = function(e){

				// get hover preview position (precise e.offsetXY)
				let pos = o.viewport.get_mousePos(e);
		

				// test draw mouse
				if(e.buttons)
					drawMousePos(pos);
				
                // hold shift to keep last prev panel
                if(e.shiftKey)
                    return;
                //console.log(e)
				
			
				let tileObj = app.ref.tilemapPixpos_to_tile(
					pos.x, pos.y, tilemap, lvlDirection, tileMax);
					
					
				let chipObj = app.ref.chipPixpos_to_chipFrag(
					tileObj.xtp,tileObj.ytp, tileObj.chipIndex, mapchip, tileObj.hFlip,tileObj.vFlip);
				
				
				let tf8x8Obj = app.ref.t8x8PixPos_to_4bppData(
					chipObj.x8p, chipObj.y8p, chipObj.tile8x8Index, tileset, tileObj.hFlip,tileObj.vFlip);
				
				let cf8x8Obj = app.ref.t8x8PixPos_to_4bppData(
					chipObj.x8p, chipObj.y8p, chipObj.tile8x8Index, tileset, chipObj.hFlip,chipObj.vFlip);
				
				let _hFlip = tileObj.hFlip ^ chipObj.hFlip;
				let _vFlip = tileObj.vFlip ^ chipObj.vFlip;
				let f8x8Obj = app.ref.t8x8PixPos_to_4bppData(
					chipObj.x8p, chipObj.y8p, chipObj.tile8x8Index, tileset, _hFlip,_vFlip);

                // viewport cursors update
				o.viewport.cursor.main.gridMove(tileObj.xt, tileObj.yt);
				o.viewport.cursor.scnd.gridMove(tileObj.xtf, tileObj.ytf);
				
				// tile prev panel draw update
				
				let nCtx = o.tilePrevPan.nFlip.ctx;
				let hCtx = o.tilePrevPan.hFlip.ctx;
				let vCtx = o.tilePrevPan.vFlip.ctx;
				let aCtx = o.tilePrevPan.aFlip.ctx;
				
				app.gfx.draw_oneChip(_tileset, _mapchip, tileObj.chipIndex, palettes, nCtx, 0,0);
				app.gfx.draw_oneChip(_tileset, _mapchip, tileObj.chipIndex, palettes, hCtx, 1,0);
				app.gfx.draw_oneChip(_tileset, _mapchip, tileObj.chipIndex, palettes, vCtx, 0,1);
				app.gfx.draw_oneChip(_tileset, _mapchip, tileObj.chipIndex, palettes, aCtx, 1,1);
				
				nCtx = o.t8x8PrevPan.nFlip.ctx;
				hCtx = o.t8x8PrevPan.hFlip.ctx;
				vCtx = o.t8x8PrevPan.vFlip.ctx;
				aCtx = o.t8x8PrevPan.aFlip.ctx;
				
				// 8x8 tile prev draw update
				app.gfx[_gfx].draw_4bppTile(_tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 0,0, nCtx);
				app.gfx[_gfx].draw_4bppTile(_tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 1,0, hCtx);
				app.gfx[_gfx].draw_4bppTile(_tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 0,1, vCtx);
				app.gfx[_gfx].draw_4bppTile(_tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 1,1, aCtx);
				
				
				// flipped 8x8 tile prev draw update
                o.f8x8Prev.lastDrawReq = function(){
                    app.gfx[_gfx].draw_4bppTile(tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], _hFlip,_vFlip, o.f8x8Prev.ctx);
                };
				o.f8x8Prev.lastDrawReq();
				
				
				// 4 chip tile prev panel cursors update
				/////////////////////////////////
				
				// no flip
				o.tilePrevPan.cursor.elemMove(0,0);
				
				o.tilePrevPan.set_prevCurVisible(true, false, false, false);
				o.tilePrevPan.nFlip.cursor.main.gridMove(chipObj.xFrag, chipObj.yFrag);
				o.tilePrevPan.nFlip.cursor.scnd.pixMove(chipObj.xcp, chipObj.ycp);

				// horizontal flip
				if(tileObj.hFlip===1 && tileObj.vFlip===0){
					o.tilePrevPan.cursor.elemMove(1,0);
					
					o.tilePrevPan.set_prevCurVisible(true, true, false, false);
					o.tilePrevPan.hFlip.cursor.main.gridMove(chipObj.xcf, chipObj.ycf);
					o.tilePrevPan.hFlip.cursor.scnd.pixMove(tileObj.xtp, tileObj.ytp);
				}
				
				// vertical flip
				if(tileObj.hFlip===0 && tileObj.vFlip===1){
					o.tilePrevPan.cursor.elemMove(0,1);
					
					o.tilePrevPan.set_prevCurVisible(true, false, true, false);
					o.tilePrevPan.vFlip.cursor.main.gridMove(chipObj.xcf, chipObj.ycf);
					o.tilePrevPan.vFlip.cursor.scnd.pixMove(tileObj.xtp, tileObj.ytp);
				}
				
				// all flip
				if(tileObj.hFlip===1 && tileObj.vFlip===1){
					o.tilePrevPan.cursor.elemMove(1,1);
					
					o.tilePrevPan.set_prevCurVisible(true, false, false, true);
					o.tilePrevPan.aFlip.cursor.main.gridMove(chipObj.xcf, chipObj.ycf);
					o.tilePrevPan.aFlip.cursor.scnd.pixMove(tileObj.xtp, tileObj.ytp);
				}
				

				// 4 8x8 tile prev panel cursors update
				// (positionnement des cursor sur 8x8tile par rapport aux chip flip seulement)
				//////////////////////////////////////
				
				// no flip
				o.t8x8PrevPan.cursor.elemMove(0,0);
				o.t8x8PrevPan.set_prevCurVisible(true, false, false, false);
				o.t8x8PrevPan.nFlip.cursor.main.gridMove(f8x8Obj.iPix, f8x8Obj.iRow);

				// h v a
				// without tilemap flip, flipped chip frag correspond to what is on screen.
				// so need to revert cursor xy if tilemap applies a flip.
				// chipObj.xyf8 correspond to screen if no tilemap flip,
				// and give flipped position if frag is on flipped tilemap tile.
				let x = chipObj.xf8;
				let y = chipObj.yf8;
				
				// horizontal chip flip
				if(chipObj.hFlip===1 && chipObj.vFlip===0){
					o.t8x8PrevPan.cursor.elemMove(1,0);
					o.t8x8PrevPan.set_prevCurVisible(true, true, false, false);
					o.t8x8PrevPan.hFlip.cursor.main.gridMove(x, y);
				}
				
				// vertical chip flip
				if(chipObj.hFlip===0 && chipObj.vFlip===1){
					o.t8x8PrevPan.cursor.elemMove(0,1);
					o.t8x8PrevPan.set_prevCurVisible(true, false, true, false);
					o.t8x8PrevPan.vFlip.cursor.main.gridMove(x, y);
				}
				
				// all chip flip
				if(chipObj.hFlip===1 && chipObj.vFlip===1){
					o.t8x8PrevPan.cursor.elemMove(1,1);
					o.t8x8PrevPan.set_prevCurVisible(true, false, false, true);
					o.t8x8PrevPan.aFlip.cursor.main.gridMove(x, y);
				}
				
				
				// final flipped (tilemap+mapchip) 8x8 tile prev cursors update
				o.f8x8Prev.cursor.main.gridMove(chipObj.x8p, chipObj.y8p);
				currentChipfragPos = [tileObj.xtf, tileObj.ytf];
				
				// palette
				app.gfx.fast.draw_snespal(snespal, o.palPreview.ctx);
				// current pen color index
				o.palPreview.cursor.third.gridMove(currentColorIndex,0);
				// mouse palette index
				o.palPreview.cursor.main.gridMove(0,chipObj.paletteIndex);
				// mouse color index
				o.palPreview.cursor.scnd.gridMove(f8x8Obj.iCol,chipObj.paletteIndex);
			
				
				o.previewPanel.style.left = workspace.elem.scrollLeft;
				o.previewPanel.style.bottom = -workspace.elem.scrollTop;
			};
	
        };

		let bpp = 4;
        // update
        o.update = function(trigger){

            if(srcFilePanel.check_slot('palette', 'tileset', 'mapchip', 'tilemap')){

                // empty workspace (to empty html child elements)
                workspace.elem.textContent = "";

                snespal = srcFilePanel.palette.get_data__OLD();
                palettes = app.gfx.fast.snespalTo24bits(snespal, bpp);

                tileset = srcFilePanel.tileset.get_data__OLD();
                mapchip = srcFilePanel.mapchip.get_data__OLD();
                tilemap = srcFilePanel.tilemap.get_data__OLD();

                _tileset = srcFilePanel.tileset.multi<2 ? tileset : tileset.buffer;
                _mapchip = srcFilePanel.mapchip.multi<2 ? mapchip : mapchip.buffer;
                _tilemap = srcFilePanel.tilemap.multi<2 ? tilemap : tilemap.buffer;

                let tilemapParams = srcFilePanel.tilemap.parameters.value.match(/\w{1,}/g) || [];

                lvlDirection = tilemapParams[0] || 'h';

                tileMax = parseInt(tilemapParams[1]) || 16; //h 16 , v 32

                let Tlen = tilemap.length / 2;
    
                let viewportW;
			    let viewportH;
                
                if(lvlDirection==='h'){
                    viewportW = Math.floor(Tlen/tileMax) * 32;
                    viewportH = tileMax * 32;
                }
                if(lvlDirection==='v'){
                    viewportW = tileMax * 32;
                    viewportH = Math.floor(Tlen/tileMax) * 32;
                }

                make_editor(viewportW, viewportH);

                set_event();

				
                if(lvlDirection === 'h')
                    app.gfx.draw_hLvlTilemap(_tileset, tileMax, _mapchip, _tilemap, palettes, o.viewport.ctx, bpp);
                if(lvlDirection === 'v')
                    app.gfx.draw_vLvlTilemap(_tileset, tileMax, _mapchip, _tilemap, palettes, o.viewport.ctx);
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
