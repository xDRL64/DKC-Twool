
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 14 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;
		let wLib2 = app.WorkspaceToolPack;

		let Elem = wLib2.CreateElem;
		let flags = Elem.flags;
		for(let key in flags)
			eval(`if(!${key}) var ${key} = ${flags[key]}`);

		let hex = app.lib.get_hex2str;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		let mode_14 = Elem('div', {w:'100%', h:'100%'});

		// code ...
		let lvlIndexNames = get_lvlIndexNames();
		let levelIndexCount = 256;
		let _levelIndex = 0;
		let levelIndexList = wLib2.DropList('level index : \t');
			for(let i=0; i<levelIndexCount; i++)
				levelIndexList.generate_item(`${hex(i,'0x')} : ${lvlIndexNames[i]||'?'}`, i);
			Elem.Set(levelIndexList.elem, { margin:'8 0',_min:0, _max:4, _value:0});
			levelIndexList.elem.children[0].setAttribute('selected', true);
			levelIndexList.elem.style.fontFamily = 'monospace';
		let displayArea = Elem('div');

		// rom file (as byte array)
		let ROM = srcFilePanel.rom.fileData[0];

		// level settings refs
		let lvlSettingsListBank = 0x3D;
		let lvlSettingsListPointer = 0x0000;
		let levelSettingsListAddress = (lvlSettingsListBank<<16) + lvlSettingsListPointer;

		let get_lvlSettingsAddress = function(lvlIndex){        // multiply by 2
			let lvlSettingsOffset = levelSettingsListAddress + (lvlIndex << 1); 
			let lvlSettingsAddressLowByte   = ROM[lvlSettingsOffset];
			let lvlSettingsAddressHightByte = ROM[lvlSettingsOffset + 1];
			return levelSettingsListAddress + (lvlSettingsAddressHightByte<<8) + lvlSettingsAddressLowByte;
		};




		let make_lvlSettingsDisplay = function(lvlIndex){
			
			let make_valueDisplayer = function(value, label, width){
				let w = width || 48;
				let mrg = 4;
				let labelElem = Elem('span', {bgCol:'transparent', wtsPre, margin:'0 '+mrg, txtCnt:label});
				let valueElem = Elem('span', {bgCol:'white', disBlk, margin:mrg, txtCnt:value});
				let elem = Elem('span', {bgCol:'transparent', bxszbb, disInb, w, margin:mrg});
				elem.style.border = '1px solid';
				elem.appendChild(labelElem);
				elem.appendChild(valueElem);
				elem.style.minWidth = 'fit-content';
				return elem;
			};

			let displayElem = Elem('div', {bgCol:'lightgrey', padding:8});
			displayElem.style.fontFamily = 'monospace';
			let add_toDisplay = function(value, label, width){
				let valTxtElem = make_valueDisplayer(value, label, width);
				displayElem.appendChild( valTxtElem );
			};
			let addNewLine_toDisplay = function(lineTxt){
				let newLine = Elem('div', {wtsPre, txtCnt:lineTxt});
				displayElem.appendChild( newLine );
			};


			let highByte, lowByte, binWord, correctVal;

			let lvlSettingsAddress = get_lvlSettingsAddress(lvlIndex);

			// level settings
			addNewLine_toDisplay(`\n\n[ Level Settings 0x${hex(lvlIndex)} ] : `);

			// level settings address
			add_toDisplay( hex(lvlSettingsListBank)+':'+hex(lvlSettingsAddress&0xFFFF), 'Address : ' );

			addNewLine_toDisplay('\nMain Level Settings Header : ');

			// room type (1 byte)
			let roomType = ROM[lvlSettingsAddress];
			add_toDisplay( hex(roomType), 'Room Type : ' );

			// unknown (1 byte)
			let unknown_header_byte = ROM[lvlSettingsAddress + 1];
			add_toDisplay( hex(unknown_header_byte), 'Unknown Byte : ' );

			// bonus room type (1 byte, optional)
			let bonusRoomTypeOffset = (ROM[lvlSettingsAddress]===0x1 ? 1 : 0);
			let bonusRoomType = ROM[lvlSettingsAddress + 2];
			let bonusRoomTypeValTxt = bonusRoomTypeOffset ? hex(bonusRoomType) : 'none';
			add_toDisplay( bonusRoomTypeValTxt, 'Bonus Type : ' );

			// ISD pointer (2 bytes)
			let ISD_pointerAddress = lvlSettingsAddress + 2 + bonusRoomTypeOffset
			lowByte = ROM[ISD_pointerAddress];
			highByte = ROM[ISD_pointerAddress+1];
			binWord = (highByte<<8) + lowByte;
			let ISD_pointer = binWord;
			//let ISD_pointer = ROM[ISD_pointerAddress] + (ROM[ISD_pointerAddress+1]<<8);
			add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `ISD Pointer 0x${hex(binWord)} : ` );

			// room index (1 byte)
			let roomIndex = ROM[lvlSettingsAddress + 4 + bonusRoomTypeOffset];
			add_toDisplay( hex(roomIndex), 'Room Index : ' );
			
			// params (6 bytes)
			addNewLine_toDisplay('\nLevel Parameters List : ');
			let lvlSettingsParamListAdress = lvlSettingsAddress + 5 + bonusRoomTypeOffset;
			for(let i=0; i<6; i++){
				let paramValue = ROM[lvlSettingsParamListAdress + i];
				add_toDisplay( hex(paramValue), 'Param '+i+' : ' );
			}

			// spawn point list (5 bytes by spawn point)
			// minimum spawn point : 1 (5 bytes)
			// 0xFF list terminate (1 byte)
			addNewLine_toDisplay('\nLevel Spawn Point List :');
			let lvlSettingsSpawnPointListAddress = lvlSettingsAddress + 11 + bonusRoomTypeOffset;
			let spawnPointMax = 32;
			let spawnPointCount = 0;
			for(let i=0; i<spawnPointMax; i++){
				let spawnPointOffset = i * 5;
				let spawnPointAddress = lvlSettingsSpawnPointListAddress + spawnPointOffset;
				// spawn point index
				addNewLine_toDisplay('\nSpawn Point Index '+i+' :');

				// spawn point # flags (1 byte)
				let spawnPointFlags = ROM[spawnPointAddress];
				//add_toDisplay( hex(spawnPointFlags), 'spawn point #'+i+' flags' );
				if(spawnPointFlags === 0xFF){
					// spawn point list end
					add_toDisplay( hex(spawnPointFlags), 'Spawn Point List End : ' );
					break;
				}
				add_toDisplay( hex(spawnPointFlags), 'Flags' );

				// spawn point # X (+ 256) pixel position (2 bytes)
				lowByte = ROM[spawnPointAddress + 1];
				highByte = ROM[spawnPointAddress + 2];
				binWord = (highByte<<8) + lowByte;
				correctVal = binWord-0x100;
				//add_toDisplay( `rom[${hex(lowByte)}, ${hex(highByte)}] val(${correctVal} ; 0x${hex(correctVal&0xFFFF)})`, 'spawn point #'+i+' X pix pos :      ' );
				add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `X Pix Pos ${correctVal} ; 0x${hex(correctVal&0xFFFF)} : `, 224 );

				// spawn point # Y (+ 256) pixel position (2 bytes)
				lowByte = ROM[spawnPointAddress + 3];
				highByte = ROM[spawnPointAddress + 4];
				binWord = (highByte<<8) + lowByte;
				correctVal = binWord-0x100;
				//add_toDisplay( `rom[${hex(lowByte)}, ${hex(highByte)}] val(${correctVal} ; 0x${hex(correctVal&0xFFFF)})`, 'spawn point #'+i+' Y pix pos :      ' );
				add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Y Pix Pos ${correctVal} ; 0x${hex(correctVal&0xFFFF)} : `, 224 );
			//	addNewLine_toDisplay();

				spawnPointCount++;
			}

			// level index of destination level List (2 bytes by destination level index)
			// 0xFFFF list terminate (2 bytes)
			addNewLine_toDisplay('\nLevel Index of Destination Level List : ');
			let lvlSettingsDestinationListAddress = lvlSettingsAddress + 11 + (spawnPointCount*5)+1 + bonusRoomTypeOffset;
			let destinationMax = 8;
			let destinationCount = 0;
			for(let i=0; i<destinationMax; i++){
				let destinationOffset = i * 2;
				let destinationAddress = lvlSettingsDestinationListAddress + destinationOffset;
				// destination index
				addNewLine_toDisplay('\nDestination Index '+i+' : ');
				// destination level index
				lowByte = ROM[destinationAddress];
				highByte = ROM[destinationAddress + 1];
				binWord = (highByte<<8) + lowByte;
				if(binWord === 0xFFFF){
					// destionation list end
					add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, 'Destination List End : ' );
					break;
				}
				add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Level Index 0x${hex(lowByte)} : ${lvlIndexNames[lowByte]||'?'}`, 512 );

				destinationCount++;
			}

			// level index of worldmap connection list (2 blank bytes of start + 4 bytes for each connection)
			// 0xFFFF list terminate (2 bytes)
			addNewLine_toDisplay('\nLevel Index of Worldmap Connection List : ');
			let lvlSettingsWorldmapConnectionListAddress = lvlSettingsAddress + 11 + (spawnPointCount*5)+1 + (destinationCount*2)+2 + bonusRoomTypeOffset;

			// worldmap connection list start (blank : 00 00) (2 bytes)
			lowByte = ROM[lvlSettingsWorldmapConnectionListAddress];
			highByte = ROM[lvlSettingsWorldmapConnectionListAddress + 1];
			binWord = (highByte<<8) + lowByte;
			add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, 'Worldmap Connection List Start : ' );

			// worldmap connection list
			lvlSettingsWorldmapConnectionListAddress += 2;
			let worldmapConnectionMax = 32;
			let worldmapConnectionCount = 0;
			for(let i=0; i<worldmapConnectionMax; i++){
				let worldmapConnectionOffset = i * 4;
				let worldmapConnectionAddress = lvlSettingsWorldmapConnectionListAddress + worldmapConnectionOffset;
				// worldmap connection index
				addNewLine_toDisplay('\nWorldmap Connection Index '+i+' : ');

				// level index START
				lowByte = ROM[worldmapConnectionAddress];
				highByte = ROM[worldmapConnectionAddress + 1];
				binWord = (highByte<<8) + lowByte;
				if(binWord === 0xFFFF){
					// worldmap connection list end
					add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, 'Worldmap Connection List End : ' );
					break;
				}
				add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Level Index of START 0x${hex(lowByte)} : ${lvlIndexNames[lowByte]||'?'}`, 512 );

				// level index END
				lowByte = ROM[worldmapConnectionAddress + 2];
				highByte = ROM[worldmapConnectionAddress + 3];
				binWord = (highByte<<8) + lowByte;
				add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Level Index of END 0x${hex(lowByte)} : ${lvlIndexNames[lowByte]||'?'}`, 512 );

				worldmapConnectionCount++;
			}

			// //////////////////////////////////////////////////////////////////////////

			// level ISD settings
			addNewLine_toDisplay(`\n\n[ Level ISD Settings 0x${hex(ISD_pointer)} ] : `);

			// level ISD settings address
			add_toDisplay( hex(lvlSettingsListBank)+':'+hex(ISD_pointer), 'Address : ' );

			let ISD_settingsAddress = (lvlSettingsListBank<<16) + ISD_pointer;
			let ISD_readAddress = ISD_settingsAddress;
			let MACRO_add_wordToDisplay = function(labelTxt, labelLowOnly){
				lowByte = ROM[ISD_readAddress];
				highByte = ROM[ISD_readAddress + 1];
				binWord = (highByte<<8) + lowByte;
				let lowstr = hex(lowByte), highstr = hex(highByte);
				let wordstr = labelLowOnly ? lowstr : highstr+lowstr;
				add_toDisplay( `[${lowstr}, ${highstr}]`, `${labelTxt} 0x${wordstr} : ` );
				ISD_readAddress += 2;
			};

			// special effect palette (2 bytes)
			MACRO_add_wordToDisplay('Special Effect Palette', false);

			// effect (2 bytes)
			MACRO_add_wordToDisplay('Effect', false);

			// music index (2 bytes)
			MACRO_add_wordToDisplay('Music Index', true);

			// specific palette pointer (2 bytes)
			MACRO_add_wordToDisplay('Specific Palette Pointer', false);

			// pointer 1 (2 bytes)
			MACRO_add_wordToDisplay('Pointer 1', false);

			// pointer 2 (2 bytes)
			MACRO_add_wordToDisplay('Pointer 2', false);

			// PPU render method index (1 byte)
			let PPU_renderMethodIndex = ROM[ISD_readAddress];
			add_toDisplay( hex(PPU_renderMethodIndex), 'PPU Render Method Index : ' );

			ISD_readAddress++;

			// payloads index (1 byte)
			let payloadsIndex = ROM[ISD_readAddress];
			add_toDisplay( hex(payloadsIndex), 'Payloads Index : ' );

			ISD_readAddress++;

			// update screen
			MACRO_add_wordToDisplay('Update Screen', false);

			// scrolling terrain
			MACRO_add_wordToDisplay('Scrolling Terrain', false);

			// theme index (1 byte)
			let themeIndex = ROM[ISD_readAddress];
			add_toDisplay( hex(themeIndex), 'Theme Index : ' );

			ISD_readAddress++;

			// theme index (1 byte)
			let whatView = ROM[ISD_readAddress];
			add_toDisplay( hex(whatView), 'What View : ' );

			ISD_readAddress++;

			// special attributes (8 bits)
			/* let specialAttributeNames = {
				0x01:'Enable Hot Air Balloons',
				0x02:'Enable Bambles',
				0x04:'Unsused ?',
				0x08:'Enable Honey',
				0x10:'Enable Ice',
				0x20:'Slippy Surfaces',
				0x40:'Enable Tracks',
				0x80:'Enable Wind',
			}; */
			let specialAttributeNames = {
				0x01:'Enable Hot Air Balloons ',
				0x02:'Enable Bambles          ',
				0x04:'Unsused ?               ',
				0x08:'Enable Honey            ',
				0x10:'Enable Ice              ',
				0x20:'Slippy Surfaces         ',
				0x40:'Enable Tracks           ',
				0x80:'Enable Wind             ',
			};
			let specialAttributes = ROM[ISD_readAddress];
			add_toDisplay( hex(specialAttributes), 'Special Attributes : ' );
			for(let i=0x01; i<0x100; i=i<<1){
				addNewLine_toDisplay(`Bit Flag 0x${hex(i)} : ${specialAttributeNames[i]} [${(specialAttributes&i?'true':'false')}]`);
			}

			ISD_readAddress++;


			return displayElem;
		};


		mode_14.appendChild(levelIndexList.elem);
		mode_14.appendChild(displayArea);
		workspace.elem.appendChild(mode_14);


		levelIndexList.elem.onchange = function(){
			_levelIndex = this.value;
			displayArea.innerHTML = '';
			displayArea.appendChild( make_lvlSettingsDisplay(parseInt(_levelIndex)) );
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



		// level index names
		function get_lvlIndexNames(){
			return {
				0x00 : "Web Woods (Unused)",
				0x01 : "Glimmer's Galleon",
				0x02 : "Rambi Rumble",
				0x03 : "Pirate Panic",
				0x04 : "Gangplank Galley",
				0x05 : "Rattle Battle",
				0x06 : "Glimmer's Galleon - Exit Room",
				0x07 : "Hot-Head Hop",
				0x08 : "Red-Hot Ride",
				0x09 : "Krow's Nest",
				0x0A : "Slime Climb",
				0x0B : "Topsail Trouble",
				0x0C : "Mainbrace Mayhem",
				0x0D : "Kreepy Krow",
				0x0E : "Target Terror",
				0x0F : "Rickety Race",
				0x10 : "Haunted Hall",
				0x11 : "Hornet Hole",
				0x12 : "Rambi Rumble - Rambi Room",
				0x13 : "Parrot Chute Panic",
				0x14 : "Lava Lagoon",
				0x15 : "Lockjaw's Locker",
				0x16 : "Fiery Furnace",
				0x17 : "Web Woods",
				0x18 : "Gusty Glade",
				0x19 : "Ghostly Grove",
				0x1A : "Topsail Trouble - Warp Room",
				0x1B : "Pirate Panic - K.Rool's Cabin",
				0x1C : "Hot-Head Hop - Bonus 2",
				0x1D : "Pirate Panic - Warp Room",
				0x1E : "Target Terror - Exit Room",
				0x1F : "Web Woods Room (Unused)",
				0x20 : "Mainbrace Mayhem - Warp Room",
				0x21 : "Kleever's Kiln",
				0x22 : "Rattle Battle - Rattly Room",
				0x23 : "Windy Well",
				0x24 : "Sqwawks Shaft",
				0x25 : "Kannon's Klaim",
				0x26 : "Parrot Chute Panic - Warp Room",
				0x27 : "Kannon's Klaim - Warp Room",
				0x28 : "Barrel Bayou",
				0x29 : "Krochead Klamber",
				0x2A : "Web Woods - Squitter Room",
				0x2B : "Barrel Bayou - Warp Room",
				0x2C : "Mudhole Marsh",
				0x2D : "Bramble Blast",
				0x2E : "Bramble Scramble",
				0x2F : "Screech's Sprint",
				0x60 : "King Zing Sting",
				0x61 : "K.Rool Duel",
				0x62 : "Castle Crush",
				0x63 : "Kudgel's Kontest",
				0x68 : "Lockjaw's Locker - Warp Room",
				0x69 : "Lava Lagoon - Warp Room",
				0x6A : "Squawk's Shaft - Warp Room",
				0x6B : "Krocodile Kore",
				0x6C : "Arctic Abyss",
				0x6D : "Chain Link Chamber",
				0x6E : "Toxic Tower",
				0x6F : "Pirate Panic - Bonus 1",
				0x70 : "Pirate Panic - Bonus 2",
				0x71 : "Gangplank Galley - Bonus 2",
				0x72 : "Rattle Battle - Bonus 1",
				0x73 : "Rattle Battle - Bonus 3",
				0x74 : "Hot-Head Hop - Bonus 3",
				0x75 : "Hot-Head Hop - Bonus 1",
				0x76 : "Red-Hot Ride - Bonus 1",
				0x77 : "Red-Hot Ride - Bonus 2",
				0x78 : "Mainbrace Mayhem - Bonus 1",
				0x79 : "Mainbrace Mayhem - Bonus 2",
				0x7A : "Slime Climb - Bonus 1",
				0x7B : "Topsail Trouble - Bonus 1",
				0x7C : "Topsail Trouble - Bonus 2",
				0x7D : "Mainbrace Mayhem - Bonus 3",
				0x7E : "Slime Climb - Bonus 2",
				0x7F : "Rattle Battle - Bonus 2",
				0x80 : "Klobber Karnage",
				0x81 : "Lockjaw's Locker - Bonus 1",
				0x82 : "Glimmer's Galleon - Bonus 2",
				0x83 : "Lava Lagoon - Bonus 1",
				0x84 : "Glimmer Galleon - Bonus 1",
				0x85 : "Ghostly Grove - Bonus 1",
				0x86 : "Gusty Glade - Bonus 1",
				0x87 : "Gusty Glade - Bonus 2",
				0x88 : "Ghostly Grove Bonus 2",
				0x89 : "Barrel Bayou - Bonus 1",
				0x8A : "Barrel Bayou - Bonus 2",
				0x8B : "Krochead Klamber - Bonus 1",
				0x8C : "Mudhole Marsh - Bonus 1",
				0x8D : "Mudhole Marsh - Bonus 2",
				0x8E : "Hot-Head Hop - Warp Room",
				0x8F : "Clapper's Cavern",
				0x90 : "Animal Antics - Enguarde Section",
				0x91 : "Clapper's Cavern - Bonus 1",
				0x92 : "Clapper's Cavern - Bonus 2",
				0x93 : "Arctic Abyss - Bonus 1",
				0x94 : "Black Ice Battle - Bonus 1",
				0x95 : "Arctic Abyss - Bonus 2",
				0x96 : "Black Ice Battle",
				0x97 : "Klobber Karnage - Bonus 1",
				0x98 : "Jungle Jinx - Bonus 1",
				0x99 : "Jungle Jinx",
				0x9A : "Animal Antics - Rambi Section",
				0x9B : "Animal Antics - Squitter Section",
				0x9C : "Animal Antics - Rattly Section",
				0x9D : "Animal Antics - Bonus 1",
				0x9E : "Fiery Furnace - Bonus 1",
				0x9F : "Animal Antics - Squawks Section",
				0xA0 : "Bramble Blast - Bonus 2",
				0xA1 : "Target Terror - Bonus 1",
				0xA2 : "Bramble Scramble - Bonus 1",
				0xA3 : "Windy Well - Bonus 2",
				0xA4 : "Web Woods - Bonus 1",
				0xA5 : "Toxic Tower - Bonus 1",
				0xA6 : "Bramble Blast - Bonus 1",
				0xA7 : "Screech's Sprint - Bonus 1",
				0xA8 : "Gangplank Galley - Bonus 1",
				0xA9 : "Squawk's Shaft - Bonus 3",
				0xAA : "Kannon's Klaim - Bonus 3",
				0xAB : "Kannon's Klaim - Bonus 1",
				0xAC : "Squawk's Shaft - Bonus 1",
				0xAD : "Kannon's Klaim - Bonus 2",
				0xAE : "Hornet Hole - Bonus 1",
				0xAF : "Parrot Chute Panic - Bonus 2",
				0xB0 : "Hornet Hole - Bonus 3",
				0xB1 : "Parrot Chute Panic - Bonus 1",
				0xB2 : "Rambi Rumble - Bonus 2",
				0xB3 : "Hornet Hole - Bonus 2",
				0xB4 : "Rambi rumble - Bonus 1",
				0xB5 : "Chain Link Chamber - Bonus 1",
				0xB6 : "Chain Link Chamber - Bonus 2",
				0xB7 : "Castle Crush - Bonus 1",
				0xB8 : "Castle Crush - Bonus 2",
				0xB9 : "Stronghold Showdown",
				0xBA : "Squawk's Shaft - Bonus 2",
				0xBC : "Web Woods - Bonus 2",
				0xBB : "Windy Well - Bonus 1",
				0xBD : "Haunted Hall - Bonus 1",
				0xBE : "Rickety Race - Exit",
				0xBF : "Haunted Hall - Exit",
				0xC0 : "Haunted Hall Bonus 3",
				0xC1 : "Target Terror - Bonus 2",
				0xC2 : "Haunted Hall - Bonus 2",
				0xC3 : "Rickety Race - Bonus 1",
			};
		}
	};

})();
