
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 12 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		let gfx = app.gfx.fast;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...
		
		
		
		let split_workspaceInto2Areas = function(heightA, heightB){
			let A = document.createElement('div');
			let B = document.createElement('div');
			let C = document.createElement('div');

			let applyStyle_splittedWorkspaceArea = (style, height="50%") => {
				style.display = "flex";
				style.width = "100%";
				style.height = height;
				style.border = "2px solid black";
				style.boxSizing = "border-box";
				style.whiteSpace = "nowrap";
			};
			
			applyStyle_splittedWorkspaceArea(A.style, heightA);
			A.style.border = "2px solid green";
			
			applyStyle_splittedWorkspaceArea(B.style, heightB);
			B.style.border = "2px solid yellow";

			C.style.border = "2px solid red";
			C.style.height = "100%";
			C.style.width = "100%";
			C.style.boxSizing = "border-box";

			C.appendChild(A);
			C.appendChild(B);
			
			return {upside : A, downside : B, parent : C};
		};

		let applyStyle_grid = style => {
			style.background = "rgb(155, 127, 177)";
			style.display = "grid";
			style.width = "100%";
			style.height = "100%";
			style.minWidth = "fit-content";
			style.minHeight = "fit-content";
			style.justifyItems = "center";
			style.alignItems = "center";
			style.gridGap = "1%";
		};
		
		let columnElemHeight = 10; // in %
		let applyStyle_columnElem = style => {
			style.width = "80%";
			style.height = columnElemHeight+"%";
			style.margin = "5%";
			style.overflow = "hidden";
			style.textOverflow = "ellipsis";
			style.pointerEvents = "all";
			style.zIndex = "1";
		};

		let applyStyle_columnPanel = style => {
			style.background = "blue"
			style.width = "100%";
			style.height = "100%";
			style.display = "inline-flex";
			style.flexDirection = "column";
			style.justifyContent = "center";
			style.alignItems = "center";
			style.position = "relative";
			style.pointerEvents = "none";
			
		};

		let applyStyle_gfxPanel = style => {
        	style.background = "rgb(165, 127, 127)";
        	style.display = "grid";
        	style.justifyItems = "center";
        	style.alignItems = "center";
			style.width = "100%";
        	style.height = "100%";
        	style.overflow = "auto";
        	style.position = "relative";
		};

		let create_columnPanButton = function(txt="", heightFactor=1){
			let elem = document.createElement('button');
			applyStyle_columnElem(elem.style);
			elem.style.height = (columnElemHeight*heightFactor)+"%";
			elem.textContent = txt;
			return elem;
		};

		let create_columnPanNumInput = function(defval=0, heightFactor=1){
			let elem = document.createElement('input');
			elem.setAttribute('type', "number");
			elem.setAttribute('value', defval);
			applyStyle_columnElem(elem.style);
			elem.style.height = (columnElemHeight*heightFactor)+"%";
			return elem;
		};

		let create_columnPanTopNumInput = function(defval=0, heightFactor=1){
			let elem = create_columnPanNumInput(defval, heightFactor);
			elem.style.position = "absolute";
			elem.style.top = 0;
			elem.style.left = 0;
			elem.style.right = 0;
			elem.style.margin = "0 auto";
			return elem;
		};

		let create_outputDisplay = function(w,h, s=1){
			let o = wLib.create_preview(w,h, s);
			
			o.elem.style.width = w * s;
			o.elem.style.height = h * s;

			o.view.style.backgroundColor = "black";
			o.view.style.backgroundImage = "url("+app.imgPack.alphaTex+")";
			o.view.style.backgroundSize = "16px";

			o.view.style.border = "2px solid red";
			return o;
		};

		let create_ioDisplay = function(w,h, s=1, cursors){
			let o = wLib.create_hoverPreview(w,h, s, cursors, 0, 0);
			
			o.elem.style.width = w * s;
			o.elem.style.height = h * s;

			o.view.style.backgroundColor = "black";
			o.view.style.backgroundImage = "url("+app.imgPack.alphaTex+")";
			o.view.style.backgroundSize = "16px";

			o.elem.style.border = "2px solid red";
			return o;
		};

		const xpcmax = 16; // xpalcolmax (never change)
		let build_paletteArea = function(srcFileColorCount){
			// grid elem
			let grid = document.createElement('div');
			applyStyle_grid(grid.style);
			grid.style.gridTemplateColumns = "1fr 2fr 1fr 2fr 1fr 2fr";
			grid.style.gridTemplateRows = "1fr 4fr 1fr";

			let columnPan = {
				srcFile :         document.createElement('div'),
				srcFile__buffer : document.createElement('div'),
				buffer__type :    document.createElement('div'),
			};

			applyStyle_columnPanel(columnPan.srcFile.style);
			applyStyle_columnPanel(columnPan.srcFile__buffer.style);
			applyStyle_columnPanel(columnPan.buffer__type.style);

			let gfxPan = {
				srcFile : document.createElement('div'),
				buffer :  document.createElement('div'),
				type :    document.createElement('div'),
			};

			applyStyle_gfxPanel(gfxPan.srcFile.style);
			applyStyle_gfxPanel(gfxPan.buffer.style);
			applyStyle_gfxPanel(gfxPan.type.style);

			// grid item location :
			let s;

			s = columnPan.srcFile.style;         s.gridColumn = "1 / span 1"; s.gridRow = "2 / span 1";
			s = gfxPan.srcFile.style;            s.gridColumn = "2 / span 1"; s.gridRow = "2 / span 1";
			s = columnPan.srcFile__buffer.style; s.gridColumn = "3 / span 1"; s.gridRow = "2 / span 1";
			s = gfxPan.buffer.style;             s.gridColumn = "4 / span 1"; s.gridRow = "2 / span 1";
			s = columnPan.buffer__type.style;    s.gridColumn = "5 / span 1"; s.gridRow = "2 / span 1";
			s = gfxPan.type.style;               s.gridColumn = "6 / span 1"; s.gridRow = "2 / span 1";

			// I/O html elements
			let W = xpcmax;
			let H = Math.ceil(256/xpcmax);
			let srcFileH = Math.ceil(srcFileColorCount/xpcmax);
			let S = 16;
			let wp = ({2:4,4:16,8:16})[bpp];
			let yp = ({2:1,4:1,8:16})[bpp];
			
			let IO = {
				btn : {
					displaySrcFile : create_columnPanButton("display from files"),
					srcFileToBuffer : create_columnPanButton("🡺"),
					bufferToSrcFile : create_columnPanButton("🡸"),
					bufferToType : create_columnPanButton("🡺"),
					typeToBuffer : create_columnPanButton("🡸"),
				},

				screen : {
					srcFile : create_outputDisplay(W,srcFileH, S),
					buffer : create_outputDisplay(W,H, S),
					type : create_ioDisplay(W,H, S, [['pal', wp,yp],['col', 1,1]]),
				}

			};

			// to grid connexion
			grid.appendChild(columnPan.srcFile);
			grid.appendChild(columnPan.srcFile__buffer);
			grid.appendChild(columnPan.buffer__type);
			grid.appendChild(gfxPan.srcFile);
			grid.appendChild(gfxPan.buffer);
			grid.appendChild(gfxPan.type);

			// to cells connexion (input panel)
			columnPan.srcFile.appendChild(IO.btn.displaySrcFile);
			columnPan.srcFile__buffer.appendChild(IO.btn.srcFileToBuffer);
			columnPan.srcFile__buffer.appendChild(IO.btn.bufferToSrcFile);
			columnPan.buffer__type.appendChild(IO.btn.bufferToType);
			columnPan.buffer__type.appendChild(IO.btn.typeToBuffer);

			// to cells connexion (output panel)
			gfxPan.srcFile.appendChild(IO.screen.srcFile.elem);
			gfxPan.buffer.appendChild(IO.screen.buffer.elem);
			gfxPan.type.appendChild(IO.screen.type.elem);

			return {grid:grid, elems:IO};
		};


		let build_tilesetArea = function(xtmax, srcFileTileCount){

			// grid elem
			let grid = document.createElement('div');
			applyStyle_grid(grid.style);
			grid.style.gridTemplateColumns = "1fr 2fr 1fr 2fr 1fr 2fr 1fr 2fr";
			grid.style.gridTemplateRows = "1fr 4fr 4fr 1fr";
			
			// cell elems

			let columnPan = {
				tlst : {
					srcFile :      document.createElement('div'),
					buffer__vram : document.createElement('div'),
				},
				anim : {
					srcFile : document.createElement('div'),
					buffer__vram : document.createElement('div'),
					fileNum : document.createElement('div'),
				},
				both : {
					srcFile__buffer : document.createElement('div'),
				},
				work : {
					frameNum : document.createElement('div'),
					vram__type : document.createElement('div'),
				},
			};
			
			applyStyle_columnPanel(columnPan.tlst.srcFile.style);
			applyStyle_columnPanel(columnPan.both.srcFile__buffer.style);
			applyStyle_columnPanel(columnPan.tlst.buffer__vram.style);
			applyStyle_columnPanel(columnPan.anim.srcFile.style);
			applyStyle_columnPanel(columnPan.anim.fileNum.style);
			applyStyle_columnPanel(columnPan.anim.buffer__vram.style);
			applyStyle_columnPanel(columnPan.work.frameNum.style);
			applyStyle_columnPanel(columnPan.work.vram__type.style);

			let gfxPan_ts_binprev = document.createElement('div');
			let gfxPan_ts_buffer = document.createElement('div');
			let gfxPan_anim_binprev = document.createElement('div');
			let gfxPan_anim_buffer = document.createElement('div');
			let gfxPan_vram = document.createElement('div');
			let gfxPan_type = document.createElement('div');

			applyStyle_gfxPanel(gfxPan_ts_binprev.style);
			applyStyle_gfxPanel(gfxPan_ts_buffer.style);
			applyStyle_gfxPanel(gfxPan_anim_binprev.style);
			applyStyle_gfxPanel(gfxPan_anim_buffer.style);
			applyStyle_gfxPanel(gfxPan_vram.style);
			applyStyle_gfxPanel(gfxPan_type.style);

			// grid item location :
			let s;
			
			s = columnPan.tlst.srcFile.style;         s.gridColumn = "1 / span 1"; s.gridRow = "2 / span 1";
			s = gfxPan_ts_binprev.style;              s.gridColumn = "2 / span 1"; s.gridRow = "2 / span 1";
			s = columnPan.both.srcFile__buffer.style; s.gridColumn = "3 / span 1"; s.gridRow = "2 / span 2"; // overlap
			s = gfxPan_ts_buffer.style;               s.gridColumn = "4 / span 1"; s.gridRow = "2 / span 1";
			s = columnPan.tlst.buffer__vram.style;    s.gridColumn = "5 / span 1"; s.gridRow = "2 / span 1";
		 
			s = columnPan.anim.srcFile.style;         s.gridColumn = "1 / span 1"; s.gridRow = "3 / span 1";
			s = gfxPan_anim_binprev.style;            s.gridColumn = "2 / span 1"; s.gridRow = "3 / span 1";
			s = columnPan.anim.fileNum.style;         s.gridColumn = "3 / span 1"; s.gridRow = "3 / span 1"; // overlap
			s = gfxPan_anim_buffer.style;             s.gridColumn = "4 / span 1"; s.gridRow = "3 / span 1";
			s = columnPan.anim.buffer__vram.style;    s.gridColumn = "5 / span 1"; s.gridRow = "3 / span 1";
		 
			s = columnPan.work.frameNum.style;        s.gridColumn = "6 / span 1"; s.gridRow = "1 / span 1";
			s = gfxPan_vram.style;                    s.gridColumn = "6 / span 1"; s.gridRow = "2 / span 2";
			s = columnPan.work.vram__type.style;      s.gridColumn = "7 / span 1"; s.gridRow = "2 / span 2";
			s = gfxPan_type.style;                    s.gridColumn = "8 / span 1"; s.gridRow = "2 / span 2";

			// I/O html elements
			let W = xtmax * 8;
			let H = Math.ceil(1024/xtmax) * 8;
			let srcFileH = Math.ceil(srcFileTileCount/xtmax) * 8;
			let IO = {
				btn : {
					tlst_displaySrcFile : create_columnPanButton("display from files"),
					tlst_srcFileToBuffer : create_columnPanButton("🡺", 0.5),
					tlst_bufferToSrcFile : create_columnPanButton("🡸", 0.5),
					tlst_bufferToVram : create_columnPanButton("🡺"),
					tlst_vramToBuffer : create_columnPanButton("🡸"),
					
					anim_displaySrcFile : create_columnPanButton("display from files"),
					/* anim_srcFileToBuffer : create_columnPanButton("🡺"),
					anim_bufferToSrcFile : create_columnPanButton("🡸"), */
					anim_bufferToVram : create_columnPanButton("🡺"),
					anim_vramToBuffer : create_columnPanButton("🡸"),

					work_vramToType : create_columnPanButton("🡺", 0.5),
					work_typeToVram : create_columnPanButton("🡸", 0.5),
				},

				inum : {
					anim_fileNum : create_columnPanNumInput(0),
					work_vramFrame : create_columnPanNumInput(0, 4),
				},

				screen : {
					tlst_srcFile : create_outputDisplay(W,srcFileH, 1),
					tlst_buffer : create_outputDisplay(W,H, 1),

					anim_srcFile : create_outputDisplay(W,srcFileH, 1),
					anim_buffer : create_outputDisplay(W,H, 1),

					vram_buffer : create_outputDisplay(W,H, 1),
					type_buffer : create_ioDisplay(W,H, 1),
				}

			};

			// to grid connexion
			grid.appendChild(columnPan.tlst.srcFile);
			grid.appendChild(columnPan.both.srcFile__buffer);
			grid.appendChild(columnPan.tlst.buffer__vram);
			grid.appendChild(columnPan.anim.srcFile);
			grid.appendChild(columnPan.anim.fileNum);
			grid.appendChild(columnPan.anim.buffer__vram);
			grid.appendChild(columnPan.work.frameNum);
			grid.appendChild(columnPan.work.vram__type);
			grid.appendChild(gfxPan_ts_binprev);
			grid.appendChild(gfxPan_ts_buffer);
			grid.appendChild(gfxPan_anim_binprev);
			grid.appendChild(gfxPan_anim_buffer);
			grid.appendChild(gfxPan_vram);
			grid.appendChild(gfxPan_type);

			// to cells connexion (input panel)
			columnPan.tlst.srcFile.appendChild(IO.btn.tlst_displaySrcFile);
			columnPan.both.srcFile__buffer.appendChild(IO.btn.tlst_srcFileToBuffer);
			columnPan.both.srcFile__buffer.appendChild(IO.btn.tlst_bufferToSrcFile);
			columnPan.tlst.buffer__vram.appendChild(IO.btn.tlst_bufferToVram);
			columnPan.tlst.buffer__vram.appendChild(IO.btn.tlst_vramToBuffer);

			columnPan.anim.srcFile.appendChild(IO.btn.anim_displaySrcFile);
			columnPan.anim.fileNum.appendChild(IO.inum.anim_fileNum);
			columnPan.anim.buffer__vram.appendChild(IO.btn.anim_bufferToVram);
			columnPan.anim.buffer__vram.appendChild(IO.btn.anim_vramToBuffer);

			columnPan.work.frameNum.appendChild(IO.inum.work_vramFrame);

			columnPan.work.vram__type.appendChild(IO.btn.work_vramToType);
			columnPan.work.vram__type.appendChild(IO.btn.work_typeToVram);


			// to cells connexion (output panel)
			gfxPan_ts_binprev.appendChild(IO.screen.tlst_srcFile.elem);
			gfxPan_ts_buffer.appendChild(IO.screen.tlst_buffer.elem);

			gfxPan_anim_binprev.appendChild(IO.screen.anim_srcFile.elem);
			gfxPan_anim_buffer.appendChild(IO.screen.anim_buffer.elem);

			gfxPan_vram.appendChild(IO.screen.vram_buffer.elem);
			gfxPan_type.appendChild(IO.screen.type_buffer.elem);


			return {grid:grid, elems:IO};
		};

		//////////////
		// WORKAREA //
		//////////////

		let areas = split_workspaceInto2Areas("30%", "70%");

		let palArea = areas.upside;
		let tsArea = areas.downside;
		workspace.elem.appendChild(areas.parent);

		const bpp = 4;
		let bppSize = ({2:16,4:32,8:64})[bpp];
		const currentType = {
			name : 'formated'+bpp,
			flag : 'f'
		};

		
		let sharedEditorMem = {
				update_FromPalEditor : function(){},
				update_FromTlstEditor : function(){},
				display_allTlstViews : function(){},
	
				pal2 : app.gfx.defaultPalettes[1],
				pal4 : app.gfx.defaultPalettes[1],
				pal8 : app.gfx.defPal8
		};


		//////////////////
		// PALETTE AREA //
		//////////////////

		(function(){
			let paletteSlot = srcFilePanel.palette;
			let palDataAccess = paletteSlot.get_dataWithOwnerAccess();
	
			let palSize = 0;
			for(let obj of palDataAccess)
				palSize += obj.data.length;
	
			let palColCount = palSize >> 1; // div by 2
			let paletteArea = build_paletteArea(palColCount);
			palArea.appendChild(paletteArea.grid);
	
			let PAL = app.component.Palette( {ownerRefs:palDataAccess, byteOffset:0} );
	
			// DISPLAY FUNCTIONS
			//
	
			// palette source files
			let display_srcFile = function(){
				let data = paletteSlot.get_data__OLD();
				let ctx = paletteArea.elems.screen.srcFile.ctx;
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				gfx.draw_snespal(data, ctx);
			};
	
			// palette buffer
			let display_buffer = function(){
				let data = PAL._buffer;
				let ctx = paletteArea.elems.screen.buffer.ctx;
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				gfx.draw_snespal(data, ctx);
			};
	
			// palette type
			let display_type = function({name, flag}){
				let ctx =  paletteArea.elems.screen.type.ctx;
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

				let type = PAL.type[name];
				if(flag === 'd')
					gfx.draw_decodedPalette(type, ctx);
				if(flag === 'f')
					gfx.draw_formatedPalette(type, bpp, ctx);
	
			};
	
			// EVENT FUNCTIONS
			//
	
			// COLUMN 1 //
			
			// [UPDATE FROM FILE] palette button : display source files
			paletteArea.elems.btn.displaySrcFile.onclick = function(){
				// draw palette srcFile
				display_srcFile();
			};
	
			// COLUMN 2 //
			
			// [🡺] palette button : source files to buffer
			paletteArea.elems.btn.srcFileToBuffer.onclick = function(){
				PAL.init();
	
				// draw palette buffer
				display_buffer();
			};

			// [🡸] palette button : buffer to source files
			paletteArea.elems.btn.bufferToSrcFile.onclick = function(){
				PAL.write();
	
				// draw palette buffer
				display_srcFile();
			};
	
			// COLUMN 3 //
	
			// [🡺] palette button : buffer to type
			paletteArea.elems.btn.bufferToType.onclick = function(){
				PAL.update('decoded'+bpp,'formated'+bpp);
				// draw palette type
				//display_type(PAL.type['decoded'+bpp], 'd');
				//display_type(PAL.type['formated'+bpp], 'd');
				
				miniEditor.set_type(currentType.name);
				miniEditor.tigger_selectColor();
				
				display_type(currentType);
				_PAL = PAL; // debug
			};

			// [🡸] palette button : type to buffer
			paletteArea.elems.btn.typeToBuffer.onclick = function(){
				PAL.sync(currentType.name);

				// draw palette buffer
				display_buffer();
			};



			// MINI EDITOR (PALETTE)
			// left click : select a palette ID and a color ID in palette editor to use in tileset editor
			// middle click : sample rgb color value from pointed color in palette editor
			// hold right + left click : write the previous sampled palette rgb color in palette editor
			let miniEditor = (function(){

				let o = {};

				let hoverPreview = paletteArea.elems.screen.type;

				let type = null;
				let setType = false;

				let xCol = 0, yCol = 0;
				let xPal = 0, yPal = 0;
				let iColor = 0;
				let iPalette = 0;
				let outOfPal = false;

				let xcCol, ycCol;
				let xcPal = 0, ycPal = 0;

				let sample = new Uint8Array(3); // rgb

				hoverPreview.cursor.pal.setColor("#ff0");

				let update_pos = function(xMousePos, yMousePos){
					let floor = Math.floor;
					let scale = hoverPreview.S;
					let x = xCol = floor(xMousePos/scale);
					let y = yCol = floor(yMousePos/scale);
					
					if(bpp === 2){
						iColor   =  x % 4;
						iPalette = (y * 4) + (x >> 2); // div by 4
						xPal     = iPalette % 4;
						yPal     = iPalette >> 2; // div by 4
						outOfPal = y < 2 ? false : true;
					}
					if(bpp === 4){
						iColor   = x;
						iPalette = y;
						xPal     = 0;
						yPal     = iPalette;
						outOfPal = y < 8 ? false : true;
					}
					if(bpp === 8){
						iColor   = (y * 16) + x;
						iPalette = 0;
						xPal     = 0;
						yPal     = 0;
						outOfPal = false;
					}
				};

				sharedEditorMem.update_FromTlstEditor = function(val){
					iColor = val;
					
					if(bpp === 2){
						xCol = (xcPal*4) + val;
						yCol = ycPal;
					}
					if(bpp === 4){
						xCol = xcPal + val;
						yCol = ycPal;
					}
					if(bpp === 8){
						xCol = val % 16;
						yCol = val >> 4; // div by 16
					}

					hoverPreview.cursor.col.gridMove(xCol,yCol);
				};

				let send_palFromType = function(){
					if(setType){
						let mem = sharedEditorMem;
						mem['pal'+bpp] = type[iPalette] || mem['pal'+bpp] ;
					}
				};

				let set_cursors = function(){
						hoverPreview.cursor.col.gridMove(xCol,yCol);
						hoverPreview.cursor.pal.gridMove(xPal,yPal);
						xcPal = xPal; ycPal = yPal;
				};
				
				let select_color = function(){
					send_palFromType();
					set_cursors();
					sharedEditorMem.update_FromPalEditor(iColor);
					sharedEditorMem.display_allTlstViews();
				};

				let sample_color = function(){
					let color = type[iPalette][iColor];
					sample[0] = color[0]; // r
					sample[1] = color[1]; // g
					sample[2] = color[2]; // b
				};

				let write_color = function(){
					if(setType){
						let color = type[iPalette][iColor];
						color[0] = sample[0]; // r
						color[1] = sample[1]; // g
						color[2] = sample[2]; // b
						display_type(currentType);
						sharedEditorMem.display_allTlstViews();
					}
				};

				hoverPreview.elem.onmousemove = function(e){
					let pos = hoverPreview.get_mousePos(e);
					update_pos(pos.x,pos.y);
					
					if(!outOfPal){
						if((e.buttons&0x1) === 1) select_color(); // left click
					}

					console.log(iColor, iPalette, outOfPal);
				};

				hoverPreview.elem.onmousedown = function(e){
					e.preventDefault();

					if(!outOfPal){
						if((e.buttons&0x1) === 1) select_color(); // left click
						if((e.buttons&0x4) === 4) sample_color(); // middle click
						if((e.buttons&0x3) === 3) write_color();  // right + left click
					}

				};

				hoverPreview.elem.oncontextmenu = function(e){
					e.preventDefault();
					e.stopPropagation();
				};

				o.tigger_selectColor = select_color;

				o.set_type = function(name){
					type = PAL.type[name];
					if(type) setType = true;
				};

				return o;

			})();
			// END : MINI EDITOR

		})();




		//////////////////
		// TILESET AREA //
		//////////////////

		(function(){
			let xtmax = 16;
			let iAnimFile = 0;
			let iAnimFrame = 0;
	
			let tilesetSlot = srcFilePanel.tileset;
			let animationSlot = srcFilePanel.animation;
	
			let tlstDataAccess = tilesetSlot.get_dataWithOwnerAccess();
			let animDataAccess = animationSlot.get_dataWithOwnerAccess();
	
			let tlstSize = 0;
			for(let obj of tlstDataAccess)
				tlstSize += obj.data.length;
	
			let animMaxSize = 0;
			let animFileCount = animDataAccess.length;
			for(let obj of animDataAccess)
				animMaxSize = Math.max(animMaxSize, obj.data.length);
	
			let srcFileMaxSize = Math.max(tlstSize, animMaxSize);
			let maxTileCount = {2:srcFileMaxSize>>4, 4:srcFileMaxSize>>5, 8:srcFileMaxSize>>6}[bpp];
	
			let tlstArea = build_tilesetArea(xtmax, maxTileCount);
			tsArea.appendChild(tlstArea.grid);
	
	
			let TLST = app.component.Tileset(
				//{ownerRefs:tlstDataAccess, byteOffset:0, vramOffset:(tilesetSlot.vramRefs?.[0]?.dstIndex||0)*bppSize},
				{ownerRefs:tlstDataAccess, byteOffset:0, vramOffset:0},
				bpp,
				{ownerRefs:animDataAccess, vramRefs:animationSlot.vramRefs}
			);
	
	
			// DISPLAY FUNCTIONS
			//
	
			let draw_bppTileset = function(tlst, ctx){
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				let pal = sharedEditorMem['pal'+bpp];
				if(tlst)
					gfx['draw_'+bpp+'bppTileset']?.(tlst,pal, 0,0, xtmax, ctx);
			};

			// tileset source files
			let display_tlstSrcFile = function(){
				let tlst = tilesetSlot.get_data__OLD();
				let ctx = tlstArea.elems.screen.tlst_srcFile.ctx;
				draw_bppTileset(tlst, ctx);
			};
	
			// animation source files
			let display_animSrcFile = function(){
				let tlst = animationSlot.get_data()[iAnimFile];
				let ctx =  tlstArea.elems.screen.anim_srcFile.ctx;
				draw_bppTileset(tlst, ctx);
			};
	
			// tileset buffer
			let display_tlstBuffer = function(){
				let tlst = TLST._buffer;
				let ctx =  tlstArea.elems.screen.tlst_buffer.ctx;
				draw_bppTileset(tlst, ctx);
			};
	
			// animations buffers[#]
			let display_animBuffers = function(){
				let tlst = TLST._buffers[iAnimFile];
				let ctx =  tlstArea.elems.screen.anim_buffer.ctx;
				draw_bppTileset(tlst, ctx);
			};
	
			// vram buffer
			let display_vram = function(){
				let tlst = TLST._vram;
				let ctx =  tlstArea.elems.screen.vram_buffer.ctx;
				draw_bppTileset(tlst, ctx);
			};
	
			// type
			let display_type = function({name, flag}){
				let ctx =  tlstArea.elems.screen.type_buffer.ctx;
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				let pal = sharedEditorMem['pal'+bpp];

				let type = TLST.type[name];
				if(type){
					if(flag === 'd')
						gfx.draw_decodedTileset(type,pal, 0,0, xtmax, ctx);
					if(flag === 'f')
						gfx.draw_formatedTileset(type,pal, 0,0, xtmax, ctx);
				}
			};
	
			let display_all = function(){
				display_tlstSrcFile();
				display_animSrcFile();
				display_tlstBuffer();
				display_animBuffers();
				display_vram();
				display_type(currentType);
			};

			// EVENT FUNCTIONS
			//
	
			
			// COLUMN 1 //
			
			// [UPDATE FROM FILE] tilset button : display source files
			tlstArea.elems.btn.tlst_displaySrcFile.onclick = function(){
				// draw tileset srcFile
				display_tlstSrcFile();
			};
	
			// [UPDATE FROM FILE] animation button : display source files[#]
			tlstArea.elems.btn.anim_displaySrcFile.onclick = function(){
				// draw animation srcFile
				display_animSrcFile();
			};
			
			
			// COLUMN 2 //
			
			// [###] animation input : file number
			tlstArea.elems.inum.anim_fileNum.oninput = function(){
				// change element value
				let value = parseInt(this.value) || 0;
				iAnimFile = Math.min(animFileCount-1, Math.max(0,value));
				this.value = iAnimFile;
	
				// update linked elements
				display_animSrcFile();
				display_animBuffers();
			};
	
			// [🡺] tileset/animation button : source files to buffer/buffers
			tlstArea.elems.btn.tlst_srcFileToBuffer.onclick = function(){
				TLST.init();
	
				// draw tileset buffer and animation buffers[#]
				display_tlstBuffer();
				display_animBuffers();
			};
			// [🡸] tileset/animation button : buffer/buffers to source files
			tlstArea.elems.btn.tlst_bufferToSrcFile.onclick = function(){
				TLST.write();
	
				// draw tileset buffer and animation buffers[#]
				display_tlstSrcFile();
				display_animSrcFile();
			};
	
			
			// COLUMN 3 //
			
			// [🡺] tileset button : buffer to vram
			tlstArea.elems.btn.tlst_bufferToVram.onclick = function(){
				TLST.load();
	
				// draw tileset vram
				display_vram();
			};
			// [🡸] tileset button : vram to buffer
			tlstArea.elems.btn.tlst_vramToBuffer.onclick = function(){
				TLST.vram(false);
	
				// draw tileset buffer
				display_tlstBuffer();
			};
	
			// [🡺] animation button : buffers[#] to vram
			tlstArea.elems.btn.anim_bufferToVram.onclick = function(){
				TLST.anim(iAnimFrame);
	
				// draw tileset buffer and animation buffers[#]
				display_vram();
			};
			// [🡸] animation button : vram to buffers[#]
			tlstArea.elems.btn.anim_vramToBuffer.onclick = function(){
				TLST.frame();
	
				// draw tileset buffer
				display_animBuffers();
			};
	
			
			// COLUMN 4 //
			
			// [###] animation input : frame number
			tlstArea.elems.inum.work_vramFrame.oninput = function(){
				let maxFrame = 8;
				// change element value
				let value = parseInt(this.value) || 0;
				iAnimFrame = Math.min(maxFrame-1, Math.max(0,value));
				this.value = iAnimFrame;
	
				// update linked elements
				TLST.anim(iAnimFrame);
				display_vram();
			};
	
			
			// COLUMN 5 //
			
			// [🡺] work botton : vram to type object
			tlstArea.elems.btn.work_vramToType.onclick = function(){
				TLST.update(
					'decoded2','decoded4','decoded8','formated2','formated4','formated8',
					'_4decoded2','_4decoded4','_4decoded8','_4formated2','_4formated4','_4formated8'
				);
	
				//display_type( (TLST.type['decoded'+bpp]), 'd' );
				//display_type( (TLST.type['_4decoded'+bpp]).n, 'd' );
				//display_type( (TLST.type['_4decoded'+bpp]).h, 'd' );
				//display_type( (TLST.type['_4decoded'+bpp]).v, 'd' );
				//display_type( (TLST.type['_4decoded'+bpp]).a, 'd' );
	
				//display_type( (TLST.type['formated'+bpp]), 'f' );
				//display_type( (TLST.type['_4formated'+bpp]).n, 'f' );
				//display_type( (TLST.type['_4formated'+bpp]).h, 'f' );
				//display_type( (TLST.type['_4formated'+bpp]).v, 'f' );
				//display_type( (TLST.type['_4formated'+bpp]).a, 'f' );
	
				miniEditor.set_type(currentType.name);
				
				display_type(currentType);
				_TLST = TLST; // debug
			};
	
			// [🡸] work botton : type object to vram
			tlstArea.elems.btn.work_typeToVram.onclick = function(){
				TLST.sync(currentType.name);
	
				display_vram();
			};
	
	
			// DEBUG
			window.debug_display = function(){
				let test = window.debug_display.test;
				if(test === 0) display_type( (TLST.type['decoded'+bpp]), 'd' );
				if(test === 1) display_type( (TLST.type['_4decoded'+bpp]).n, 'd' );
				if(test === 2) display_type( (TLST.type['_4decoded'+bpp]).h, 'd' );
				if(test === 3) display_type( (TLST.type['_4decoded'+bpp]).v, 'd' );
				if(test === 4) display_type( (TLST.type['_4decoded'+bpp]).a, 'd' );
	
				if(test === 5) display_type( (TLST.type['formated'+bpp]), 'f' );
				if(test === 6) display_type( (TLST.type['_4formated'+bpp]).n, 'f' );
				if(test === 7) display_type( (TLST.type['_4formated'+bpp]).h, 'f' );
				if(test === 8) display_type( (TLST.type['_4formated'+bpp]).v, 'f' );
				if(test === 9) display_type( (TLST.type['_4formated'+bpp]).a, 'f' );
				console.log("window.debug_display.test : ", window.debug_display.test);
	
				window.debug_display.test++;
				if(window.debug_display.test === 10) window.debug_display.test = 0;
			};
			window.debug_display.test = 0;
			// END : DEBUG
	
	
			// MINI EDITOR (TILESET)
			// left click : draw pixel with the shared color ID between the editors
			// middle click : get pixel color ID from tileset editor and show selected color ID in palette editor
			// hold right + middle click : sample tile from tileset editor
			// hold right + left click : wirte previous sampled tile in tileset editor
			let miniEditor = (function(){
	
				let o = {};

				let hoverPreview = tlstArea.elems.screen.type_buffer;

				let type = null;
				let setType = false;

				let iColor = 0;
				let xtp, ytp, iTile;

				let sample = (function(){
					let o;
					if(currentType.flag === 'd')
						o = new Uint8Array(64);
					if(currentType.flag === 'f'){
						o = new Array(8);
						for(let i=0; i<8; i++)
							o[i] = new Uint8Array(8);
					}
					return o; 
				})();
	
				let update_pos = function(xMousePos, yMousePos){
					let x = xMousePos, y = yMousePos;
					let xt = x >> 3 // div by 8
					let yt = y >> 3 // div by 8
					xtp = x - (xt<<3); // % 8
					ytp = y - (yt<<3); // % 8
					iTile = (yt * xtmax) + xt;
				};
	
				let get_pixel = function(){
					if(setType){
						if(currentType.flag === 'f')
							iColor = type[iTile][ytp][xtp];
						sharedEditorMem.update_FromTlstEditor(iColor);
					}
				};

				sharedEditorMem.update_FromPalEditor = function(val){
					iColor = val;
				};

				sharedEditorMem.display_allTlstViews = display_all;

				let put_pixel = function(){
					if(setType){
						if(currentType.flag === 'f')
							type[iTile][ytp][xtp] = iColor;
						display_type(currentType);
					}
				};

				let sample_tile = function(){
					if(setType){
						if(currentType.flag === 'f'){
							let tile = type[iTile];
							for(let r=0; r<8; r++)
							for(let p=0; p<8; p++)
								sample[r][p] = tile[r][p];
						}
					}
				};

				let write_tile = function(){
					if(setType){
						if(currentType.flag === 'f'){
							let tile = type[iTile];
							for(let r=0; r<8; r++)
							for(let p=0; p<8; p++)
								tile[r][p] = sample[r][p];
						}
						display_type(currentType);
					}
				};

				hoverPreview.elem.onmousemove = function(e){
					let pos = hoverPreview.get_mousePos(e);
					update_pos(pos.x,pos.y);
					if(e.buttons&0x1) put_pixel();
				};
	
				hoverPreview.elem.onmousedown = function(e){
					e.preventDefault();
					if((e.buttons&0x1) === 1) put_pixel(); // left click
					if((e.buttons&0x4) === 4) get_pixel(); // middle click
					if((e.buttons&0x6) === 6) sample_tile(); // right + middle click
					if((e.buttons&0x3) === 3) write_tile(); // right + left click
				};

				hoverPreview.elem.oncontextmenu = function(e){
					e.preventDefault();
					e.stopPropagation();
				};

				o.set_type = function(name){
					type = TLST.type[name];
					if(type) setType = true;
				};
	
				return o;
			})();
			
			// END : MINI EDITOR

		})();




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
