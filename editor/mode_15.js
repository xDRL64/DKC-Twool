
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 15 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;
		let wLib2 = app.WorkspaceToolPack;

		let Elem = wLib2.CreateElem;
		let flags = Elem.flags;
		for(let key in flags)
			eval(`if(!${key}) var ${key} = ${flags[key]}`);

		let hex = app.lib.get_0hexStr;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		let mode_15 = Elem('div', {w:'100%', h:'100%'});

		// code ...

		// rom file (as byte array)
		let ROM = srcFilePanel.rom.fileData[0];

		if(!ROM) workspace.elem.textContent = "not loaded rom !";

		let sprite_table_bank = 0x3C;
		let sprite_table_pointer = 0x8000;
		let sprite_table_address = (sprite_table_bank<<16) + sprite_table_pointer;

		let spriteCount = 0x0;
		let spriteCountMax = 0xFFFF;
		let spriteAddress_table = new Uint32Array(spriteCountMax);
		let extract_sprite_table = function(isFirstNull=true){

			let iReadOfst = sprite_table_address; // in byte unit
			let iSprite = 0x0; // in sprite index number unit

			if(isFirstNull){
				// skip the first sprite entry (which is null pointer)
				iReadOfst += 0x4;
			}

			let spriteAddress;
			for(let i=0; i<spriteCountMax; i++){

				spriteAddress = (ROM[iReadOfst+2]<<16) + (ROM[iReadOfst+1]<<8) + (ROM[iReadOfst]);

				if(spriteAddress === 0x000000) break;

				spriteAddress_table[i] = spriteAddress & 0x3FFFFF;
				spriteCount++;
				
				iReadOfst += 0x4;
			}

			// clamp size to fit the content
			spriteAddress_table = spriteAddress_table.slice(0,spriteCount);

		};




		let get_sprite = function(address){
			
			// GET SPRITE SETTINGS DATA

			// 16x16 (*2 top)
			let _16x16_count = ROM[address];
	
			// 8x8 groupe 1
			let grp1_count   = ROM[address+1];
			let grp1_ofst    = ROM[address+2];
	
			// 8x8 groupe 2
			let grp2_count   = ROM[address+3];
			let grp2_ofst    = ROM[address+4];
	
			// 16x16 (bottom) (optional groupe 3)
			let grp3_ofst    = ROM[address+5];
			let vram         = ROM[address+6];
			let grp3_count   = ROM[address+7];

			// GET BLOCK POSITION DATA

			let block_count = _16x16_count + grp1_count + grp2_count;

			let blocks = new Array(block_count);

			let iBlock = 0;
			let start = address + 8;
			let end = start + (block_count * 2);

			let tileIndexes;
			let step = '16x16';

			for(let i=start; i<end; i+=2){

				// 16x16 block
				if(iBlock<_16x16_count){
					tileIndexes = new Uint8Array(4);
					// top of block
						tileIndexes[0] = iBlock * 2;
						tileIndexes[1] = (iBlock * 2) + 1;

					// bottom of block
						let ofst;
						// use the groupe 3 as ref for 16x16 bottom
						if(grp3_count){
							ofst = grp3_ofst + (iBlock * 2);
						}
						// use group 1 offset as ref for 16x16 bottom
						else if(grp1_ofst<(_16x16_count * 4)){
							ofst = (_16x16_count * 2) + grp1_count + (iBlock * 2);
						}
						// use what follows 16x16 top as ref for 16x16 bottom
						else{
							ofst = (_16x16_count * 2) + (iBlock * 2);
						}

						tileIndexes[2] = ofst;
						tileIndexes[3] = ofst + 1;

				// 8x8 block
				}else{
					tileIndexes = new Uint8Array(1);
					
					// determine step and calc ofst
					let ofst = iBlock - _16x16_count;
					step = ofst<grp1_count ? '8x8_grp1' : '8x8_grp2';
					if(ofst<grp1_count){
						step = '8x8_grp1';
					}
					else{
						step = '8x8_grp2';
						ofst -= grp1_count;
					}

					// groupe 1 step case
					if(step==='8x8_grp1'){
						tileIndexes[0] = grp1_ofst + ofst;
					}else{
						step = '8x8_grp2';
					}

					// groupe 2 step case
					if(step==='8x8_grp2' && grp2_count){
						tileIndexes[0] = grp2_ofst + ofst;
					}
				}



				blocks[iBlock] = {x:ROM[i], y:ROM[i+1], tileIndexes};
				iBlock++;
			}

			// GET TILES

			let tiles_address = end;
			let tile_count = (_16x16_count*4) + grp1_count + grp2_count;
			let tiles = ROM.slice(tiles_address, tiles_address+(tile_count*32));
			tiles = app.gfx.fast.format_4bppTileset(tiles);

			// RETURN OUTPUT

			return {
				settings:{
					_16x16_count,
					grp1_count, grp1_ofst,
					grp2_count, grp2_ofst,
					grp3_ofst, vram, grp3_count
				},
				blocks,
				tiles,
			};
		};


		extract_sprite_table();
		//spriteAddress_table.forEach( (e)=>console.log(hex(e)) );

		let _spriteIndex = 0; // default
		let spriteNames = [];
		let spriteIndexList = wLib2.DropList('sprite gfx index : \t');
		for(let i=0; i<spriteCount; i++)
				spriteIndexList.generate_item(`${hex(i,'0x')} : ${spriteNames[i]||'?name'}`, i);
			Elem.Set(spriteIndexList.elem, { margin:'8 0', _value:0x9C0});
			spriteIndexList.elem.children[0].setAttribute('selected', true);
			spriteIndexList.elem.style.fontFamily = 'monospace';

		let displayArea = Elem('div');

		// palette
		let pal;
		let _paletteIndex = 0; // default
		let spritePalettesTableAddress = 0x3D5FEE;
		let paletteIndexInput = Elem('input', {_type:'number', _min:0, _max:0x80, _value:0});

		let make_palette = function(defBGcolor=[0x00,0x7C]){
			let dataOfst = spritePalettesTableAddress + (_paletteIndex*2);
			dataOfst = 0x3D0000 + (ROM[dataOfst+1]<<8) + ROM[dataOfst];
			pal = defBGcolor.concat( [...ROM.slice(dataOfst,dataOfst+30)] ); // 2 + 30 = 32
			pal =  app.gfx.fast.snespalTo24bits(pal, 4);
		};

		// hard palette (debug)
			let diddy_pal = [
				0x00,0x7C, 0x66,0x04, 0x8A,0x08, 0xCD,0x0C, 0x12,0x0D, 0x56,0x11, 0x52,0x1D, 0xD9,0x2D,
				0x7F,0x3A, 0xDF,0x46, 0x5F,0x4F, 0x55,0x04, 0x7A,0x08, 0xDF,0x10, 0xEF,0x3D, 0xFF,0x7F
			];
			let zing_pal = [
				0x80,0x7D,0x00,0x00,0x69,0x00,0x52,0x0D,0x72,0x5E,0xCE,0x39,0xA4,0x1C,0x15,0x7F,
				0x45,0x35,0xAF,0x7F,0xE8,0x00,0xF2,0x01,0xF9,0x1A,0xFF,0x2F,0xFF,0x57,0xFF,0x7F
			];
			pal = zing_pal;
			pal = app.gfx.fast.snespalTo24bits(pal, 4);
		
		make_palette();

		// html elements
		mode_15.appendChild(spriteIndexList.elem);
		mode_15.appendChild(paletteIndexInput);
		mode_15.appendChild(displayArea);
		workspace.elem.appendChild(mode_15);

		// on sprite select
		//
		spriteIndexList.elem.onchange = function(){
			_spriteIndex = parseInt(this.value);

			display_sprite();
		};

		
		// on palette select
		//
		paletteIndexInput.onchange = function(){
			_paletteIndex = parseInt(this.value);

			make_palette();
			display_sprite();
		};


		let display_sprite = function(){
			displayArea.innerHTML = '';
	
			let sprite = get_sprite(spriteAddress_table[_spriteIndex]);
			let tileCount = sprite.tiles.length;
			let viewport = wLib.create_preview(tileCount*8, 8, 2);
	
			app.gfx.fast.draw_formatedTileset(sprite.tiles, pal[0], hFlip=0,vFlip=0, tileCount, viewport.ctx);
	
			displayArea.appendChild(viewport.elem);
			displayArea.appendChild(Elem('div'),{margin:8});
	
			let spriteRender = wLib.create_preview(256,256, 2);
			for(let i=0; i<sprite.blocks.length; i++){
				let block = sprite.blocks[i];
				let indexes = block.tileIndexes;
				let blockViewport;
				// 16x16 block render
				if(indexes.length === 4){
					// block by block render
					blockViewport =  wLib.create_preview(16,16, 2);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[0]]], pal[0], hFlip=0,vFlip=0, 1, blockViewport.ctx, 0,0);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[1]]], pal[0], hFlip=0,vFlip=0, 1, blockViewport.ctx, 8,0);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[2]]], pal[0], hFlip=0,vFlip=0, 1, blockViewport.ctx, 0,8);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[3]]], pal[0], hFlip=0,vFlip=0, 1, blockViewport.ctx, 8,8);
					// sprite render
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[0]]], pal[0], hFlip=0,vFlip=0, 1, spriteRender.ctx, block.x+0,block.y+0);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[1]]], pal[0], hFlip=0,vFlip=0, 1, spriteRender.ctx, block.x+8,block.y+0);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[2]]], pal[0], hFlip=0,vFlip=0, 1, spriteRender.ctx, block.x+0,block.y+8);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[3]]], pal[0], hFlip=0,vFlip=0, 1, spriteRender.ctx, block.x+8,block.y+8);
				// 8x8 block render
				}else{
					// block by block render
					blockViewport =  wLib.create_preview(8,8, 2);
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[0]]], pal[0], hFlip=0,vFlip=0, 1, blockViewport.ctx, 0,0);
					// sprite render
					app.gfx.fast.draw_formatedTileset([sprite.tiles[indexes[0]]], pal[0], hFlip=0,vFlip=0, 1, spriteRender.ctx, block.x,block.y);
				}
				displayArea.appendChild(blockViewport.elem);
				displayArea.appendChild(Elem('div',{margin:8}));
			}
	
			displayArea.appendChild(spriteRender.elem);
		};
		

		// update
		o.update = function(trigger){
			
			spriteIndexList.elem.children[0x9C0].selected = true;
			spriteIndexList.elem.onchange();
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
