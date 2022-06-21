
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 'ROM' ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.innerHTML = "";

		// current workspace object
		let o = {};

		let _calc_vramRef = function(){
			let bpp = this.bpp;
			if(bpp){
				let bppSizeBitshift = ({2:4,4:5,8:6})[bpp] || 0;
				let frameSize = this.animTiles << bppSizeBitshift;
				let frameCount = this.frameCount || 0;
				this.destOffset = this.dstIndex << bppSizeBitshift;
				this.frameSize = frameSize;
				this.srcOffsets = new Uint16Array(frameCount);
				for(let iFrame=0; iFrame<frameCount; iFrame++)
					this.srcOffsets[iFrame] = iFrame * frameSize;
			}
		};

		let calc_vramRef = function(ref={}){
			if(ref.bpp){
				let bppSizeBitshift = ({2:4,4:5,8:6})[ref.bpp] || 0;
				let frameSize = ref.animTiles << bppSizeBitshift;
				let frameCount = ref.frameCount || 0;
				ref.destOffset = ref.dstIndex << bppSizeBitshift;
				ref.frameSize = frameSize;
				ref.srcOffsets = new Uint16Array(frameCount);
				for(let iFrame=0; iFrame<frameCount; iFrame++)
					ref.srcOffsets[iFrame] = iFrame * frameSize;
			}
		};

		let _clone_vramRef = function(){
			return {
				// base props
				bpp            : this.bpp || 0,
				dstIndex       : this.dstIndex || 0,
				animTiles      : this.animTiles || 0,
				frameCount     : this.frameCount || 0,
				relTlstOfst    : this.relTlstOfst || false,
				mapchipProcess : this.mapchipProcess || '',
				// computed props
				destOffset     : this.destOffset || 0,
				frameSize      : this.frameSize || 0,
				srcOffsets     : new Uint16Array(this.srcOffsets || 0),
				// methods
				calc           : _calc_vramRef,
				clone          : _clone_vramRef,
			};
		};


		// code ...

		let mode_00 = {};
		mode_00.elem = document.createElement('div');
		mode_00.elem.style.flexGrow = 1;


		let refSets = null;
		let loadState = 'not loaded';

		let button_loadRefFromMode00 = document.createElement('button');
		button_loadRefFromMode00.textContent = "Load ref : from mode 00";
		button_loadRefFromMode00.style.width = 'fit-content';
		button_loadRefFromMode00.style.height = 'fit-content';

		let button_loadRefFromJson = document.createElement('button');
		button_loadRefFromJson.textContent = "Load ref : from JSON5 file";
		button_loadRefFromJson.style.width = 'fit-content';
		button_loadRefFromJson.style.height = 'fit-content';

		let list_refSets = document.createElement('select');
		list_refSets.style.width = 300;
		list_refSets.style.height = 30;

		mode_00.elem.appendChild(button_loadRefFromMode00);
		mode_00.elem.appendChild(button_loadRefFromJson);
		mode_00.elem.appendChild(list_refSets);

		workspace.elem.appendChild(mode_00.elem);

		button_loadRefFromMode00.onclick = function(){
			lvlRef = lvlRefMode00;
			load_ref();
		};

		button_loadRefFromJson.onclick = function(){

			// get JSON5 file
			let jsonFile = srcFilePanel.rom.fileData?.[1] || [];
			let jsonText = String.fromCharCode(...jsonFile);

			// create object from file
			refSets = JSON5.parse( jsonText );

			// if JSON5 parsing crashes, it does not reach next js instruction
			loadState = 'successful';

			// empty the list
			list_refSets.textContent = '';

			// (re)fill the list and foldableItem
			for(let nameSet in refSets){
				// drop-down list
				let listItem = document.createElement('option');
				listItem.textContent = listItem.value = nameSet;
				list_refSets.appendChild(listItem);

				// foldableItem
				let _set = wLib.create_foldableItem();
				_set.name.setAttribute('value', nameSet);
				foldableItem.append(_set);
				let curSet = refSets[nameSet];
				for(let nameType in curSet){
					let _type = wLib.create_foldableItem();
					_type.name.setAttribute('value', nameType);
					_set.append(_type);
					let curType = curSet[nameType];
					for(let fileRef of curType){
						_file = wLib.create_foldableItem();
						_file.name.setAttribute('value', fileRef.name);
						_file.box.appendChild( create_refDisplayer(fileRef) );
						_type.append(_file);
					}
				}
			}

			// load the first set in the list
			select_listItem();

		};

		list_refSets.onchange = (function(e){
			//console.log(e, this);
			console.log(this.value);
			select_listItem();
		});


		let select_listItem = function(){
			if(list_refSets.value){
				lvlRef = refSets[list_refSets.value] || {};
				load_ref();
			}
		};



		// test foldable item
		/* FoldableItem = wLib.create_foldableItem();
		mode_00.elem.appendChild(FoldableItem.elem);
		FoldableItem2 = wLib.create_foldableItem();
		FoldableItem.box.appendChild(FoldableItem2.elem); */
		let foldableItem = wLib.create_foldableItem();
		foldableItem.name.value = 'All';
		mode_00.elem.appendChild(foldableItem.elem);

		let create_refItem = function(name, type, value){
			let box = document.createElement('div');
			let label = document.createElement('label');
			label.setAttribute('for', name);
			label.textContent = name;
			let item = document.createElement('input');
			item.setAttribute('id', name);
			if(type === 'bool'){
				item.setAttribute('type', 'checkbox');
				item.setAttribute('checked', value);
			}
			if(type === 'number') item.setAttribute('type', 'number');
			if(type === 'text') item.setAttribute('type', 'text');
			item.setAttribute('value', value);
			box.appendChild(label);
			box.appendChild(item);
			return box;
		};

		let create_refDisplayer = function(refObject){

			let ref = refObject;

			let displayer = document.createElement('div');

		//	let name = create_refItem('name','text',ref.name);

			let address = create_refItem('address','number',ref.address);
			let size = create_refItem('size','number',ref.size);
			let compressed = create_refItem('compressed','bool',ref.compressed);
			
			ref = ref.vram || {};

			let bpp = create_refItem('bpp','number',ref.bpp);

			let dstIndex = create_refItem('dstIndex','number',ref.dstIndex);

			let animTiles = create_refItem('animTiles','number',ref.animTiles);
			let frameCount = create_refItem('frameCount','number',ref.frameCount);
			let relTlstOfst = create_refItem('relTlstOfst','bool',ref.relTlstOfst);
			let mapchipProcess = create_refItem('mapchipProcess','text',ref.mapchipProcess);

		//	displayer.appendChild(name);
			displayer.appendChild(address);
			displayer.appendChild(size);
			displayer.appendChild(compressed);
			displayer.appendChild(bpp);
			displayer.appendChild(dstIndex);
			displayer.appendChild(animTiles);
			displayer.appendChild(frameCount);
			displayer.appendChild(relTlstOfst);
			displayer.appendChild(mapchipProcess);

			return displayer;
		};


		// hard reference sets (debug and test)

		let rareware = {
			// H4v0c21 Ref                      address     size     type   compressed
			// rareware_screen_tiles	        0x3A4C3E	0xA83	 GFX	YES	
			// rareware_screen_unknown_1	    0x352FC7	0x294	 GFX	YES	
			// rareware_screen_unknown_2	    0x380D10	0x56	 GFX	YES	
			// rareware_screen_unknown_3	    0x350004	0x143	 GFX	YES	
			// rareware_screen_unknown_4	    0x356AC9	0x14A	 GFX	YES	
			// rareware_screen_tiles_wireframe	0x355D4A	0xD7F	 GFX	YES	
			// rareware_screen_tiles_logo	    0x38063E	0x6D2	 GFX	YES	
			// rareware_screen_unknown_5	    0x19F7CA	0x1B1	 GFX	YES	
			// rareware_screen_nintendo	        0x35325B	0x1561   GFX	YES	
			// rareware_screen_unknown_6	    0x2B2B84	0x31C	 GFX	YES
			
			// Kingizor Ref
			// [Start] [End] [Decompressed Size]
			// Rareware Screen:
			// FA:4C3E ~ FA:56C1 (0x1DC0) - Tiles (?)
			// F5:2FC7 ~ F5:325B (0x0340) - ?
			// F8:0D10 ~ F8:0D66 (0x00C8) - ?
			// F5:0004 ~ F5:0147 (0x0380) - ?
			// F5:6AC9 ~ F5:6C13 (0x0380) - ?
			// F5:5D4A ~ F5:6AC9 (0x2240) - Tiles (Green Wireframe)
			// F8:063E ~ F8:0D10 (0x0EC0) - Tiles (Rareware Logo)
			// D9:F7CA ~ D9:F97B (0x07EE) - ?
			// F5:325B ~ F5:47BC (0x2880) - Tiles (Nintendo Presents & Rareware Logo)
			// EB:2B84 ~ EB:2EA0 (0x04B0) - ?

			tileset : [
				// rareware_screen_tiles	        0x3A4C3E	0xA83	 GFX	YES	
				/* { name:'H4v0c21 rareware_screen_tiles',
					address: 0x3A4C3E, size: 0xA83, compressed: true
				}, */

				// rareware_screen_nintendo	        0x35325B	0x1561   GFX	YES	
				/* { name:'H4v0c21 rareware_screen_nintendo',
					address: 0x35325B, size: 0x1561, compressed: true
				}, */
				// rareware_screen_tiles_logo	    0x38063E	0x6D2	 GFX	YES
				/* { name:'H4v0c21 rareware_screen_tiles_logo',
					address: 0x38063E, size: 0x6D2, compressed: true
				}, */
				// rareware_screen_unknown_6	    0x2B2B84	0x31C	 GFX	YES
				{ name:'H4v0c21 rareware_screen_unknown_6',
					address: 0x2B2B84, size: 0x31C, compressed: true
				},
			],

			// Mine/Intro sparkling reflect
			//
			bgtileset : [

				// rareware_screen_unknown_6	    0x2B2B84	0x31C	 GFX	YES
				{ name:'H4v0c21 rareware_screen_unknown_6',
					address: 0x2B2B84, size: 0x31C, compressed: true,
					vram : {
						bpp : 2
					}
				},

			],
			// Mine:  (kingizor)
			// EB:2B84 ~ EB:2EA0 (0x04B0) - Tiles (BG 3) (Kannon's Klaim, Squawk's Shaft)
			// D9:F7C9 ~ D9:F97B (0x0800) - Tilemap (BG 3) (Kannon's Klaim, Squawk's Shaft)
			background : [
				/* { name:'H4v0c21 rareware_screen_unknown_5',
					address: 0x19F7CA, size: 0x1B1, compressed: true
				}, */
				// D9:F7C9 ~ D9:F97B (0x0800) - Tilemap (BG 3) (Kannon's Klaim, Squawk's Shaft)
				{ name:'H4v0c21 rareware_screen_unknown_5',
					address: 0xD9F7C9-0xc00000, size: 0xD9F97B-0xD9F7C9, compressed: true
				},
			],

		};
		
		
		// mine sparkling
		let flashBG3 = {
			palette : [
				{ name:'Pirate Panic palette',
					address: 0x3D2270, size: 0x100, compressed: false
				}
			],



			// kingizor
				// Intro :
				// EB:2B84 ~ EB:2EA0 (0x04B0) - ?
				// Mine :
				// EB:2B84 ~ EB:2EA0 (0x04B0) - Tiles (BG 3) (Kannon's Klaim, Squawk's Shaft)

			// H4v0c21
				// Intro :
				// rareware_screen_unknown_6	    0x2B2B84	0x31C	 GFX	YES
				// Mine :
				// mine_tiles_bg_3	2B2B84	31C	GFX	YES	
			bgtileset : [
				{ name:'H4v0c21 rareware_screen_unknown_6',
					address: 0x2B2B84, size: 0x31C, compressed: true,
					vram : {
						bpp : 2
					}
				},
			],
			// kingizor
				// Intro : (BAD START BYTE)
				// D9:F7CA ~ D9:F97B (0x07EE) - ?
				// Mine :  
				// D9:F7C9 ~ D9:F97B (0x0800) - Tilemap (BG 3) (Kannon's Klaim, Squawk's Shaft)

			// H4v0c21
				// Intro : (BAD START BYTE)
				// rareware_screen_unknown_5	    0x19F7CA	0x1B1	 GFX	YES
				// Mine :
				// mine_tilemap_bg_3	19F7C9	1B2	MAP	YES	
			background : [				
				{ name:'kingizor Mine Tilemap (BG 3)',
					address: 0xD9F7C9-0xc00000, size: 0xD9F97B-0xD9F7C9, compressed: true
				},
			],
		};


		let wireframelogo = {
			palette : [
				{ name:'Pirate Panic palette',
					address: 0x3D0CD0, size: 0x200, compressed: false
				}
			],
			tileset : [
				{ name:'H4v0c21 rareware_screen_tiles_wireframe',
					address: 0x355D4A, size: 0xD7F, compressed: true
				},
			],
			bgtileset : [
				{ name:'H4v0c21 rareware_screen_tiles_wireframe',
					address: 0x355D4A, size: 0xD7F, compressed: true,
					vram : {
						bpp : 8
					}
				},

			],
			background : [
				{ name:'H4v0c21 rareware_screen_unknown_4',
					// is actually bg mapchip
					// rareware_screen_unknown_4	    0x356AC9	0x14A	 GFX	YES	
					address: 0x356AC9, size: 0x14A, compressed: true
				},
			],
		};


		let shipdeck = {
			// FD:0CD0 - Pirate Panic
			palette : [
				{ name:'Pirate Panic palette',
					address: 0x3D0CD0, size: 0x100, compressed: false
				}
			],
			// DATA_F52BA7	ship_deck_rigging_layer_3_tiledata
			/* tileset : [
				{ name:'ship deck rigging fg',
					address: 0xF52BA7-0xC00000, size: 1024*32*2, compressed: true
				}
			], */
			// ship_deck_tiles_level	1F8116	5421	GFX	YES
			tileset : [
				{ name:'ship deck tileset',
					address: 0x1F8116, size: 0x5421, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0
					}
				}
			],
			// ship_deck_tilemap_8x8	25C627	1AA1	MAP	YES
			mapchip : [
				{ name:'ship deck mapchip',
					address: 0x25C627, size: 0x1AA1, compressed: true
				}
			],
			// DATA_E9FDB3	ship_deck_ocean_layer_2_tiledata
			bgtileset : [
				{ name: 'shipdeck ocean bg tileset',
					address: 0x29FDB3, size: 0x1308, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				}
			],
			// DATA_C7FCB8	ship_deck_ocean_layer_2_8x8_tilemap
			background : [
				{ name:'ship deck mapchip',
					address: 0x7FCB8, size: 0x45C, compressed: true
				}
			],
		};


		// Ship Mast references:
		let shipmast = {
			// FD:14F0 - Topsail Trouble, Kreepy Krow
			// FD:1610 - Mainbrace Mayhem, Krow's Nest
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			palette : [
				/* { name:'webwoods palette',
					address: 0x3D3A4E, size: 0x100, compressed: false
				}, */
				{ name:'Mainbrace Mayhem, Krow\'s Nest palette',
					address: 0x3D1610, size: 0x100, compressed: false
				},
				{ name:'Topsail Trouble, Kreepy Krow palette',
					address: 0x3D14F0, size: 0x100, compressed: false
				},
			],
			// DF:D537 ~ E0:2195 (0x5D20) - Tiles (Level)
			// D0:0000 - C0:0000 = 10:0000 ram? to rom
			tileset : [
				{ name:'ship mast tileset',
					address: 0x1FD537, size: 0x4C5E, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0
					}
				},
			],
			// pirate flag 0x3A5FC1 30tiles*8animframes*32byteOneTile = 0x1E00
			// rain DATA_F36EE8 16tiles*8animframes*32byteOneTile = 0x1000
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			// vram: null, if not set please
			animation : [
				{ name : 'ship mast flag animated tileset',
					address: 0x3A5FC1, size: 0x1E00, compressed: false,
					//vram: {destOffset: 1*32, frameSize: 30*32, frameCount: 8, bpp:4}
					vram: {
						dstIndex: 1,      animTiles: 30,
						destOffset: 1*32, frameSize: 30*32, frameCount: 8, bpp: 4,
						//calc_ref: _calc_vramRef
					}
					// iFile iVRDest tLen fLen
				},
				{ name : 'ship mast rain animated tileset',
					address: 0x336EE8, size: 0x1000, compressed: false,
					//vram: {destOffset: 752*32, frameSize: 16*32, frameCount: 8, bpp:4}
					vram: {
						dstIndex: 752,      animTiles: 16,
						destOffset: 752*32, frameSize: 16*32, frameCount: 8, bpp:4,
						//calc_ref: _calc_vramRef
					}
				}
			],
			// bg rain DATA_F641C1
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			// vram: null, if not set please
			bganimation : [
				{ name : 'ship mast rain animated bg tileset',
					address: 0x3641C1, size: 0x2000, compressed: false,
					//vram: {destOffset: 0*16, frameSize: 64*16, frameCount: 8, bpp:2}
					vram: {
						dstIndex: 0,      animTiles: 64,
						destOffset: 0*16, frameSize: 64*16, frameCount: 8, bpp:2,
						//calc_ref: _calc_vramRef
					}
				},
				// test & debug (4bpp)
				{ name : 'ship mast rain animated bg tileset',
					address: 0x3641C1, size: 0x4000, compressed: false,
					//vram: {destOffset: 0*32, frameSize: 32*32, frameCount: 8, bpp:4}
					vram: {
						dstIndex: 0,      animTiles: 32,
						destOffset: 0*32, frameSize: 32*32, frameCount: 8, bpp:4,
						//calc_ref: _calc_vramRef
					}
				},
			],
			// E5:E0C8 ~ E5:F52D (0x2540) - Tilemap (8x8)
			// E0:0000 - C0:0000 = 20:0000 ram? to rom
			mapchip : [
				{ name:'ship mast mapchip',
					address: 0x25E0C8, size: 0x1465, compressed: true,
				}
			],

			// SKY
			/* // DATA_EA121C	ship_mast_sky_bg_layer_2_tiledata
			bgtileset : [
				{ name:'shipmast/funky sky bg tileset',
					address: 0x2A121C, size: 0x11B8, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				}
			],
			// DATA_CAFABE	ship_mast_sky_bg_layer_2_8x8_tilemap
			background : [
				{ name:'shipmast/funky sky bg mapchip',
					address: 0xAFABE, size: 0x76D, compressed: true,
				}
			], */

			
			// CLOUDS
			//DATA_EA8D3C	ship_mast_clouds_fg_layer_3_tiledata
			bgtileset : [
				{ name:'shipmast clouds fg tileset',
					address: 0x2A8D3C, size: 0x9F2, compressed: true,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			//DATA_D1F971	ship_mast_clouds_fg_layer_3_8x8_tilemap
			background : [
				{ name:'shipmast clouds fg mapchip',
					address: 0x11F971, size: 0x74E, compressed: true,
				}
			],
			

			
		};


		let forest_sunshine = {
			palette : [
				{ name:'webwoods palette',
					address: 0x3D3A4E, size: 0x100, compressed: false
				},
			],
			// FOREST sunshine foreground
			//
			// DATA_EA972E	forest_light_shafts_layer_1_tiledata
			// EA:972E ~ EA:A93D (0x1FC0) - Tiles (FG) (Ghostly Grove)
			bgtileset : [
				{ name:'forest sunshine fg tileset',
					address: 0x2A972E, size: 0x120F, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_D0FE0D	forest_light_shafts_layer_1_8x8_tilemap
			// D0:FE0D ~ D1:016B (0x0700) - Tilemap (FG) (Ghostly Grove)
			background : [
				{ name:'forest sunshine fg mapchip',
					address: 0x10FE0D, size: 0x35E, compressed: true,
				}
			],
		};


		// Trees background
		let forest_bg = {
			palette : [
				{ name:'webwoods palette',
					address: 0x3D3A4E, size: 0x100, compressed: false
				},
			],
			// FOREST bg
			//
			tileset : [
				{ name:'forest bg tileset',
					address: 0x3B6FC0, size: 0x1000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			//FB:6FC0 ~ FB:7FC0 (0x1000) - Tiles (BG) (NOT COMPRESSED)
			// DATA_FB6FC0	forest_bg_layer_3_tiledata
			bgtileset : [
				{ name:'forest bg tileset',
					//address: 0x3B6FC0, size: 0x1000, compressed: false,
					address: 0x3B6FC0, size: 0xFE0, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			// D5:FEB3 ~ D6:03E9 (0x0800) - Tilemap (BG)
			// DATA_D5FEB3	forest_bg_layer_3_8x8_tilemap
			background : [
				{ name:'forest bg mapchip',
					address: 0x15FEB3, size: 0x536, compressed: true,
				}
			],
			
			// forest_tiles_level	1EA932	5F3E	GFX	YES	
			// forest_tilemap_32x32	23438B	2BAE	MAP	YES	
			// forest_tilemap_8x8	2572C5	251C	MAP	YES
		};

		// FLOATING LEAVES
		//
		let forest_leaves = {
			// DATA_FD0610	palette_fgbg_level_gusty_glade
			palette : [
				{ name:'gustyglade palette',
					address: 0x3D0610, size: 0xE0, compressed: false
				},
				{ name:'leaves palette',
					address: 0x3D268E, size: 0x20, compressed: false
				},
			],
			// found out by myself
			tileset : [
				{ name:'leaves fg tileset',
					address: 0x356c13, size: 0x1100, compressed: false,
					vram: {
						bpp: 4,
					},
				},
			],
			// found out by myself
			bganimation : [
				{ name:'leaves fg tileset',
					address: 0x356c13, size: 0x1100, compressed: false,
					vram: {
						dstIndex: 1, animTiles: 17, frameCount: 8,
						bpp: 4,
					},
				},
			],
			// E9:8B07 ~ E9:8C68 (0x0800) - (?) (Gusty Glade) (Leaves?)
			// forest_unknown	    298B07	161	    GFX	YES
			background : [
				{ name:'forest_unknown',
					address: 0x298B07, size: 0x161, compressed: true,
				},
			],
		};


		/* 
		DATA_D4FC2D	wasp_hive_bg_layer_3_8x8_tilemap
		DATA_D8FB53	wasp_hive_honey_layer_1_8x8_tilemap
		DATA_D6F791	wasp_hive_bg_layer_3_tiledata
		DATA_EB2EA0	wasp_hive_honey_layer_1_tiledata
 		*/
		let hive = {
			palette : [
				{ name:'hive palette',
					address: 0xFD0A10-0xC00000, size: 0x100, compressed: false
				}
			],
			tileset : [
				{ name:'wasp_hive_bg_layer_3_tiledata',
					address: 0xD6F791-0xC00000, size: 0xD8FB53-0xD6F791, compressed: true
				}
			],

			// LAYER 3 test

			bgtileset : [
				{ name:'wasp_hive_bg_layer_3_tiledata',
					address: 0xD6F791-0xC00000, size: 0xD8FB53-0xD6F791, compressed: true,
					vram : {
						bpp : 2,
					},
				}
			],

			background : [
				{ name:'wasp_hive_bg_layer_3_8x8_tilemap',
					address: 0xD4FC2D-0xC00000, size: 0xD6F791-0xD4FC2D, compressed: true
				}
			],

			
			// LAYER 1 test

			/* bgtileset : [
				{ name:'junk data 48 tiles',
					address: 0x0, size: 48*32, compressed: false
				},
				{ name:'wasp_hive_honey_layer_1_tiledata',
					address: 0xEB2EA0-0xC00000, size: 1024*32*2, compressed: true
				},
				{ name:'junk tiles (bg rain)',
					address: 0xF641C1-0xC00000, size: 0x2000, compressed: false
				}
			],
			background : [
				{ name:'wasp_hive_honey_layer_1_8x8_tilemap',
					//address: 0xD8FB53-0xC00000, size: 0xEB2EA0-0xD8FB53, compressed: true
					address: 0xD8FB53-0xC00000, size: 2*32*32*2, compressed: true
				}
			], */

		};

		let hive_fg = {
			palette : [
				{ name:'hive palette',
					address: 0xFD0A10-0xC00000, size: 0x100, compressed: false
				}
			],
			tileset : [
				{ name:'wasp_hive_honey_layer_1_tiledata',
					address: 0xEB2EA0-0xC00000, size: 1024*32*2, compressed: true
				}
			],

			// LAYER 1 test

			bgtileset : [
				{ name:'wasp_hive_honey_layer_1_tiledata',
					address: 0x2B2EA0, size: 1024*32*2, compressed: true,
					vram : {
						bpp : 4, dstIndex : 48
					},
				},
			],
			background : [
				{ name:'wasp_hive_honey_layer_1_8x8_tilemap',
					//address: 0xD8FB53-0xC00000, size: 0xEB2EA0-0xD8FB53, compressed: true
					address: 0x18FB53, size: 2*32*32*2, compressed: true
				}
			],

		};

		let hive_bg = {
			palette : [
				{ name:'hive palette',
					address: 0xFD0A10-0xC00000, size: 0x100, compressed: false
				}
			],
			tileset : [
				{ name:'wasp_hive_bg_layer_3_tiledata',
					address: 0xD6F791-0xC00000, size: 0xD8FB53-0xD6F791, compressed: true,
				}
			],

			// LAYER 3 test

			bgtileset : [
				{ name:'wasp_hive_bg_layer_3_tiledata',
					address: 0xD6F791-0xC00000, size: 0xEA2, compressed: true,
					vram : {
						bpp : 2,
					},
				}
			],

			background : [
				{ name:'wasp_hive_bg_layer_3_8x8_tilemap',
					address: 0xD4FC2D-0xC00000, size: 0x63E, compressed: true
				}
			],

		};

		// DATA_EAA94D	brambles_sky_bg_layer_3_tiledata
		// DATA_DDFDBA	brambles_sky_bg_layer_3_8x8_tilemap
		// DATA_EAB6F0	brambles_bg_layer_2_tiledata
		// DATA_F80000	brambles_bg_layer_2_8x8_tilemap
		let brambles_sky = {
			//DATA_FD28EE	palette_fgbg_level_bramble_blast
			palette : [
				{ name:'palette_fgbg_level_bramble_blast',
					address: 0xFD28EE-0xC00000, size: 0x100, compressed: false
				}
			],
			tileset : [
				{ name:'brambles_sky_bg_layer_3_tiledata',
					address: 0xEAA94D-0xC00000, size: 1024*64, compressed: true,
				}
			],

			// LAYER 3 test

			bgtileset : [
				{ name:'brambles_sky_bg_layer_3_tiledata',
					address: 0x2AA94D, size: 0xDA3, compressed: true,
					vram : {
						bpp : 2, dstIndex : 273
					},
				},
			],
			background : [
				{ name:'brambles_sky_bg_layer_3_8x8_tilemap',
					address: 0x1DFDBA, size: 0x59C, compressed: true
				},
			],

		};

		let debugPaletteClass = {
			palette : [
				{ name:'Pirate Panic palette',
					address: 0x3D0CD0, size: 0x100, compressed: false
				},
				/* { name:'Mainbrace Mayhem, Krow\'s Nest palette',
					address: 0x3D1610, size: 0x100, compressed: false
				},
				{ name:'Topsail Trouble, Kreepy Krow palette',
					address: 0x3D14F0, size: 0x100, compressed: false
				}, */
			],
		};

		let H4v0c21_$35FA80 = {
			
			palette : [
				{
					name: 'funky flights palette',
					address: 0x3D10F0, size: 0x100, compressed: false,
				},
			],
			tileset : [
				{
					name: '$35FA80 tileset',
					address: 0x35FA80, size: 0x8000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			bganimation : [
				{
					name: '$35FA80 tileset',
					address: 0x35FA80, size: 5*16 *16, compressed: false,
					vram: {
						dstIndex: 0, animTiles: 1, frameCount: 64, bpp:2,
					},
				},
			],
			background : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x0, size: 0x0, compressed: false,
					mapchipProcess: '8x8',
				},
			],
			// format=8x8 0 16 frame=64
		};

		// DATA_F30EBB    mine_debris_layer_3_tiledata
		// DATA_ED8415    mine_debris_layer_3_8x8_tilemap
		let mine_debris = {
			palette : [
				{
					// DATA_FD248E	palette_fgbg_level_windy_well
					name: 'no name',
					address: 0x3D248E, size: 0x100, compressed: false,
				},
			],
			tileset : [
				{
					name: '$35FA80 tileset',
					address: 0x330EBB, size: 0x880, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			bganimation : [
				{
					name: '$35FA80 tileset',
					address: 0x330EBB, size: 0x880, compressed: false,
					vram: {
						dstIndex: 1, animTiles: 17, frameCount: 8,
						bpp: 2,
					},
				},
			],
			background : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x2D8415, size: 0x16F, compressed: true,
				},
			],
		};

		// castle_tiles_level	29A905	3432	GFX	YES	(3D BG)       (lvl tileset part 2)
		// castle_tiles_bg	    2B4916	25D	    GFX	YES	(floor tiles) (bg layer 3 castle crush floor moving up)

		// castle_tilemap_8x8	268077	1475	MAP	YES	
		// castle_tilemap_32x32	24F714	2F37	MAP	YES	

		// castle_tilemap_bg_1	02FAC9	61A	    MAP	YES	              (bg layer 2 left side)
		// castle_tilemap_bg_2	06FC11	477	    MAP	YES               (bg layer 2 right side)

		// castle_tiles_1	    2199BE	2580	GFX	NO	              (lvl tileset part 1)
		// castle_tiles_2	    21BF3E	37BF	GFX	NO               (lvl tileset part 3)

		// castle_crush_palette	3D2DEE	100	    PAL	NO




		let castle_lvl = {
			palette : [
				{
					name: 'noname',
					address: 0x3D2DEE, size: 0x100, compressed: false,
				},
			],
			tileset : [
				{
					name: 'part1',
					address: 0x2199BE, size: 0x2580, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
				{
					name: 'part2',
					address: 0x29A905, size: 0x3432, compressed: true, offset: 0x2580, extract: 0x22C0,
					vram: {
						bpp: 4, dstIndex: 0,
						// start 9568+32, end 9568+32+8896=18464
						//dkc2ldd.interface.srcFilePanel.tileset.decompressed[1] = dkc2ldd.interface.srcFilePanel.tileset.decompressed[1].slice(9568+32, 18464+32)
						// part 1 : address: 0x2199BE, size: 0x2580, compressed: false
						// part 2 : address: 0x29A905, size: 0x4000(enough to decompress), compressed: true (then extract : from 0x2580 to 0x4840-1 (0x4840 is excluded))
						// part 3 : address: 0x21BF3E, size: 0x37BF, compressed: false 

					},
				},
				{
					name: 'part3',
					address: 0x21BF3E, size: 0x37C0, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
				{
					name: 'part4',
					address: 0x2B4916, size: 0x25D, compressed: true,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: 'part5',
					address: 0x21C21E, size: 0x220, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			animation : [
				{
					name: 'animated flame tiles',
					address: 0x35484A, size: 0x1500, compressed: false,
					vram: {
						bpp: 4, dstIndex: 1, animTiles: 28, frameCount: 6,
					},
				},
			],

			mapchip : [
				{
					name: 'castle lvl mapchip',
					address: 0x268077, size: 0x1475, compressed: true,
				},
			],
			tilemap : [
				{
					name: 'castle lvl tilemap',
					address: 0x24F714, size: 0x2F37, compressed: true,
				},
			],

			background : [
				{
					name: 'castle 3Dfloor leftside bg mapchip',
					address: 0x02FAC9, size: 0x61A, compressed: true,
				},
				{
					name: 'castle 3Dfloor rightside bg mapchip',
					address: 0x06FC11, size: 0x477, compressed: true,
				},
			],
		};castle_lvl.bgtileset = castle_lvl.tileset;


		let castle_movingUpFloor = {
			palette : [
				{
					name: 'noname',
					address: 0x3D2DEE, size: 0x100, compressed: false,
				},
			],
			bgtileset : [
				{
					name: 'noname',
					address: 0x2B4916, size: 0x25D, compressed: true,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			background : [
				{
					name: 'noname',
					address: 0x29A745, size: 0x1C0, compressed: false,
				},
			],
		};


		let castle_bg = {
			palette : [
				{
					name: 'noname',
					address: 0x3D2DEE, size: 0x100, compressed: false,
				},
			],
			// 0x2D57EF
			bgtileset : [
				{
					name: 'alphabet gfx set',
					address: 0x2D57EF, size: 7*16*16, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: 'alphabet gfx set',
					address: 0x2D57EF, size: 7*16*16, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: 'alphabet gfx set + any data',
					address: 0x2D57EF, size: 0x8000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			background : [
				{
					name: 'noname',
					address: 0x02FAC9, size: 0x4000, compressed: true,
				},
				{
					name: 'noname',
					address: 0x06FC11, size: 0x4000, compressed: true,
				},
			],

		}; castle_bg.tileset = castle_bg.bgtileset;

		let castle_bg2 = {
			palette : [
				{
					name: 'noname',
					address: 0x3D2DEE, size: 0x100, compressed: false,
				},
			],
			// 0x2D57EF
			bgtileset : [
				{
					name: 'any data',
					address: 0x0, size: 0x2580>>1, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: 'alphabet gfx set',
					address: 0x2D57EF, size: 7*16*16, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: 'alphabet gfx set',
					address: 0x2D57EF, size: 7*16*16, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: 'alphabet gfx set + any data',
					address: 0x2D57EF, size: 0x8000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			background : [
				{
					name: 'noname',
					address: 0x02FAC9, size: 0x4000, compressed: true,
				},
				{
					name: 'noname',
					address: 0x06FC11, size: 0x4000, compressed: true,
				},
			],

		}; castle_bg2.tileset = castle_bg2.bgtileset;

		//1F8116  tiledata
		//25C627  tilemap
		//3D0CD0  palette
		//DATA_F52BA7	ship_deck_rigging_layer_3_tiledata
		let H4v0c21_test = {
			
			palette : [
				{
					name: 'funky flights palette',
					address: 0x3D0CD0, size: 0x100, compressed: false,
				},
			],
			tileset : [
				{
					name: '$35FA80 tileset',
					address: 0x352BA7, size: 0x1000, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: '$35FA80 tileset',
					address: 0x352BA7, size: 0x1000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			background : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x352087, size: 0x8000, compressed: true,
				},
			],
			mapchip : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x25C627, size: 0x8000, compressed: true,
				},
			],
			tilemap : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x1F8116, size: 0x8000, compressed: true,
				},
			],
			// format=8x8 0 16 frame=64
		};


		// 352087 8x8
		// 3526A7 32x32
		// 352BA7 tiledata
		// 3D0CD0 palette
		let H4v0c21_test_rigging = {
			
			palette : [
				{
					name: 'funky flights palette',
					address: 0x3D0CD0, size: 0x1000, compressed: false,
				},
			],
			tileset : [
				{
					name: '$35FA80 tileset',
					address: 0x352BA7, size: 0x13E0, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
				{
					name: '$35FA80 tileset',
					address: 0x352BA7, size: 0x10000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: '$35FA80 tileset',
					address: 0x352BA7, size: 0x1000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			background : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x352087, size: 0x4000, compressed: false,
				},
			],
			mapchip : [
				{
					name: '$35FA80 procedural mapchip',
					address:  0x352087, size: 0x100000, compressed: false,
				},
			],
			tilemap : [
				{
					name: '$35FA80 procedural mapchip',
					address:0x3526A7, size: 0x1000, compressed: false,
				},
			],
			// format=8x8 0 16 frame=64
		};
		let _2199BE = {
			
			palette : [
				{
					name: 'funky flights palette',
					address: 0x3D0CD0, size: 0x100, compressed: false,
				},
			],
			tileset : [
				{
					name: '$35FA80 tileset',
					address: 0x2199BE, size: 0x21BF3E-0x2199BE, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: '$35FA80 tileset',
					address: 0x352BA7, size: 0x1000, compressed: false,
					vram: {
						bpp: 2, dstIndex: 0,
					},
				},
			],
			background : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x25C627, size: 0x8000, compressed: true,
				},
			],
			mapchip : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x25C627, size: 0x8000, compressed: true,
				},
			],
			tilemap : [
				{
					name: '$35FA80 procedural mapchip',
					address: 0x1F8116, size: 0x8000, compressed: true,
				},
			],
			// format=8x8 0 16 frame=64
		};

		let test_mode_1 = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D0CD0, size: 0x1000, compressed: false,
				},
			],
			tileset : [
				{
					name: 'A tileset',
					address: 0x352BA7, size: 0x1000, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
				{
					name: 'B tileset',
					address: 0x353BA7, size: 0x1000, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],

		};

		let test_selectFile123 = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED7429	file_select_save_file_1_tilemap (size : 0xA)
			// DATA_ED7433	file_select_save_file_2_tilemap (size : 0xA)
			// DATA_ED743D	file_select_save_file_3_tilemap (size : 0xA)
			background : [
				{
					name: 'background tilemap ?',
					//address: 0x2D742B, size: 0xA, compressed: false,
					address: 0x2D7435, size: 0xA, compressed: false,
					//address: 0x2D743F, size: 0xA, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};

		let test_selectFileLanguage = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED744D	file_select_language_1_tilemap
			// DATA_ED748B	file_select_language_2_tilemap
			// DATA_ED74C9	file_select_language_3_tilemap
			background : [
				{
					name: 'background tilemap ?',
					//address: 0x2D744F, size: 0x3E, compressed: false,
					//address: 0x2D748D, size: 0x3E, compressed: false,
					address: 0x2D74CB, size: 0x3E, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D744D, size: 0x3E, compressed: false,
				},
			],
		};


		
		let test_selectFileSelgameCopyeraseSave = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED7507	file_select_select_game_tilemap
			// DATA_ED7569	file_select_copy_erase_tilemap
			// DATA_ED7607	file_select_save_game_tilemap
			background : [
				{
					name: 'background tilemap ?',
					//address: 0x2D7507+2, size: 0x62, compressed: false,
					//address: 0x2D7569+2, size: 0x9E, compressed: false,
					address: 0x2D7607, size: 0x30, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};

		let test_selectFileOneplayerTeamContest = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED763F	file_select_1_player_tilemap
			// DATA_ED7687	file_select_2_player_team_tilemap
			// DATA_ED76CF	file_select_2_player_contest_tilemap
			background : [
				{
					name: 'background tilemap ?',
					//address: 0x2D763F, size: 0x48, compressed: false,
					//address: 0x2D7687+2, size: 0x48, compressed: false,
					address: 0x2D76CF+2, size: 0x48, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};
		let test_selectFileEmpty = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED7717	file_select_file_empty_tilemap
			background : [
				{
					name: 'background tilemap ?',
					address: 0x2D7717+2, size: 0x124, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};
		let test_selectFileNumchars = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED7855	file_select_char_tilemap
			// DATA_ED7859	file_select_char_tilemap
			// DATA_ED785D	file_select_char_tilemap
			// DATA_ED7861	file_select_char_tilemap
			// DATA_ED7865	file_select_char_tilemap
			// DATA_ED7869	file_select_char_tilemap
			// DATA_ED786D	file_select_char_tilemap
			// DATA_ED7871	file_select_char_tilemap
			// DATA_ED7875	file_select_char_tilemap
			// DATA_ED7879	file_select_char_tilemap
			// DATA_ED787D	file_select_char_tilemap
			// DATA_ED7881	file_select_char_tilemap
			// DATA_ED7885	file_select_char_tilemap
			background : [
				{
					name: 'background tilemap ?',
					address: 0x2D7855, size: 12 *2*2, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};
		let test_selectFilePercentchar = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED7889	file_select_percentage_tilemap
			background : [
				{
					name: 'background tilemap ?',
					address: 0x2D7889+2, size: 0xA, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};
		let test_selectFileMonoStereo = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_ED5E3F	file_select_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2D5E3F, size: 0x2300, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_ED7897	file_select_mono_tilemap
			// DATA_ED78B5	file_select_stereo_tilemap
			background : [
				{
					name: 'background tilemap ?',
					//address: 0x2D7897, size: 0x1E, compressed: false,
					address: 0x2D78B5+2, size: 0x1E, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};
		let test_selectFileCoins = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_FB0000	file_select_dk_coin_tiledata    (size:0x400)
			// DATA_FB0400	file_select_krem_coin_tiledata  (size:0x400)
			tileset : [
				{
					name: 'tileset',
					address: 0x3B0000, size: 0x800, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x3B0000, size: 0x800, compressed: false,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			
			background : [
				{
					name: 'background tilemap ?',
					address: 0x3B0000, size: 0x1E, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};

		let test_selectFileChoseGameStyle = {
			
			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_EC4D40	game_select_tiledata zip 0x4600
			tileset : [
				{
					name: 'tileset',
					address: 0x2C4D40, size: 0x4600, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2C4D40, size: 0x4600, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_EC4749

			// DATA_EC4AAD
			// DATA_EC4C1C
			// DATA_EC4D40
			// DATA_EC7CF0
			// DATA_EC83A0
			// DATA_FC0660
			background : [
				{
					name: 'background tilemap ?',
					address: 0x2C4749, size: 0x4000, compressed: false,
					//address: 0x2C4AAD, size: 0x4000, compressed: false,
					//address: 0x2C4C1C, size: 0x4000, compressed: false,

					//address: 0x2C4D40, size: 0x4000, compressed: false,
					//address: 0x2C7CF0, size: 0x4000, compressed: false,
					//address: 0x2C83A0, size: 0x4000, compressed: false,
					//address: 0x3C0660, size: 0x4000, compressed: false,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2C4749, size: 0x4000, compressed: false,
					//address: 0x2C4AAD, size: 0x4000, compressed: false,
					//address: 0x2C4C1C, size: 0x4000, compressed: false,

					//address: 0x2C4D40, size: 0x4000, compressed: false,
					//address: 0x2C7CF0, size: 0x4000, compressed: false,
					//address: 0x2C83A0, size: 0x4000, compressed: false,
					//address: 0x3C0660, size: 0x4000, compressed: false,
				},
			],
		};

		let test_selectFileBG = {
			

			palette : [
				{
					name: 'palette',
					address: 0x3D3C6E, size: 0x200, compressed: false,
				},
			],
			// DATA_EC83A0	file_select_bg_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x2C83A0, size: 0x8000, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x2C83A0, size: 0x8000, compressed: true,
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_EC7CF0	file_select_bg_tilemap
			background : [
				{
					name: 'background tilemap ?',
					address: 0x2C7CF0, size: 0x8000, compressed: true,
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};
		let test_selectFileSecretEnding = {
			
			// DATA_FD420E	secret_ending_screen_palette
			// DATA_F99400	secret_ending_screen_layer_2_tiles
			// DATA_F9C775	secret_ending_screen_layer_2_tilemap
			// DATA_F661C1	secret_ending_screen_layer_1_tiles
			// DATA_F67D1B	secret_ending_screen_layer_1_tilemap
			palette : [
				{
					name: 'palette',
					address: 0x3D420E, size: 0x200, compressed: false,
				},
			],
			// DATA_EC83A0	file_select_bg_tiledata
			tileset : [
				{
					name: 'tileset',
					address: 0x3661C1, size: 0xF000, compressed: true, // layer 1
					//address: 0x399400, size: 0xF000, compressed: true, // layer 2
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			bgtileset : [
				{
					name: 'tileset',
					address: 0x3661C1, size: 0xF000, compressed: true, // layer 1
					//address: 0x399400, size: 0xF000, compressed: true, // layer 2
					vram: {
						bpp: 4, dstIndex: 0,
					},
				},
			],
			// DATA_EC7CF0	file_select_bg_tilemap
			background : [
				{
					name: 'background tilemap ?',
					address: 0x367D1B, size: 0xF000, compressed: true, // layer 1
					//address: 0x39C775, size: 0xF000, compressed: true, // layer 2
				},
			],
			mapchip : [
				{
					name: 'background tilemap ?',
					address: 0x2D7429, size: 0xA, compressed: false,
				},
			],
		};

		

		let ROM = srcFilePanel.rom.fileData[0];
		//let lvlRef = rareware;
		//let lvlRef = wireframelogo;
		let lvlRef = flashBG3;
		//let lvlRef = shipdeck;
		//let lvlRef = shipmast;
		//let lvlRef = hive_fg;
		//let lvlRef = hive_bg;
		//let lvlRef = brambles_sky;
		//let lvlRef = forest_bg;
		//let lvlRef = forest_leaves;
		//let lvlRef = forest_sunshine;
		//let lvlRef = debugPaletteClass;
		//let lvlRef = H4v0c21_$35FA80;
		//let lvlRef = H4v0c21_test;
		//let lvlRef = H4v0c21_test_rigging;
		//let lvlRef = mine_debris;
		//let lvlRef = castle_lvl;
		//let lvlRef = castle_bg;
		//let lvlRef = castle_bg2;
		//let lvlRef = castle_movingUpFloor;
		//let lvlRef = _2199BE;
		//let lvlRef = test_mode_1;
		//let lvlRef = test_selectFile123;
		//let lvlRef = test_selectFileLanguage;
		//let lvlRef = test_selectFileSelgameCopyeraseSave;
		//let lvlRef = test_selectFileOneplayerTeamContest;
		//let lvlRef = test_selectFileEmpty;
		//let lvlRef = test_selectFileNumchars;
		//let lvlRef = test_selectFilePercentchar;
		//let lvlRef = test_selectFileMonoStereo;
		//let lvlRef = test_selectFileCoins;
		//let lvlRef = test_selectFileChoseGameStyle;
		//let lvlRef = test_selectFileBG;
		//let lvlRef = test_selectFileSecretEnding;

		let lvlRefMode00 = lvlRef;

		// app to srcFile Panel

		let load_ref = function(){
			for(let dataType in lvlRef){
	
				let dataRefs = lvlRef[dataType];
	
				let len = dataRefs.length;
				let last, ref, name, address, size, compressed, offset, extract, data, romRef, vramRef, dataFile, slot;
				for(let i=0; i<len; i++){
					last = (i === len-1);
	
					ref = dataRefs[i];
					name = ref.name;
					address = ref.address;
					size = ref.size;
					compressed = ref.compressed;
					offset = ref.offset;
					extract = ref.extract;
					data = ROM.slice(address, address+size);
	
					romRef = {address, size, offset, extract};
					vramRef = ref.vram || {unset:true};
					vramRef.calc = _calc_vramRef;
					vramRef.clone = _clone_vramRef;
					
					if(vramRef.unset){
						vramRef.clone(); // set default val
					}else{
						vramRef.calc();
					}

					dataFile = {name:name, data:data, useDec:compressed, romRef:romRef, vramRef:vramRef};
					slot = srcFilePanel[dataType];
					slot.set_oneDataFile(dataFile, last);
	
					// special cases (in test) :
					if(ref.mapchipProcess === '8x8') slot.parameters.value = 'format=8x8';

					// todo : to move in an update method (build all from srcFilePanel once everything is loaded)
					// TEST FEATURE : animated data type : parameters input update
					if(vramRef){
						let obj = {d:vramRef.destOffset, t:vramRef.frameSize, f:vramRef.frameCount};
						slot.parameters.value += JSON.stringify(obj) + (last ? '' : ', ');
					}
					if(vramRef === null){ // important nullish type
						slot.parameters.value += 'null' + (last ? '' : ', ');
					}
					// END TEST FEATURE
				}
	
			}
		};


		


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


		// demo patch
			o.start_demo = function(demo_id){

				if(demo_id === 'shipmast anim'){
					lvlRefMode00 = lvlRef = shipmast;
					load_ref();
				}

				if(demo_id === 'bg rain anim'){
					lvlRefMode00 = lvlRef = shipmast;
					load_ref();
				}

				if(demo_id === 'forest leaves'){
					lvlRefMode00 = lvlRef = forest_leaves;
					load_ref();
				}

				if(demo_id === 'mine debris'){
					lvlRefMode00 = lvlRef = mine_debris;
					load_ref();
				}

				if(demo_id === 'castle level'){
					lvlRefMode00 = lvlRef = castle_lvl;
					load_ref();
				}

				if(demo_id === 'mine sparkling'){
					lvlRefMode00 = lvlRef = flashBG3;
					load_ref();
				}

				if(demo_id === 'unknown H4v0c21_$35FA80'){
					lvlRefMode00 = lvlRef = H4v0c21_$35FA80;
					load_ref();
				}
			};
		// end of demo
	};

})();
