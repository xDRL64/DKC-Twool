
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 'ROM' ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "rom";

		// current workspace object
		let o = {};

		let _calc_vramRef = function(){
			let bpp = this.bpp;
			if(bpp===2 || bpp===4 || bpp===8){
				bpp = ({2:16,4:32,8:64})[bpp]; // bppSize
				this.destOffset = this.dstIndex * bpp;
				this.frameSize = this.animTiles * bpp;
			}
		};
		let calc_vramRef = function(ref){
			if(ref.bpp){
				let bppSizeBitshift = ({2:4,4:5,8:6})[ref.bpp];
				ref.destOffset = ref.dstIndex << bppSizeBitshift;
				ref.frameSize = ref.animTiles << bppSizeBitshift;
			}
		};

		// code ...

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

		workspace.elem.appendChild(button_loadRefFromMode00);
		workspace.elem.appendChild(button_loadRefFromJson);
		workspace.elem.appendChild(list_refSets);

		button_loadRefFromMode00.onclick = function(){
			lvlRef = lvlRefMode00;
			load_ref();
		};

		button_loadRefFromJson.onclick = function(){

			// get JSON5 file
			let jsonFile = srcFilePanel.rom.fileData?.[1] || [];
			let jsonText = String.fromCharCode(...jsonFile);

			// create object from file
			refSets = JSON5.parse( jsonText
				/* ,
				// add _calc_vramRef method while JSON parsing
				(function(k,v){ // each calc_ref propety with 'true' value, is set to the _calc_vramRef js object 
					if(k==='calc_ref' && v===true) return _calc_vramRef;
					else return v;
				}) */
			);

			// if JSON5 parsing crashes, it does not reach next js instruction
			loadState = 'successful';

			// empty the list
			list_refSets.textContent = '';

			// (re)fill the list
			for(nameSet in refSets){
				let listItem = document.createElement('option');
				listItem.textContent = listItem.value = nameSet;
				list_refSets.appendChild(listItem);
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
		
		
		let flashBG3 = {
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
						bpp: 4, tileOfst: 0
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
						bpp: 4, tileOfst: 0,
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
						bpp: 4, tileOfst: 0
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
						bpp: 4, tileOfst: 0,
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
						bpp: 2, tileOfst: 0,
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
						bpp: 4, tileOfst: 0,
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
						bpp: 2, tileOfst: 0,
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
						bpp: 2, tileOfst: 0,
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
			palette : [
				{ name:'webwoods palette',
					address: 0x3D3A4E, size: 0xE0, compressed: false
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
						bpp : 4, tileOfst : 48
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
						bpp : 2, tileOfst : 273
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
						bpp: 2, tileOfst: 0,
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


		let ROM = srcFilePanel.rom.fileData[0];
		//let lvlRef = rareware;
		//let lvlRef = wireframelogo;
		//let lvlRef = flashBG3;
		//let lvlRef = shipdeck;
		//let lvlRef = shipmast;
		//let lvlRef = hive_fg;
		//let lvlRef = hive_bg;
		//let lvlRef = brambles_sky;
		//let lvlRef = forest_bg;
		let lvlRef = forest_leaves;
		//let lvlRef = forest_sunshine;
		//let lvlRef = debugPaletteClass;
		//let lvlRef = H4v0c21_$35FA80;

		let lvlRefMode00 = lvlRef;

		// app to srcFile Panel

		let load_ref = function(){
			for(let dataType in lvlRef){
	
				let dataRefs = lvlRef[dataType];
	
				let len = dataRefs.length;
				let last, ref, name, address, size, compressed, data, romRef, vramRef, dataFile, slot;
				for(let i=0; i<len; i++){
					last = (i === len-1);
	
					ref = dataRefs[i];
					name = ref.name;
					address = ref.address;
					size = ref.size;
					compressed = ref.compressed;
					data = ROM.slice(address, address+size);
	
					romRef = {address:address, size:size};
					vramRef = ref.vram;
					if(vramRef) calc_vramRef(vramRef);
					
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

				if(demo_id === 'unknown H4v0c21_$35FA80'){
					lvlRefMode00 = lvlRef = H4v0c21_$35FA80;
					load_ref();
				}
			};
		// end of demo
	};

})();
