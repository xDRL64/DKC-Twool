
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
		let lvlTypeNames = get_levelTypeNames();
		let bonusTypeNames = get_bonusTypeNames();
		let ISD_names = get_ISD_names();
		let PPU_registerRefs = get_PPU_registerRefs();
		let themeNames = get_themeNames();
		let coordinateSystemNames = get_coordinateSystemNames();
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

		// ppu render method refs
		let PPU_renderMethodListBank = 0x3D;
		let PPU_renderMethodListPointer = 0x79E2;
		let PPU_renderMethodListAddress = (PPU_renderMethodListBank<<16) + PPU_renderMethodListPointer;
		let get_PPU_renderMethodAddress = function(methodIndex){        // multiply by 2
			let PPU_renderMethodOffset = PPU_renderMethodListAddress + (methodIndex << 1);
			let PPU_renderMethodLowByte = ROM[PPU_renderMethodOffset];
			let PPU_renderMethodHighByte = ROM[PPU_renderMethodOffset + 1];
			return PPU_renderMethodListAddress + (PPU_renderMethodHighByte<<8) + PPU_renderMethodLowByte;
		};
		
		// payloads
		let payloadsListBank = 0x3D;
		let payloadsListPointer = 0x819A;
		let payloadsListAddress = (payloadsListBank<<16) + payloadsListPointer;
		let get_payloadsAddress = function(payloadsIndex){ // multiply by 2
			let payloadsOffset = payloadsListAddress + (payloadsIndex << 1);
			let payloadsLowByte = ROM[payloadsOffset];
			let payloadsHighByte = ROM[payloadsOffset + 1];
			return payloadsListAddress + (payloadsHighByte<<8) + payloadsLowByte;
		};
		
		// theme settings
		let themeSettingsBank = 0x35;
		let themeSettingsRefs = {
			tilemapList               : {pointer:0xBAEF, itemSize:3, name:'tilemapAddress'},
			mapchipList               : {pointer:0xBB2E, itemSize:3, name:'mapchipAddress'},
			vramAddressList           : {pointer:0xBB6D, itemSize:2, name:'vramAddress'},
			collisionMapchipList      : {pointer:0xBB97, itemSize:3, name:'collisionMapchipAddress'},
			collisionMapchipSizeList  : {pointer:0xBBD6, itemSize:2, name:'collisionMapchipSize'},
			scrollControlList         : {pointer:0xBC00, itemSize:2, name:'scrollControl'},
			defaultPaletteList        : {pointer:0xBC2A, itemSize:2, name:'defaultPalettePointer'},
			tilemapTypeList           : {pointer:0xBC54, itemSize:2, name:'tilemapType'},
			roomDimensionSettingsList : {pointer:0xBC7E, itemSize:2, name:'roomDimensionSettingsPointer'},
		};
		let get_themeSettings = function(themeIndex){
			let o = {};
			for(let listName in themeSettingsRefs){
				let listItem = themeSettingsRefs[listName];
				let itemSize = listItem.itemSize;
				let address = (themeSettingsBank<<16) + listItem.pointer;
				let offset = address + (themeIndex*itemSize);
				let lowByte = ROM[offset];
				let highByte = ROM[offset + 1];
				let bankByte = (itemSize===3 ? ROM[offset + 2] : null);
				o[listItem.name] = {lowByte, highByte, bankByte};
			}
			return o;
		};

		// room dimension settings
		let roomDimSettingsBank = 0x35;
		let get_roomDinSettingsAddress = function(roomDimensionSettingsPointer){
			return (roomDimSettingsBank<<16) + roomDimensionSettingsPointer;
		};

		let make_lvlSettingsDisplay = function(lvlIndex){
			
			let make_valueDisplayer = function(value, label, width){
				let w = width || 48;
				let mrg = 4;
				let labelElem = Elem('span', {bgCol:'transparent', disBlk, wtsPre, margin:'0 '+mrg, txtCnt:label});
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


			let bankByte, highByte, lowByte, binWord, correctVal;

			let make_mainLevelSettings = function(){

				let lvlSettingsAddress = get_lvlSettingsAddress(lvlIndex);
	
				// level settings
				addNewLine_toDisplay(`\n\n[ Level Settings 0x${hex(lvlIndex)} ] : `);
	
				// level settings address
				add_toDisplay( hex(lvlSettingsListBank)+':'+hex(lvlSettingsAddress&0xFFFF), 'Address : ' );
	
				addNewLine_toDisplay('\nMain Level Settings Header : ');
	
				// room type (1 byte)
				let roomType = ROM[lvlSettingsAddress];
				add_toDisplay( hex(roomType), `Room Type [0x${hex(roomType)} : ${lvlTypeNames[roomType]}] : ` );
	
				// unknown (1 byte)
				let unknown_header_byte = ROM[lvlSettingsAddress + 1];
				add_toDisplay( hex(unknown_header_byte), 'Unknown Byte : ' );
	
				// bonus room type (1 byte, optional)
				let bonusRoomTypeOffset = (ROM[lvlSettingsAddress]===0x1 ? 1 : 0);
				let bonusRoomType = ROM[lvlSettingsAddress + 2];
				let bonusRoomTypeValTxt = bonusRoomTypeOffset ? hex(bonusRoomType) : 'none';
				let bonusRoomTypeLabelTxt = bonusRoomTypeOffset ? `0x${hex(bonusRoomType)} : ${bonusTypeNames[bonusRoomType]}` : 'Not Bonus Room'
				add_toDisplay( bonusRoomTypeValTxt, `Bonus Type [${bonusRoomTypeLabelTxt}] : ` );
	
				// ISD pointer (2 bytes)
				let ISD_pointerAddress = lvlSettingsAddress + 2 + bonusRoomTypeOffset
				lowByte = ROM[ISD_pointerAddress];
				highByte = ROM[ISD_pointerAddress+1];
				binWord = (highByte<<8) + lowByte;
				let ISD_pointer = binWord;
				//let ISD_pointer = ROM[ISD_pointerAddress] + (ROM[ISD_pointerAddress+1]<<8);
				add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `ISD Pointer 0x${hex(binWord)} [${ISD_names[binWord]||'?'}] : ` );
	
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
					add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Level Index 0x${hex(lowByte)} [${lvlIndexNames[lowByte]||'?'}] : `, 512 );
	
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
					add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Level Index of START 0x${hex(lowByte)} [${lvlIndexNames[lowByte]||'?'}] : `, 512 );
	
					// level index END
					lowByte = ROM[worldmapConnectionAddress + 2];
					highByte = ROM[worldmapConnectionAddress + 3];
					binWord = (highByte<<8) + lowByte;
					add_toDisplay( `[${hex(lowByte)}, ${hex(highByte)}]`, `Level Index of END 0x${hex(lowByte)} [${lvlIndexNames[lowByte]||'?'}] : `, 512 );
	
					worldmapConnectionCount++;
				}

				// export end step : output data
				return {ISD_pointer, roomIndex};

			};


			let make_ISD_settings = function(){

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
					//return binWord;
				};

				// level ISD settings
				addNewLine_toDisplay(`\n\n[ Level ISD Settings 0x${hex(ISD_pointer)} : ${ISD_names[ISD_pointer]||'?'} ] : `);
	
				// level ISD settings address
				add_toDisplay( hex(lvlSettingsListBank)+':'+hex(ISD_pointer), 'Address : ' );
	
				// special effect palette (2 bytes)
				MACRO_add_wordToDisplay('Special Effect Palette', false);
				let specialEffectPalette = binWord;
	
				// effect (2 bytes)
				MACRO_add_wordToDisplay('Effect', false);
				let effect = binWord;
	
				// music index (2 bytes)
				MACRO_add_wordToDisplay('Music Index', true);
				let musicIndex = binWord;
	
				// specific palette pointer (2 bytes)
				MACRO_add_wordToDisplay('Specific Palette Pointer', false);
				let specificPalettePointer = binWord;
	
				// pointer 1 (2 bytes)
				MACRO_add_wordToDisplay('Pointer 1', false);
				let pointer_1 = binWord;
	
				// pointer 2 (2 bytes)
				MACRO_add_wordToDisplay('Pointer 2', false);
				let pointer_2 = binWord;
	
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
				let updateScreen = binWord;
	
				// scrolling terrain
				MACRO_add_wordToDisplay('Scrolling Terrain', false);
				let scrollingTerrain = binWord;
	
				// theme index (1 byte)
				let themeIndex = ROM[ISD_readAddress];
				add_toDisplay( hex(themeIndex), 'Theme Index : ' );
				ISD_readAddress++;
	
				// what view (1 byte)
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

				// export end step : output data
				return {PPU_renderMethodIndex, payloadsIndex, themeIndex};

			};


			let make_PPU_renderMethod = function(){

				let PPU_renderMethodAddress = get_PPU_renderMethodAddress(PPU_renderMethodIndex);

				// PPU render method list
				/*
				addNewLine_toDisplay('\n\nPPU Render Method List : ');
				add_toDisplay( hex(PPU_renderMethodListBank)+':'+hex(PPU_renderMethodListPointer), 'Address : ' );
				*/

				// PPU render method instruction list
				addNewLine_toDisplay(`\n\n[ PPU Render Method 0x${hex(PPU_renderMethodIndex)} Instruction List ] : `);

				// PPU render method instruction list address
				add_toDisplay( hex(PPU_renderMethodListBank)+':'+hex(PPU_renderMethodAddress&0xFFFF), 'Address : ' );

				let instructionMax = 256;
				let valueByteCount = 0;
				let instructionAddress;
				let PPU_registerWrongRef = {name:'?',description:'---'}
				for(let i=0; i<instructionMax; i++){

					instructionAddress = PPU_renderMethodAddress + (i*2) + valueByteCount;

					lowByte = ROM[instructionAddress];
					highByte = ROM[instructionAddress + 1];
					binWord = (highByte<<8) + lowByte;
					let lowstr = hex(lowByte), highstr = hex(highByte);
					let wordstr = highstr + lowstr;

					addNewLine_toDisplay(`\nInstruction Index ${i} : `);

					let instructionRomBytesStr = `${lowstr}, ${highstr}`;
					if(binWord === 0x0000){
						// instruction list end
						add_toDisplay(`[${instructionRomBytesStr}]`, 'Instruction List End : ');
						break;
					}

					// instruction (any case : byte or word)
					let instructionStr = wordstr;
					let PPU_registers = [null, {name:'',description:''}];
					let PPU_registersStr = ['','[$----=0x--]']
					let valueRomByteStr = '';
					lowByte = ROM[instructionAddress + 2];
					lowstr = hex(lowByte);

					if(highByte & 0x80){
						// instruction word value case :
						highByte = ROM[instructionAddress + 3];
						highstr = hex(highByte);
						let PPU_register = binWord&0x7FFF;
						PPU_registers[0] = PPU_registerRefs[PPU_register] || PPU_registerWrongRef;
						PPU_registers[1] = PPU_registerRefs[PPU_register + 1] || PPU_registerWrongRef;
						PPU_registersStr[0] = `[$${hex(PPU_register)}=0x${lowstr}]`;
						PPU_registersStr[1] = `[$${hex(PPU_register+1)}=0x${highstr}]`;
						valueRomByteStr = `${lowstr}, ${highstr}`
						valueByteCount += 2;
					}else{
						// instruction byte value case :
						PPU_registers[0] = PPU_registerRefs[binWord] || PPU_registerWrongRef;
						PPU_registersStr[0] = `[$${hex(binWord)}=0x${lowstr}]`;
						valueRomByteStr = lowstr;
						valueByteCount++;
					}

					let registersInfoTxt = `\n[${PPU_registers[0].name}] : ${PPU_registers[0].description}` +
					                       `\n[${PPU_registers[1].name}] : ${PPU_registers[1].description}` ;
					add_toDisplay(`[${instructionRomBytesStr}, ${valueRomByteStr}]`, `PPU Registers ${PPU_registersStr[0]} ${PPU_registersStr[1]} : ${registersInfoTxt}`, 512);

				}
			};

			let make_payloads = function(){

				let payloadsAddress = get_payloadsAddress(payloadsIndex);

				// payloads data ref list
				addNewLine_toDisplay(`\n\n[ Payloads Data Reference 0x${hex(payloadsIndex)} List ] : `);

				// payloads data ref list address
				add_toDisplay( hex(payloadsListBank)+':'+hex(payloadsAddress&0xFFFF), 'Address : ' );

				let payloadsMax = 32;
				let payloadSize = /*address*/3 + /*vramAddr|zipFlag*/2 + /*size*/2;
				let payloadAddress;
				for(let i=0; i<payloadsMax; i++){

					payloadAddress = payloadsAddress + (i*payloadSize);

					addNewLine_toDisplay(`\nPayload Data Ref Index ${i} (0x${hex(payloadAddress)}) : `);

					bankByte = ROM[payloadAddress];
					let bankstr = hex(bankByte);

					if(bankByte === 0x00){
						// payloads data ref list end
						add_toDisplay(`${hex(bankByte)}`, 'Payloads Data Ref List End : ');
						break;
					}

					// source data address
					lowByte = ROM[payloadAddress + 1];
					highByte = ROM[payloadAddress + 2];
					binWord = (highByte<<8) + lowByte;
					let lowstr = hex(lowByte), highstr = hex(highByte);
					let wordstr = highstr + lowstr;
					add_toDisplay(`[${bankstr}, ${lowstr}, ${highstr}]`, `Data Address [${bankstr}:${wordstr}] : `);

					// destination vram address and compressed flag
					lowByte = ROM[payloadAddress + 3];
					highByte = ROM[payloadAddress + 4];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					let compressed = (highByte&0x80 ? 'compressed' : 'uncompressed');
					add_toDisplay(`[${lowstr}, ${highstr}]`, `VRAM Address [0x${hex(highByte&0x7F)+lowstr} | ${compressed}] : `, 288);

					// data size
					lowByte = ROM[payloadAddress + 5];
					highByte = ROM[payloadAddress + 6];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					wordstr = highstr + lowstr;
					add_toDisplay(`[${lowstr}, ${highstr}]`, `Data Size 0x${wordstr} : `);

				}

			};

			let make_themeSettings = function(){

				let themeSettings = get_themeSettings(themeIndex);

				// theme settings
				addNewLine_toDisplay(`\n\n[ Level Theme Settings 0x${hex(themeIndex)} : ${themeNames[themeIndex]} ] : `);

				let lowstr, highstr, bankstr, romBankstr;

				// tilemap address
				addNewLine_toDisplay(`\nTilemap List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.tilemapList.pointer)}`);
				({lowByte, highByte, bankByte} = themeSettings.tilemapAddress);
				lowstr=hex(lowByte); highstr=hex(highByte); bankstr=hex(bankByte), romBankstr=hex(bankByte&0x3F);
				add_toDisplay(`[${lowstr}, ${highstr}, ${bankstr}]`, `Tilemap Address [${romBankstr}:${highstr}${lowstr}] : `, 384);

				// mapchip address
				addNewLine_toDisplay(`\nMapchip List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.mapchipList.pointer)}`);
				({lowByte, highByte, bankByte} = themeSettings.mapchipAddress);
				lowstr=hex(lowByte); highstr=hex(highByte); bankstr=hex(bankByte), romBankstr=hex(bankByte&0x3F);
				add_toDisplay(`[${lowstr}, ${highstr}, ${bankstr}]`, `Mapchip Address [${romBankstr}:${highstr}${lowstr}] : `, 384);
				
				// vram address
				addNewLine_toDisplay(`\nVRAM Address List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.vramAddressList.pointer)}`);
				({lowByte, highByte} = themeSettings.vramAddress);
				lowstr=hex(lowByte); highstr=hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`,`VRAM Address [${highstr}${lowstr}] : `, 384);
				
				// collision mapchip address
				addNewLine_toDisplay(`\nCollision Mapchip List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.collisionMapchipList.pointer)}`);
				({lowByte, highByte, bankByte} = themeSettings.collisionMapchipAddress);
				lowstr=hex(lowByte); highstr=hex(highByte); bankstr=hex(bankByte), romBankstr=hex(bankByte&0x3F);
				add_toDisplay(`[${lowstr}, ${highstr}, ${bankstr}]`,`Collision Mapchip Address [${romBankstr}:${highstr}${lowstr}] : `, 384);
				
				// collision mapchip size
				addNewLine_toDisplay(`\ncollision Mapchip Size List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.collisionMapchipSizeList.pointer)}`);
				({lowByte, highByte} = themeSettings.collisionMapchipSize);
				lowstr=hex(lowByte); highstr=hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`,`Collision Mapchip Size [${highstr}${lowstr}] : `, 384);
				
				// scroll control
				addNewLine_toDisplay(`\nScroll Control List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.scrollControlList.pointer)}`);
				({lowByte, highByte} = themeSettings.scrollControl);
				lowstr=hex(lowByte); highstr=hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`,`Scroll Control [${highstr}${lowstr}] : `, 384);
				
				// defaultPalettePointer
				addNewLine_toDisplay(`\nDefault Palette Pointer List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.defaultPaletteList.pointer)}`);
				({lowByte, highByte} = themeSettings.defaultPalettePointer);
				lowstr=hex(lowByte); highstr=hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`,`Default Palette Pointer [${highstr}${lowstr}] : `, 384);
				
				// tilemapType
				addNewLine_toDisplay(`\nTilemap Type List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.tilemapTypeList.pointer)}`);
				({lowByte, highByte} = themeSettings.tilemapType);
				lowstr=hex(lowByte); highstr=hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`,`Tilemap Type [${highstr}${lowstr}] : `, 384);
				
				// roomDimensionSettingsPointer
				addNewLine_toDisplay(`\nRoom Dimension Settings Pointer List Address ${hex(themeSettingsBank)}:${hex(themeSettingsRefs.roomDimensionSettingsList.pointer)}`);
				({lowByte, highByte} = themeSettings.roomDimensionSettingsPointer);
				lowstr=hex(lowByte); highstr=hex(highByte);
				let roomDimensionSettingsPointer = (highByte<<8) + lowByte;
				add_toDisplay(`[${lowstr}, ${highstr}]`,`Room Dimension Settings Pointer [${highstr}${lowstr}] : `, 384);

				return {roomDimensionSettingsPointer};
			};

			let make_roomDimenstionSettings = function(){

				let roomDimSettingsAddress = get_roomDinSettingsAddress(roomDimensionSettingsPointer);


				// room dimension settings 
				addNewLine_toDisplay(`\n\n[ Room Dimension Settings 0x${hex(themeIndex)} : ${themeNames[themeIndex]} ] : `);

				let lowstr, highstr, wordstr;

				// address
				add_toDisplay(`${hex(roomDimSettingsBank)}:${hex(roomDimensionSettingsPointer)}`, `Address : `);

				// width (2 bytes)
				lowByte = ROM[roomDimSettingsAddress];
				highByte = ROM[roomDimSettingsAddress + 1];
				binWord = (highByte<<8) + lowByte;
				lowstr = hex(lowByte); highstr = hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`, `Pixel Width ${binWord} ; 0x${hex(binWord)} : \nOnly on Vertical Level (32x32Tile Width Max)`);

				// height (2 bytes)
				lowByte = ROM[roomDimSettingsAddress + 2];
				highByte = ROM[roomDimSettingsAddress + 3];
				binWord = (highByte<<8) + lowByte;
				lowstr = hex(lowByte); highstr = hex(highByte);
				add_toDisplay(`[${lowstr}, ${highstr}]`, `Pixel Height ${binWord} ; 0x${hex(binWord)} : \nOnly on Horizontal Level (32x32Tile Height Max)`);

				let roomListAddress = roomDimSettingsAddress + 4;

				// room : (left / right / top / bottom)
				let roomMax = 256;
				let roomByteSize = /*left*/2 + /*right*/2 + /*top*/2 + /*bottom*/2 + /*end*/2 ;
				for(let i=0; i<roomMax; i++){ // for(let i=0; i<roomMax; i++)

					let isCurrentRoom = (i===roomIndex ? true : false);
					addNewLine_toDisplay(`\nRoom Index ${i} (0x${hex(i)}) ${(isCurrentRoom?'[Current Level Room] : ':': ')}`);

					let roomAddress = roomListAddress + (i * roomByteSize);

					// left
					lowByte = ROM[roomAddress];
					highByte = ROM[roomAddress + 1];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					if(binWord === 0xFFFF){
						// room list end
						add_toDisplay(`[${lowstr}, ${highstr}]`, `Room List End Word 0x${lowstr+highstr} : `);
						break;
					}
					add_toDisplay(`[${lowstr}, ${highstr}]`, `Pixel Left : \n[${binWord} ; 0x${hex(binWord)}]`, 128);
					// right
					lowByte = ROM[roomAddress + 2];
					highByte = ROM[roomAddress + 3];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					add_toDisplay(`[${lowstr}, ${highstr}]`, `Pixel Right : \n[${binWord} ; 0x${hex(binWord)}]`, 128);
					// top
					lowByte = ROM[roomAddress + 4];
					highByte = ROM[roomAddress + 5];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					add_toDisplay(`[${lowstr}, ${highstr}]`, `Pixel Top : \n[${binWord} ; 0x${hex(binWord)}]`, 128);
					// bottom
					lowByte = ROM[roomAddress + 6];
					highByte = ROM[roomAddress + 7];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					add_toDisplay(`[${lowstr}, ${highstr}]`, `Pixel Bottom : \n[${binWord} ; 0x${hex(binWord)}]`, 128);
					// coordinate system
					lowByte = ROM[roomAddress + 8];
					highByte = ROM[roomAddress + 9];
					binWord = (highByte<<8) + lowByte;
					lowstr = hex(lowByte); highstr = hex(highByte);
					add_toDisplay(`[${lowstr}, ${highstr}]`, `Coordinate System : \n[0x${lowstr+highstr} : ${coordinateSystemNames[binWord]||'?'}]`, 224);
					
				}
			};

			// //////////////////////////////////////////////////////////////////////////
			let {ISD_pointer, roomIndex} = make_mainLevelSettings();
			let {PPU_renderMethodIndex, payloadsIndex, themeIndex} = make_ISD_settings();
			make_PPU_renderMethod();
			make_payloads();
			let {roomDimensionSettingsPointer} = make_themeSettings();
			make_roomDimenstionSettings();
			// //////////////////////////////////////////////////////////////////////////

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
			ROM = srcFilePanel.rom.fileData[0];
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

		function get_levelTypeNames(){
			return {
				0x00 : 'Normal',
				0x01 : 'Bonus',
				0x02 : 'Small Room',
				0x03 : 'Boss',
				0x04 : 'Unused',
				0x05 : 'Unused',
				0x06 : 'Destination Area',
			};
		}

		function get_bonusTypeNames(){
			return {
				0x00 : 'None',
				0x01 : 'Destroy Them All',
				0x02 : 'Collect The Stars',
				0x03 : 'Find The Token',
			};
		}

		function get_ISD_names(){
			return {
				0x479E : `Klobber Karnage / Jungle Jinx Bonus 1`,
				0x47B3 : `Jungle Jinx / Klobber Karnage Bonus 1`,
				0x47C8 : `Krochead Klamber`,
				0x47DD : `Mudhole Marsh`,
				0x47F2 : `Animal Antics - Rambi/Squitter/Rattly Section`,
				0x4807 : `Arctic Abyss / Clapper's Cavern / Animal Antics - Enguarde Section`,
				0x481C : `Clapper's Cavern Bonus 1 / Arctic Abyss Bonus 1 / Black Ice Battle Bonus 1`,
				0x4831 : `Black Ice Battle`,
				0x4846 : `Chain Link Chamber`,
				0x485B : `Stronghold Showdown`,
				0x4870 : `Toxic Tower`,
				0x4885 : `Castle Crush`,
				0x489A : `K.Rool Duel`,
				0x48AF : `Krocodile Kore`,
				0x48C4 : `Web Woods (Unused)`,
				0x48D9 : `Web Woods`,
				0x48EE : `Ghostly Grove`,
				0x4903 : `Gusty Glade`,
				0x4918 : `Lockjaw's Locker`,
				0x492D : `Lava Lagoon`,
				0x4942 : `Glimmer's Galleon`,
				0x4957 : `Rambi Rumble / Hornet Hole / Parrot Chute Panic Bonuses`,
				0x496C : `King Zing Sting`,
				0x4981 : `Parrot Chute Panic / Hornet Hole Bonus 2 / Rambi Rumle Bonus 1`,
				0x4996 : `Pirate Panic`,
				0x49AB : `Gangplank Galley`,
				0x49C0 : `Rattle Battle / Glimmer's Galleon Exit Room`,
				0x49D5 : `Hot-Head Hop / Kleever's Kiln`,
				0x49EA : `Fiery Furnace`,
				0x49FF : `Red-Hot Ride`,
				0x4A14 : `Slime Climb`,
				0x4A29 : `(Unused)(?)`,
				0x4A3E : `Topsail Trouble`,
				0x4A53 : `Krow's Nest`,
				0x4A68 : `Mainbrace Mayhem`,
				0x4A7D : `Kreepy Krow`,
				0x4A92 : `Target Terror / Rickety Race`,
				0x4AA7 : `Target Terror Exit Room / Target Terror Bonus 2 / Rickety Race Exit Room / Rickety Race Bonus 1`,
				0x4ABC : `Haunted Hall`,
				0x4AD1 : `Haunted Hall Bonus 1`,
				0x4AE6 : `Windy Well`,
				0x4AFB : `Kannon's Klaim`,
				0x4B10 : `Squawk's Shaft`,
				0x4B25 : `Bramble Blast / Animal Antics Bonus 1`,
				0x4B3A : `Screech's Sprint / Fiery Furnace Bonus 1`,
				0x4B4F : `Bramble Scramble`,
				0x4B64 : `Animal Antics - Squawks Section`,
				0x4B79 : `Bramble Blast Bonuses / Toxic Tower Bonus 1`,
				0x4B8E : `Target Terror Bonus 1 / Bramble Scramble Bonus 1 / Web Woods Bonus 1 / Windy Well Bonus 2`,
				0x4BA3 : `Screech's Sprint Bonus 1`,
				0x4BB8 : `K.Rool's Kabin / Rattle Battle "Rattly Room" / Gangplank Galley Bonus 1`,
				0x4BCD : `Barrel Bayou / Kudgel's Kontest`,
			};
		}

		function get_PPU_registerRefs(){
			return {
				0x2100:{name:'INIDISP', description:'Screen Display Register'},
				0x2101:{name:'OBSEL', description:'Object Size and Character Size Register'},
				0x2102:{name:'OAMADDL', description:'OAM Address Registers (Low)'},
				0x2103:{name:'OAMADDH', description:'OAM Address Registers (High)'},
				0x2104:{name:'OAMDATA', description:'OAM Data Write Register'},
				0x2105:{name:'BGMODE', description:'BG Mode and Character Size Register'},
				0x2106:{name:'MOSAIC', description:'Mosaic Register'},
				0x2107:{name:'BG1SC', description:'BG Tilemap Address Registers (BG1)'},
				0x2108:{name:'BG2SC', description:'BG Tilemap Address Registers (BG2)'},
				0x2109:{name:'BG3SC', description:'BG Tilemap Address Registers (BG3)'},
				0x210A:{name:'BG4SC', description:'BG Tilemap Address Registers (BG4)'},
				0x210B:{name:'BG12NBA', description:'BG Character Address Registers (BG1&2)'},
				0x210C:{name:'BG34NBA', description:'BG Character Address Registers (BG3&4)'},
				0x210D:{name:'BG1HOFS', description:'BG Scroll Registers (BG1)'},
				0x210E:{name:'BG1VOFS', description:'BG Scroll Registers (BG1)'},
				0x210F:{name:'BG2HOFS', description:'BG Scroll Registers (BG2)'},
				0x2110:{name:'BG2VOFS', description:'BG Scroll Registers (BG2)'},
				0x2111:{name:'BG3HOFS', description:'BG Scroll Registers (BG3)'},
				0x2112:{name:'BG3VOFS', description:'BG Scroll Registers (BG3)'},
				0x2113:{name:'BG4HOFS', description:'BG Scroll Registers (BG4)'},
				0x2114:{name:'BG4VOFS', description:'BG Scroll Registers (BG4)'},
				0x2115:{name:'VMAIN', description:'Video Port Control Register'},
				0x2116:{name:'VMADDL', description:'VRAM Address Registers (Low)'},
				0x2117:{name:'VMADDH', description:'VRAM Address Registers (High)'},
				0x2118:{name:'VMDATAL', description:'VRAM Data Write Registers (Low)'},
				0x2119:{name:'VMDATAH', description:'VRAM Data Write Registers (High)'},
				0x211A:{name:'M7SEL', description:'Mode 7 Settings Register'},
				0x211B:{name:'M7A', description:'Mode 7 Matrix Registers'},
				0x211C:{name:'M7B', description:'Mode 7 Matrix Registers'},
				0x211D:{name:'M7C', description:'Mode 7 Matrix Registers'},
				0x211E:{name:'M7D', description:'Mode 7 Matrix Registers'},
				0x211F:{name:'M7X', description:'Mode 7 Matrix Registers'},
				0x2120:{name:'M7Y', description:'Mode 7 Matrix Registers'},
				0x2121:{name:'CGADD', description:'CGRAM Address Register'},
				0x2122:{name:'CGDATA', description:'CGRAM Data Write Register'},
				0x2123:{name:'W12SEL', description:'Window Mask Settings Registers'},
				0x2124:{name:'W34SEL', description:'Window Mask Settings Registers'},
				0x2125:{name:'WOBJSEL', description:'Window Mask Settings Registers'},
				0x2126:{name:'WH0', description:'Window Position Registers (WH0)'},
				0x2127:{name:'WH1', description:'Window Position Registers (WH1)'},
				0x2128:{name:'WH2', description:'Window Position Registers (WH2)'},
				0x2129:{name:'WH3', description:'Window Position Registers (WH3)'},
				0x212A:{name:'WBGLOG', description:'Window Mask Logic registers (BG)'},
				0x212B:{name:'WOBJLOG', description:'Window Mask Logic registers (OBJ)'},
				0x212C:{name:'TM', description:'Screen Destination Registers'},
				0x212D:{name:'TS', description:'Screen Destination Registers'},
				0x212E:{name:'TMW', description:'Window Mask Destination Registers'},
				0x212F:{name:'TSW', description:'Window Mask Destination Registers'},
				0x2130:{name:'CGWSEL', description:'Color Math Registers'},
				0x2131:{name:'CGADSUB', description:'Color Math Registers'},
				0x2132:{name:'COLDATA', description:'Color Math Registers'},
				0x2133:{name:'SETINI', description:'Screen Mode Select Register'},
				0x2134:{name:'MPYL', description:'Multiplication Result Registers'},
				0x2135:{name:'MPYM', description:'Multiplication Result Registers'},
				0x2136:{name:'MPYH', description:'Multiplication Result Registers'},
				0x2137:{name:'SLHV', description:'Software Latch Register'},
				0x2138:{name:'OAMDATAREAD', description:'OAM Data Read Register'},
				0x2139:{name:'VMDATALREAD', description:'VRAM Data Read Register (Low)'},
				0x213A:{name:'VMDATAHREAD', description:'VRAM Data Read Register (High)'},
				0x213B:{name:'CGDATAREAD', description:'CGRAM Data Read Register'},
				0x213C:{name:'OPHCT', description:'Scanline Location Registers (Horizontal)'},
				0x213D:{name:'OPVCT', description:'Scanline Location Registers (Vertical)'},
				0x213E:{name:'STAT77', description:'PPU Status Register'},
				0x213F:{name:'STAT78', description:'PPU Status Register'},
				0x2140:{name:'APUIO0', description:'APU IO Registers'},
				0x2141:{name:'APUIO1', description:'APU IO Registers'},
				0x2142:{name:'APUIO2', description:'APU IO Registers'},
				0x2143:{name:'APUIO3', description:'APU IO Registers'},
				0x2180:{name:'WMDATA', description:'WRAM Data Register'},
				0x2181:{name:'WMADDL', description:'WRAM Address Registers'},
				0x2182:{name:'WMADDM', description:'WRAM Address Registers'},
				0x2183:{name:'WMADDH', description:'WRAM Address Registers'},
			};
		}

		function get_themeNames(){
			return {
				0x00 : 'Forest',
				0x01 : 'Underwater',
				0x02 : 'Beehive (A)',
				0x03 : 'Ship Deck',
				0x04 : 'Ship Mast',
				0x05 : 'Funfair (A)',
				0x06 : 'Lava',
				0x07 : 'Beehive (B)',
				0x08 : 'Mine',
				0x09 : 'Swamp',
				0x0A : 'Bramble (A)',
				0x0B : 'Tower (A)',
				0x0C : 'Lost K.Rool ?',
				0x0D : 'K.Rool ?',
				0x0E : 'Ice (A)',
				0x0F : 'Jungle',
				0x10 : '?',
				0x11 : 'Ice (B)',
				0x12 : 'Bramble (B)',
				0x13 : 'Funfair (B)',
				0x14 : 'Tower (B)',
			};
		}

		function get_coordinateSystemNames(){
			return {
				0x0000 : 'Horizontal (Standard)',
				0x0004 : 'Vertical (Wide)',
				0x0005 : 'Vertical (Narrow)',
				0x0006 : 'Vertical (Square)',
				0x0007 : 'Vertical (Square)',
				0x0008 : 'Horizontal (Narrow)',
			};
		}
	};

})();
