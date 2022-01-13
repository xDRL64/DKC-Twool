

// make : create container
// init : fill container with content AND add to document hierarchy
// create : create and fill container AND return it with a add to document hierarchy function (if need)

dkc2ldd.interface = (function(app=dkc2ldd){

	let defconst = {
	
		cW : 512,
		cH : 512

	};

	let o = {};

	o.create_userInterface = function(){
		
		// main area
		
		this.make_mainArea = function(){
		
			let elem = document.createElement("div");
			elem.style.position = "fixed";
			elem.style.display = "flex";
			elem.style.left = 0;
			elem.style.right = 0;
			elem.style.top = 0;
			elem.style.bottom = 0;
			elem.style.backgroundColor = "#ffeedd";
			
			this.mainArea = {};
			this.mainArea.elem = elem;
		};
		
		this.init_mainArea = function(){
		
			this.make_editModePanel();
			this.init_editModePanel("90%");
		
			this.make_workspace();
			this.init_workspace();
			
			this.make_srcFilePanel();
			this.init_srcFilePanel("90%");
		
			document.body.appendChild(this.mainArea.elem);
		};
		
		// workspace
		
		this.make_workspace = function(){
		
			let elem = document.createElement("div");
			elem.style.position = "relative";
			elem.style.display = "flex";
			elem.style.width = "100%";
			elem.style.height = "100%";
			elem.style.backgroundColor = "#ffdddd";
			elem.style.overflow = "auto";
			
			// prevent slide menu handle width (16)
			elem.style.margin = "0 16";
			
			this.workspace = {};
			this.workspace.elem = elem;
		};
		
		this.init_workspace = function(){
		
			// default :
			//this.update_workspace('mode0');
		
			this.mainArea.elem.appendChild(this.workspace.elem);
		};
		
		this.update_workspace = function(ref, editModeParams){
		
			this.workspace.list_generator[ref](editModeParams);
			
			this.workspace.current.update();
		};
		
		// slide menu
		
		this.create_slideMenu = function(width, side){
		
			// revertSide
			side = ({left:"right", right:"left"})[side];
			let sideImg = ({left:app.imgPack.right, right:app.imgPack.left})[side];
		
			// slide board
			
			let slideBoard = document.createElement("div");
			slideBoard.style.position = "relative";
			slideBoard.style.width = width;
			slideBoard.style.height = "100%";
			slideBoard.style.backgroundColor = "#ff0000";
			slideBoard.style.transition = "width 1s";
			
			// handle
			
			let handle = document.createElement("div");
			handle.style.position = "absolute";
			handle.style.width = 16;
			handle.style.height = "100%";
			handle.style[side] = -16;
			handle.style.zIndex = 1;
			handle.style.backgroundColor = "#cccccc";
			handle.style.backgroundImage = "url('"+sideImg+"')";
			handle.style.backgroundRepeat = "no-repeat";
			handle.style.backgroundPosition = "center"
			handle.style.border = "1px solid black";
			handle.style.boxSizing = "border-box";
			
			
			handle.style.display = "flex";
			handle.style.alignItems = "center";
			handle.style.color = "#ffffff";
			//handle.innerHTML = "<img src='"+sideImg+"'></img>";
			
			slideBoard.appendChild(handle);
			
			let o = {};
			
			o.handle = handle;
			o.slideBoard = slideBoard;
			
			o.attach = function(htmlElem){
				slideBoard.appendChild(htmlElem)
			};
			
			o.add = function(htmlParentElem){
				htmlParentElem.appendChild(slideBoard);
			};
			
			return o;
		};
		
		// source file panel
		
		this.make_srcFilePanel = function(){
		
			let elem = document.createElement("div");
			elem.style.position = "relative";
			elem.style.display = "flex";
			elem.style.flexWrap = "wrap";
			elem.style.alignContent = "flex-start";
			elem.style.width = "100%";
			elem.style.height = "100%";
			elem.style.overflowY = "auto";
			elem.style.backgroundColor = "#ffddff";
			
			this.srcFilePanel = {};
			this.srcFilePanel.elem = elem;
		};
		
		this.init_srcFilePanel = function(width){
		
			// slide menu board
			
			let menu = this.create_slideMenu(width, "right");
		
			// file slots
		
			let list_dkc2FileSlot = [];
		
			this.srcFilePanel.palette = this.create_srcFileSlot("PALETTE :");
			this.srcFilePanel.palette.add(this.srcFilePanel.elem);
			list_dkc2FileSlot[list_dkc2FileSlot.length] = this.srcFilePanel.palette;
			
			this.srcFilePanel.tileset = this.create_srcFileSlot("TILESET :");
			this.srcFilePanel.tileset.add(this.srcFilePanel.elem);
			list_dkc2FileSlot[list_dkc2FileSlot.length] = this.srcFilePanel.tileset;
			
			this.srcFilePanel.bgtileset = this.create_srcFileSlot("BG TILESET :");
			this.srcFilePanel.bgtileset.add(this.srcFilePanel.elem);
			list_dkc2FileSlot[list_dkc2FileSlot.length] = this.srcFilePanel.bgtileset;
			
			this.srcFilePanel.background = this.create_srcFileSlot("BG TILEMAP :");
			this.srcFilePanel.background.add(this.srcFilePanel.elem);
			list_dkc2FileSlot[list_dkc2FileSlot.length] = this.srcFilePanel.background;
			
			this.srcFilePanel.mapchip = this.create_srcFileSlot("MAPCHIP (8x8 TILEMAP) :");
			this.srcFilePanel.mapchip.add(this.srcFilePanel.elem);
			list_dkc2FileSlot[list_dkc2FileSlot.length] = this.srcFilePanel.mapchip;
			
			this.srcFilePanel.tilemap = this.create_srcFileSlot("LEVEL TILEMAP (32x32) :");
			this.srcFilePanel.tilemap.add(this.srcFilePanel.elem);
			list_dkc2FileSlot[list_dkc2FileSlot.length] = this.srcFilePanel.tilemap;
		
			this.srcFilePanel.list_dkc2FileSlot = list_dkc2FileSlot;
		
			// BUILD
			
			this.srcFilePanel.handle = menu.handle;
			this.srcFilePanel.isOpen = true;
			
			this.srcFilePanel.slideBoard = menu.slideBoard;
			menu.attach(this.srcFilePanel.elem);
			
			this.srcFilePanel.width = width;
			menu.add(this.mainArea.elem);
			
		};
		
		this.create_srcFileSlot = function(labelName){
		
			let height = 1.5;
		
			let slotArea = document.createElement("div");
			slotArea.style.position = "relative";
			slotArea.style.display = "flex";
			slotArea.style.flexWrap = "wrap";
			slotArea.style.alignContent = "flex-start";
			slotArea.style.width = "100%";
			slotArea.style.height = "fit-content";
			slotArea.style.margin = "0 0 8 0";
			slotArea.style.backgroundColor = "#ddffdd";
			slotArea.style.border = "1px solid black";
			
			let label = document.createElement("div");
			label.style.position = "relative";
			label.style.width = "80%";
			label.style.height = height+"em";
			label.style.whiteSpace = "nowrap";
			label.style.backgroundColor = "#ddbbdd";
			label.textContent = labelName;
			
			
			let fileIndex = document.createElement("input");
			fileIndex.type = "number";
			fileIndex.min = 0;
			fileIndex.max = 0;
			fileIndex.disabled = true;
			fileIndex.style.position = "relative";
			fileIndex.style.width = "20%";
			//fileIndex.style.height = height+"em";
			fileIndex.style.whiteSpace = "nowrap";
			fileIndex.style.backgroundColor = "#ffaaaa";
			fileIndex.style.border = "none";
			fileIndex.placeholder = "index (multi files)";
			
			
			let fileArea = document.createElement("div");
			fileArea.style.position = "relative";
			fileArea.style.width = "80%";
			//fileArea.style.height = height+"em";
			fileArea.style.whiteSpace = "nowrap";
			fileArea.style.backgroundColor = "#ddddff";
			fileArea.textContent = "file name";
			
			let importButton = document.createElement("div");
			importButton.style.position = "relative";
			importButton.style.width = "10%";
			//importButton.style.height = height+"em";
			importButton.style.whiteSpace = "nowrap";
			importButton.style.backgroundColor = "#ffeecc";
			importButton.textContent = "Imp";
			
			let exportButton = document.createElement("div");
			exportButton.style.position = "relative";
			exportButton.style.width = "10%";
			//exportButton.style.height = height+"em";
			exportButton.style.whiteSpace = "nowrap";
			exportButton.style.backgroundColor = "#bbffcc";
			exportButton.textContent = "Exp";
			
			let fileInfo = document.createElement("div");
			fileInfo.style.position = "relative";
			fileInfo.style.width = "100%";
			//fileInfo.style.height = height+"em";
			fileInfo.style.whiteSpace = "nowrap";
			fileInfo.style.backgroundColor = "#aaddff";
			fileInfo.textContent = "file info";
		
			let decompressionState = document.createElement("div");
			decompressionState.style.position = "relative";
			decompressionState.style.width = "100%";
			//decompressionState.style.height = height+"em";
			decompressionState.style.whiteSpace = "pre";
			decompressionState.style.backgroundColor = "#eeffcc";
			decompressionState.textContent = "[ ] use decompression";
			
			let parameters = document.createElement("input");
			parameters.type = "text";
			parameters.style.position = "relative";
			parameters.style.width = "100%";
			//parameters.style.height = height+"em";
			parameters.style.whiteSpace = "pre";
			parameters.style.backgroundColor = "#ffddaa";
			//parameters.textContent = "parameters";
			//parameters.contentEditable = true;
			parameters.style.border = "none";
			parameters.value = "parameters";
			
			let htmlInput = document.createElement("input");
			htmlInput.type = "file";
			htmlInput.multiple = true;
			
			slotArea.appendChild(label);
			slotArea.appendChild(fileIndex);
			slotArea.appendChild(fileArea);
			slotArea.appendChild(importButton);
			slotArea.appendChild(exportButton);
			slotArea.appendChild(fileInfo);
			slotArea.appendChild(decompressionState);
			slotArea.appendChild(parameters);
			
			let o = {};
			
			o.slotArea = slotArea;
			o.fileIndex = fileIndex;
			o.fileArea = fileArea;
			o.fileInfo = fileInfo;
			o.importButton = importButton;
			o.exportButton = exportButton;
			o.decompressionState = decompressionState;
			o.parameters = parameters;
			
			o.multi = 0;
			o.index = 0;
			o.useDec = [false];
			o.htmlInput = htmlInput;
			
			o.get_data = function(){
				if(o.multi === 1){
					return o.useDec[0] ? o.decompressed[0] : o.fileData[0];
				}
				if(o.multi > 1){
					let len = o.multi;
					let one = o.useDec[0] ? o.decompressed[0] : o.fileData[0];
					let all = app.lib.arrayAsFunction.create(one);
					for(let i=1; i<len; i++){
						one = o.useDec[i] ? o.decompressed[i] : o.fileData[i];
						one = app.lib.arrayAsFunction.create(one);
						all = app.lib.arrayAsFunction.concat(all,one);
					}
					return app.lib.arrayAsFunction.make_arraySyntax(all);
				}
			};

			o.debug_label = labelName;
		
			o.add = function(htmlParentElem){
				htmlParentElem.appendChild(slotArea);
			};
		
			return o;
		};
		
		// edit mode panel
		
		this.make_editModePanel = function(){
		
			let elem = document.createElement("div");
			elem.style.position = "relative";
			elem.style.display = "flex";
			elem.style.flexWrap = "wrap";
			elem.style.alignContent = "flex-start";
			elem.style.width = "100%";
			elem.style.height = "100%";
			elem.style.overflowY = "auto";
			elem.style.backgroundColor = "#bbffaa";
			
			this.editModePanel = {};
			this.editModePanel.elem = elem;
		};
		
		this.init_editModePanel = function(width){
		
			// slide menu board
			
			let menu = this.create_slideMenu(width, "left");
		
			// edit mode slot
		
			let list_editModeSlot = [];
		
			this.editModePanel.test0 = this.create_editModeSlot("test0 (palette displayer)", 'mode0');
			this.editModePanel.test0.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test0;
			
			this.editModePanel.test1 = this.create_editModeSlot("test1 (tileset displayer)", 'mode1');
			this.editModePanel.test1.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test1;
		
			this.editModePanel.test2 = this.create_editModeSlot("test2 (mapchip displayer)", 'mode2');
			this.editModePanel.test2.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test2;
			
			this.editModePanel.test3 = this.create_editModeSlot("test3 (background displayer)", 'mode3');
			this.editModePanel.test3.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test3;
			
			this.editModePanel.test4 = this.create_editModeSlot("test4 (level tilemap displayer)", 'mode4', ["p0",2,[3.4,"5"]]);
			this.editModePanel.test4.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test4;
		
			this.editModePanel.list_editModeSlot = list_editModeSlot;
		
			// BUILD
			
			this.editModePanel.handle = menu.handle;
			this.editModePanel.isOpen = true;
			
			this.editModePanel.slideBoard = menu.slideBoard;
			menu.attach(this.editModePanel.elem);
		
			this.editModePanel.width = width;
			menu.add(this.mainArea.elem);
			
		};
		
		this.create_editModeSlot = function(editModeName, workspaceRef, params){
		
			let height = "1.5em";
		
			let elem = document.createElement("div");
			elem.style.position = "relative";
			elem.style.width = "100%";
			elem.style.height = height;
			elem.style.whiteSpace = "nowrap";
			elem.style.margin = "0 0 8 0";
			elem.style.backgroundColor = "#cceeff";
			elem.style.border = "1px solid black";
			elem.textContent = editModeName;
			
			let o = {};
			
			o.elem = elem;
			o.workspaceRef = workspaceRef;
			o.params = params;
			
			o.add = function(htmlParentElem){
				htmlParentElem.appendChild(elem);
			};
			
			return o;
		};
		
		// start
		
		this.make_mainArea();
		this.init_mainArea();
	
	};
	
	o.start_workspace = function(){
	
	
		let wLib = app.workspace;
	
		let mainArea = this.mainArea;
	
		let workspace = this.workspace;
		let srcFilePanel = this.srcFilePanel;
	
		workspace.list_generator = [];
			

		// palette
		workspace.list_generator['mode0'] = app.mode[0];
		
		
		// tileset
		workspace.list_generator['mode1'] = function(params){
		
			let _gfx = 'fast';

			workspace.elem.textContent = ""; // to empty html child elements
		
			let o = {};
			
			let slot = srcFilePanel.tileset;

			slot.parameters.onkeydown = function(e){
				if(e.code === 'Enter') o.update();
			};

			o.update = function(){

				if(slot.multi > 0){
	
					let data = slot.get_data();

					//let wrong = (new Array(32)).fill(0xf).concat(new Array(32*62));
					let testTile = [
						0x80,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x80,
						0x01,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x00, 0x00,0x01
					];
					let overflowTile = [0x81,0x81,0x81,0x81,0x81];
					let testDecodedTile = [
						0xF,0x0,0xC,0x0,0x0,0x6,0x0,0x5,
						0x0,0x1,0x0,0x0,0x0,0x0,0xF,0x0,
						0xD,0x0,0xE,0x0,0x0,0x7,0x0,0x4,
						0x0,0x0,0x0,0x1,0x0,0x0,0x0,0x0,
						0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
						0xA,0x0,0x9,0x0,0x0,0x1,0x0,0xC,
						0x0,0x2,0x0,0x0,0x0,0x0,0xE,0x0,
						0xB,0x0,0x8,0x0,0x0,0x2,0x0,0x3,
					];
					let overflowDecodedTile = [1,2,3,4,5,6,7];
	
					let parameters = slot.parameters.value.match(/\w{1,}/g);
					let _p = parameters;

					let viewportUpdate = false;

					// TEST : draw_4bppTile()
						// params : d4t f/s iTile(1024)
						// params : d4t f/s o/w
					// TEST : decode_4bppTile() and draw_decodedTile() and format_4bppTile() and draw_formatedTile()
						// params : dt/ddt/ft/dft f/s f/s iTile(1024)
						// params : dt/ft   f/s f/s o/w
						// params : ddt/dft x   f/s o/w
					if(_p[0]==='d4t' || _p[0]==='dt' || _p[0]==='ddt' || _p[0]==='ft' || _p[0]==='dft'){
						
						o.viewport = wLib.create_preview(8*2,8*2, 10);
						
						let ctx = o.viewport.ctx;
						let pal = app.gfx.defaultPalettes[0];
						pal = app.gfx.debugpal;

						dkc2debug.gfxTest.TILESET.do(parameters, data, pal, ctx);

						viewportUpdate = true;
					}

					// TEST : draw_4bppTileset()
						// params : d4ts f/s O:bool W:bool
					// TEST : decode_4bppTileset() and draw_decodedTileset() and format_4bppTileset() and draw_formatedTileset()
						// params : dts/ddts/fts/dfts f/s f/s O:bool W:bool
						// params : dts/fts   f/s f/s O:bool W:bool
						// params : ddts/dfts any f/s O:bool W:bool
					if(_p[0]==='d4ts' || _p[0]==='dts' || _p[0]==='ddts' || _p[0]==='fts' || _p[0]==='dfts'){

						let sttObj = {};
						let xtmax = sttObj.xtmax = 16;
						let h     = sttObj.h     = Math.ceil( (data.length/32) /xtmax ) * 8;
						let w     = sttObj.w     = xtmax * 8;
						let _     = sttObj._     = 1;

						o.viewport = wLib.create_preview(w*2+_,h*2+_, 2);

						let ctx = o.viewport.ctx;

						let pal = app.gfx.defaultPalettes[0];
						pal = app.gfx.debugpal;

						let AaF = app.lib.arrayAsFunction;
						let arrFunc = slot.multi < 2 ? AaF.make_arraySyntax(AaF.create(data)) : data;
						let _data = arrFunc.jsArray();

						dkc2debug.gfxTest.TILESET.do(parameters, _data, pal, ctx, sttObj);

						viewportUpdate = true;
					}

					if(_p[0]==='parameters' || _p[0]==='default' || _p[0]===undefined){
						let xtmax  = 16;
						let h = Math.ceil( (data.length/32) /xtmax ) * 8;
						let w = xtmax * 8;
					
						o.viewport = wLib.create_preview(w,h, 2);
						let ctx = o.viewport.ctx;

						let pal = app.gfx.defaultPalettes[1];
						app.gfx[_gfx].draw_4bppTileset(data, pal, 0,0, 16, ctx);

						viewportUpdate = true;
					}


					if(viewportUpdate){
						workspace.elem.textContent = ""; // to empty html child elements
						workspace.elem.appendChild(o.viewport.view);
					}
					
				}

			};
			workspace.current = o;
		};
		

		// mapchip
		workspace.list_generator['mode2'] = function(id){
		
			workspace.elem.textContent = ""; // to empty html child elements
		
			let o = {};
		
			let W = defconst.cW; let H = defconst.cH*2;
			o.viewport = document.createElement("canvas");
			o.viewport.width = W;
			o.viewport.style.width = W;
			o.viewport.height = H;
			o.viewport.style.height = H;
			o.ctx = o.viewport.getContext("2d");
			
			workspace.elem.appendChild(o.viewport);
			
			o.update = function(){
				if(srcFilePanel.palette.multi > 0)
				if(srcFilePanel.tileset.multi > 0)
				if(srcFilePanel.mapchip.multi > 0){
				
					let tileset, mapchip, palettes;
					
					palettes = srcFilePanel.palette.get_data();
					palettes = app.gfx.fast.snespalTo24bits(palettes);
					
					tileset = srcFilePanel.tileset.get_data();

					mapchip = srcFilePanel.mapchip.get_data();
					
					//app.gfx.draw_oneChip(tileset, mapchip, 120, palettes, o.ctx);	
					app.gfx.draw_mapchip(tileset, mapchip, palettes, o.ctx);	
				}
			};
			workspace.current = o;
		};
		

		// bg tilemap
		workspace.list_generator['mode3'] = function(id){
		
			workspace.elem.textContent = ""; // to empty html child elements
		
			let o = {};
		
			let W = defconst.cW; let H = defconst.cH;
			o.viewport = document.createElement("canvas");
			o.viewport.width = W;
			o.viewport.style.width = W;
			o.viewport.height = H;
			o.viewport.style.height = H;
			o.ctx = o.viewport.getContext("2d");
			
			workspace.elem.appendChild(o.viewport);
			
			o.update = function(){
				if(srcFilePanel.palette.multi > 0)
				if(srcFilePanel.bgtileset.multi > 0)
				if(srcFilePanel.background.multi > 0){
				
					let palettes;
					let bgtileset;
					let background;
					
					palettes = srcFilePanel.palette.get_data();
					palettes = app.gfx.fast.snespalTo24bits(palettes);
					
					bgtileset = srcFilePanel.bgtileset.get_data();

					background = srcFilePanel.background.get_data();

					app.gfx.draw_background(bgtileset, background, palettes, o.ctx);
				}
			};
			workspace.current = o;
		};
		
		
		// level tilemap
		workspace.list_generator['mode4'] = function(params){
		//console.log(...params);

		console.log();
		
			let _gfx = 'fast';
		
			workspace.elem.textContent = ""; // to empty html child elements
		
			let o = {};
		
			let lvlDirection;
		
			// 16
			let yTileMax;
		
			let Tlen;
			
		
			// tilemap viewport
			//let viewportW = 29568;
			//let viewportH = 512;
			let viewportW;
			let viewportH;
			
				
			
			o.viewport = wLib.create_hoverPreview(512, 512, 1, [['main',32,32, 1],['scnd',8,8, 1]], 0);
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
			
			
			
			// editor memory
			
			let currentColorIndex = 0;

			
			// prototype editor
			///////////////////
	
			o.f8x8Prev.hoverBox.onmousemove = function(e){
				let pos = o.f8x8Prev.get_mousePos(e);
				console.log(pos);
			};
	
	
			o.palPreview.view.onclick = function(e){
			
				let pos = {x:e.offsetX, y:e.offsetY};
				
				currentColorIndex = Math.floor(pos.x/16);
				console.log(currentColorIndex)
				o.viewport.hoverBox.onmousemove(e);
			};

			
			let drawMousePos = function(pos){
			
				let processRef = app.features.write_hTilemap_to_4bppPix(
					tilemap, yTileMax, mapchip, tileset, pos.x,pos.y, currentColorIndex);

				let tileObj = processRef.tile;
				let chipObj = processRef.chip;
					
				let _hFlip = tileObj.hFlip ^ chipObj.hFlip;
				let _vFlip = tileObj.vFlip ^ chipObj.vFlip;
				app.gfx[_gfx].draw_4bppTile(
					tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex],
					_hFlip,_vFlip, o.viewport.ctx, tileObj.xtf*8, tileObj.ytf*8);
			};
			
	
			o.viewport.hoverBox.onclick = function(e){
			
				let pos = o.viewport.get_mousePos(e);
				
				drawMousePos(pos);
				
				o.viewport.hoverBox.onmousemove(e);
			};
			
	
			o.viewport.hoverBox.onmousemove = function(e){

				// get hover preview position (precise e.offsetXY)
				let pos = o.viewport.get_mousePos(e);
		

				
				if(e.buttons)
					drawMousePos(pos);
				
				
			
				let tileObj = app.ref.hTilemapPixpos_to_tile(
					pos.x, pos.y, yTileMax, tilemap);
					
					
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

			
				o.viewport.cursor.main.gridMove(tileObj.xt, tileObj.yt);
				o.viewport.cursor.scnd.gridMove(tileObj.xtf, tileObj.ytf);
				
				// tile prev panel draw update
				
				let nCtx = o.tilePrevPan.nFlip.ctx;
				let hCtx = o.tilePrevPan.hFlip.ctx;
				let vCtx = o.tilePrevPan.vFlip.ctx;
				let aCtx = o.tilePrevPan.aFlip.ctx;
				
				app.gfx.draw_oneChip(tileset, mapchip, tileObj.chipIndex, palettes, nCtx, 0,0);
				app.gfx.draw_oneChip(tileset, mapchip, tileObj.chipIndex, palettes, hCtx, 1,0);
				app.gfx.draw_oneChip(tileset, mapchip, tileObj.chipIndex, palettes, vCtx, 0,1);
				app.gfx.draw_oneChip(tileset, mapchip, tileObj.chipIndex, palettes, aCtx, 1,1);
				
				nCtx = o.t8x8PrevPan.nFlip.ctx;
				hCtx = o.t8x8PrevPan.hFlip.ctx;
				vCtx = o.t8x8PrevPan.vFlip.ctx;
				aCtx = o.t8x8PrevPan.aFlip.ctx;
				
				// 8x8 tile prev draw update
				app.gfx[_gfx].draw_4bppTile(tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 0,0, nCtx);
				app.gfx[_gfx].draw_4bppTile(tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 1,0, hCtx);
				app.gfx[_gfx].draw_4bppTile(tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 0,1, vCtx);
				app.gfx[_gfx].draw_4bppTile(tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], 1,1, aCtx);
				
				
				// flipped 8x8 tile prev draw update
				app.gfx[_gfx].draw_4bppTile(tileset, chipObj.tile8x8Index, palettes[chipObj.paletteIndex], _hFlip,_vFlip, o.f8x8Prev.ctx);
				
				
				
				// 4 tile prev panel cursors update
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
				
				
				// palette
				app.gfx.fast.draw_snespal(snespal, ctx_palPrev);
				// current pen color index
				o.palPreview.cursor.third.gridMove(currentColorIndex,0);
				// mouse palette index
				o.palPreview.cursor.main.gridMove(0,chipObj.paletteIndex);
				// mouse color index
				o.palPreview.cursor.scnd.gridMove(f8x8Obj.iCol,chipObj.paletteIndex);
			
				
				o.previewPanel.style.left = workspace.elem.scrollLeft;
				o.previewPanel.style.bottom = -workspace.elem.scrollTop;
			};
	
	
			// data pointers
			
			let snespal;
			let palettes;
			let tileset;
			let tilemap;
			let mapchip;
	
	
			o.update = function(){
				if(srcFilePanel.palette.multi > 0)
				if(srcFilePanel.tileset.multi > 0)
				if(srcFilePanel.mapchip.multi > 0)
				if(srcFilePanel.tilemap.multi > 0){
				
					snespal = srcFilePanel.palette.get_data();;
					palettes = app.gfx.fast.snespalTo24bits(snespal);

					tileset = srcFilePanel.tileset.get_data();
					tilemap = srcFilePanel.tilemap.get_data();
					mapchip = srcFilePanel.mapchip.get_data();


					let tilemapParams = srcFilePanel.tilemap.parameters.value.match(/\w{1,}/g);

					lvlDirection = tilemapParams[0]

					yTileMax = parseInt(tilemapParams[1]); //16;

					Tlen = tilemap.length / 2;

					if(lvlDirection==='h'){
						viewportW = Math.floor(Tlen/yTileMax) * 32;
						viewportH = yTileMax * 32;
					}else{
						viewportW = yTileMax * 32;
						viewportH = Math.floor(Tlen/yTileMax) * 32;
					}

					o.viewport.view.width = viewportW;
					o.viewport.view.style.width = viewportW;
					o.viewport.view.height = viewportH;
					o.viewport.view.style.height = viewportH;

					o.viewport.W = viewportW;
					o.viewport.H = viewportH;
					o.viewport._left = 0;
					o.viewport._top = 0;
					o.viewport.xPos = 0;
					o.viewport.yPos = 0;

					if(lvlDirection === 'h')
						app.gfx.draw_hLvlTilemap(tileset, yTileMax, mapchip, tilemap, palettes, o.viewport.ctx);
					else
						app.gfx.draw_vLvlTilemap(tileset, yTileMax, mapchip, tilemap, palettes, o.viewport.ctx);
					
				}
			};
			
			
			
			
			workspace.current = o;
		};
		
			
	};
	
	return o;
})();

