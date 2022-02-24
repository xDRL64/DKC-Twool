
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

		// code ...


		let shipdeck = {
			// FD:0CD0 - Pirate Panic
			palette : [
				{ name:'Pirate Panic palette',
					address: 0x3D0CD0, size: 0x100, compressed: false
				}
			],
			// DATA_F52BA7	ship_deck_rigging_layer_3_tiledata
			tileset : [
				{ name:'ship deck rigging fg',
					address: 0xF52BA7-0xC00000, size: 1024*32*2, compressed: true
				}
			],
		};


		// Ship Mast references:
		let shipmast = {
			// FD:14F0 - Topsail Trouble, Kreepy Krow
			// FD:1610 - Mainbrace Mayhem, Krow's Nest
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			palette : [
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
					address: 0x1FD537, size: 0x5D20, compressed: true
				}
			],
			// pirate flag 0x3A5FC1 30tiles*8animframes*32byteOneTile = 0x1E00
			// rain DATA_F36EE8 16tiles*8animframes*32byteOneTile = 0x1000
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			// vram: null, if not set please
			animation : [
				{ name : 'ship mast flag animated tileset',
					address: 0x3A5FC1, size: 0x1E00, compressed: false,
					vram: {destIndex: 1, tileCount: 30, frameCount: 8}
					// iFile iVRDest tLen fLen
				},
				{ name : 'ship mast rain animated tileset',
					address: 0x336EE8, size: 0x1000, compressed: false,
					vram: {destIndex: 752, tileCount:16, frameCount: 8}
				}
			],
			// bg rain DATA_F641C1
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			// vram: null, if not set please
			bganimation : [
				{ name : 'ship mast rain animated bg tileset',
					address: 0x3641C1, size: 0x4000, compressed: false,
					vram: {destIndex: 0, tileCount:64/2, frameCount: 8, bpp:2}
				},
				// test & debug
				{ name : 'ship mast rain animated bg tileset',
					address: 0x3641C1, size: 0x4000, compressed: false,
					vram: {destIndex: 0, tileCount:64/2, frameCount: 8, bpp:4}
				},
			],
			// E5:E0C8 ~ E5:F52D (0x2540) - Tilemap (8x8)
			// E0:0000 - C0:0000 = 20:0000 ram? to rom
			mapchip : [
				{ name:'ship mast mapchip',
					address: 0x25E0C8, size: 0x2540, compressed: true
				}
			]
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
					address: 0xD6F791-0xC00000, size: 0xD8FB53-0xD6F791, compressed: true
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

		let debugPaletteClass = {
			palette : [
				{ name:'Pirate Panic palette',
					address: 0x3D0CD0, size: 0x408, compressed: false
				},
				/* { name:'Mainbrace Mayhem, Krow\'s Nest palette',
					address: 0x3D1610, size: 0x100, compressed: false
				},
				{ name:'Topsail Trouble, Kreepy Krow palette',
					address: 0x3D14F0, size: 0x100, compressed: false
				}, */
			],
		};




		let ROM = srcFilePanel.rom.fileData[0];
		//let lvlRef = shipmast;
		//let lvlRef = hive;
		//let lvlRef = shipdeck;
		let lvlRef = debugPaletteClass;


		// app to srcFile Panel


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
				
				dataFile = {name:name, data:data, useDec:compressed, romRef:romRef, vramRef:vramRef};
				slot = srcFilePanel[dataType];
				slot.set_oneDataFile(dataFile, last);

				// todo : to move in an update method (build all from srcFilePanel once everything is loaded)
				// TEST FEATURE : animated data type : parameters input update
				if(vramRef){
					let obj = {d:vramRef.destIndex, t:vramRef.tileCount, f:vramRef.frameCount};
					slot.parameters.value += JSON.stringify(obj) + (last ? '' : ', ');
				}
				if(vramRef === null){ // important nullish type
					slot.parameters.value += 'null' + (last ? '' : ', ');
				}
				// END TEST FEATURE
			}

		}


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
