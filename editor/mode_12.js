
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
		
		
		
		let split_workspaceInto2Areas = function(){
			let A = document.createElement('div');
			let B = document.createElement('div');
			let C = document.createElement('div');

			let applyStyle_splittedWorkspaceArea = style => {
				style.display = "flex";
				style.width = "100%";
				style.height = "50%";
				style.border = "2px solid black";
				style.boxSizing = "border-box";
				style.whiteSpace = "nowrap";
			};
			
			applyStyle_splittedWorkspaceArea(A.style);
			A.style.border = "2px solid green";
			
			applyStyle_splittedWorkspaceArea(B.style);
			B.style.border = "2px solid yellow";

			C.style.border = "2px solid red";
			C.style.height = "100%";
			C.style.width = "100%";
			C.style.boxSizing = "border-box";

			C.appendChild(A);
			C.appendChild(B);
			
			return {upside : A, downside : B, parent : C};
		};

		let areas = split_workspaceInto2Areas();
		areas.upside.style.height = "30%";
		areas.downside.style.height = "70%";
		let palArea = areas.upside;
		let tsArea = areas.downside;
		workspace.elem.appendChild(areas.parent);

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
			o.view.style.backgroundSize = "10%";
			o.view.style.border = "2px solid red";
			return o;
		};

		let create_ioDisplay = function(w,h, s=1){
			let o = wLib.create_hoverPreview(w,h, s, undefined, 0, 0);
			
			o.elem.style.width = w * s;
			o.elem.style.height = h * s;

			o.view.style.backgroundColor = "black";
			o.view.style.backgroundImage = "url("+app.imgPack.alphaTex+")";
			o.view.style.backgroundSize = "10%";

			o.hoverBox.style.border = "2px solid red";
			return o;
		};

		let build_tilesetArea = function(xtmax, srcFileTileCount){

			// grid elem
			let grid = document.createElement('div');
			applyStyle_grid(grid.style);
			grid.style.gridTemplateColumns = "1fr 2fr 1fr 2fr 1fr 2fr 1fr 2fr";
			grid.style.gridTemplateRows = "1fr 4fr 4fr 1fr";
			
			// cell elems

			let columnPan_A1 = document.createElement('div');
			let columnPan_A2 = document.createElement('div');
			let columnPan_A3 = document.createElement('div');
			let columnPan_B1 = document.createElement('div');
			let columnPan_B2 = document.createElement('div');
			let columnPan_B3 = document.createElement('div');
			let columnPan_C1 = document.createElement('div');
			let columnPan_C2 = document.createElement('div');
			
			applyStyle_columnPanel(columnPan_A1.style);
			applyStyle_columnPanel(columnPan_A2.style);
			applyStyle_columnPanel(columnPan_A3.style);
			applyStyle_columnPanel(columnPan_B1.style);
			applyStyle_columnPanel(columnPan_B2.style);
			applyStyle_columnPanel(columnPan_B3.style);
			applyStyle_columnPanel(columnPan_C1.style);
			applyStyle_columnPanel(columnPan_C2.style);

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
			
			s = columnPan_A1.style;        s.gridColumn = "1 / span 1"; s.gridRow = "2 / span 1";
			s = gfxPan_ts_binprev.style;   s.gridColumn = "2 / span 1"; s.gridRow = "2 / span 1";
			s = columnPan_A2.style;        s.gridColumn = "3 / span 1"; s.gridRow = "2 / span 2"; // _2
			s = gfxPan_ts_buffer.style;    s.gridColumn = "4 / span 1"; s.gridRow = "2 / span 1";
			s = columnPan_A3.style;        s.gridColumn = "5 / span 1"; s.gridRow = "2 / span 1";
		 
			s = columnPan_B1.style;        s.gridColumn = "1 / span 1"; s.gridRow = "3 / span 1";
			s = gfxPan_anim_binprev.style; s.gridColumn = "2 / span 1"; s.gridRow = "3 / span 1";
			s = columnPan_B2.style;        s.gridColumn = "3 / span 1"; s.gridRow = "3 / span 1"; // _2
			s = gfxPan_anim_buffer.style;  s.gridColumn = "4 / span 1"; s.gridRow = "3 / span 1";
			s = columnPan_B3.style;        s.gridColumn = "5 / span 1"; s.gridRow = "3 / span 1";
		 
			s = columnPan_C1.style;        s.gridColumn = "6 / span 1"; s.gridRow = "1 / span 1";
			s = gfxPan_vram.style;         s.gridColumn = "6 / span 1"; s.gridRow = "2 / span 2";
			s = columnPan_C2.style;        s.gridColumn = "7 / span 1"; s.gridRow = "2 / span 2";
			s = gfxPan_type.style;         s.gridColumn = "8 / span 1"; s.gridRow = "2 / span 2";

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
			grid.appendChild(columnPan_A1);
			grid.appendChild(columnPan_A2);
			grid.appendChild(columnPan_A3);
			grid.appendChild(columnPan_B1);
			grid.appendChild(columnPan_B2);
			grid.appendChild(columnPan_B3);
			grid.appendChild(columnPan_C1);
			grid.appendChild(columnPan_C2);
			grid.appendChild(gfxPan_ts_binprev);
			grid.appendChild(gfxPan_ts_buffer);
			grid.appendChild(gfxPan_anim_binprev);
			grid.appendChild(gfxPan_anim_buffer);
			grid.appendChild(gfxPan_vram);
			grid.appendChild(gfxPan_type);

			// to cells connexion (input panel)
			columnPan_A1.appendChild(IO.btn.tlst_displaySrcFile);
			columnPan_A2.appendChild(IO.btn.tlst_srcFileToBuffer);
			columnPan_A2.appendChild(IO.btn.tlst_bufferToSrcFile);
			columnPan_A3.appendChild(IO.btn.tlst_bufferToVram);
			columnPan_A3.appendChild(IO.btn.tlst_vramToBuffer);

			columnPan_B1.appendChild(IO.btn.anim_displaySrcFile);
			columnPan_B2.appendChild(IO.inum.anim_fileNum);
			/* columnPan_B2.appendChild(IO.btn.anim_srcFileToBuffer);
			columnPan_B2.appendChild(IO.btn.anim_bufferToSrcFile); */
			columnPan_B3.appendChild(IO.btn.anim_bufferToVram);
			columnPan_B3.appendChild(IO.btn.anim_vramToBuffer);

			columnPan_C1.appendChild(IO.inum.work_vramFrame);

			columnPan_C2.appendChild(IO.btn.work_vramToType);
			columnPan_C2.appendChild(IO.btn.work_typeToVram);


			// to cells connexion (output panel)
			gfxPan_ts_binprev.appendChild(IO.screen.tlst_srcFile.elem);
			gfxPan_ts_buffer.appendChild(IO.screen.tlst_buffer.elem);

			gfxPan_anim_binprev.appendChild(IO.screen.anim_srcFile.elem);
			gfxPan_anim_buffer.appendChild(IO.screen.anim_buffer.elem);

			gfxPan_vram.appendChild(IO.screen.vram_buffer.elem);
			gfxPan_type.appendChild(IO.screen.type_buffer.hoverBox);


			return {grid:grid, elems:IO};
		};



		// process

		let bpp = 4;
		let xtmax = 16;
		let iAnimFile = 0;
		let iAnimFrame = 0;

		let tilesetSlot = srcFilePanel.tileset;
		let animationSlot = srcFilePanel.animation;

		let tlstDataAccess = tilesetSlot.get_dataWithOwnerAccess();
		let animDataAccess = animationSlot.get_dataWithOwnerAccess();

		let len = tlstDataAccess.length;
		let tlstSize = 0;
		for(let i=0; i<len; i++)
			tlstSize += tlstDataAccess[i].data.length;


		let animFileCount = animDataAccess.length;
		let animMaxSize = 0;
		for(let i=0; i<animFileCount; i++)
			animMaxSize = Math.max(animMaxSize, animDataAccess[i].data.length);


		let srcFileMaxSize = Math.max(tlstSize, animMaxSize);
		let maxTileCount = {2:srcFileMaxSize>>4, 4:srcFileMaxSize>>5, 8:srcFileMaxSize>>6}[bpp];

		let tlstArea = build_tilesetArea(xtmax, maxTileCount);

		tsArea.appendChild(tlstArea.grid);


		let pal = app.gfx.defaultPalettes[1];
		let _pal = app.gfx.defaultPalettes;
		let pal256 = _pal[0].concat(_pal[1]).concat(_pal[2]).concat(_pal[3]).
					concat(_pal[4]).concat(_pal[5]).concat(_pal[6]).concat(_pal[7]);
		pal256 = pal256.concat(pal256);



		let TLST = app.component.Tileset(
			//{ownerRefs:tilesetSlot.get_dataWithOwnerAccess(), byteOffset:0, vramOffset:tilesetSlot.vramRefs?.[0]?.offset || 0},
			{ownerRefs:tilesetSlot.get_dataWithOwnerAccess(), byteOffset:0, vramOffset:0},
			bpp,
			{ownerRefs:animationSlot.get_dataWithOwnerAccess(), vramRefs:animationSlot.vramRefs},
		);


		// DISPLAY FUNCTIONS
		//

		// tileset source files
		let display_tlstSrcFile = function(){
			let tlst = tilesetSlot.get_data__OLD();
			let ctx = tlstArea.elems.screen.tlst_srcFile.ctx;
			ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			if(bpp === 2){
				let pal = app.gfx.defaultPalettes[1];
				gfx.draw_2bppTileset(tlst,pal, 0,0, xtmax, ctx);
			}
			if(bpp === 4){
				let pal = app.gfx.defaultPalettes[1];
				gfx.draw_4bppTileset(tlst,pal, 0,0, xtmax, ctx);
			}
			if(bpp === 8){
				gfx.draw_8bppTileset(tlst,pal256, 0,0, xtmax, ctx);
			}
		};

		// animation source files
		let display_animSrcFile = function(){
			let tlst = animationSlot.get_data()[iAnimFile];
			let ctx =  tlstArea.elems.screen.anim_srcFile.ctx;
			ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			if(bpp === 2){
				gfx.draw_2bppTileset(tlst,pal, 0,0, xtmax, ctx);
			}
			if(bpp === 4){
				gfx.draw_4bppTileset(tlst,pal, 0,0, xtmax, ctx);
			}
			if(bpp === 8){
				gfx.draw_8bppTileset(tlst,pal256, 0,0, xtmax, ctx);
			}
		};

		// tileset buffer
		let display_tlstBuffer = function(){
			let tlst = TLST._buffer;
			let ctxTlst =  tlstArea.elems.screen.tlst_buffer.ctx;
			ctxTlst.clearRect(0,0,ctxTlst.canvas.width,ctxTlst.canvas.height);
			if(bpp === 2){
				gfx.draw_2bppTileset(tlst,pal, 0,0, xtmax, ctxTlst);
			}
			if(bpp === 4){
				gfx.draw_4bppTileset(tlst,pal, 0,0, xtmax, ctxTlst);
			}
			if(bpp === 8){
				gfx.draw_8bppTileset(tlst,pal256, 0,0, xtmax, ctxTlst);
			}
		};

		// animations buffers[#]
		let display_animBuffers = function(){
			let anim = TLST._buffers[iAnimFile];
			let ctxAnim =  tlstArea.elems.screen.anim_buffer.ctx;
			ctxAnim.clearRect(0,0,ctxAnim.canvas.width,ctxAnim.canvas.height);
			if(bpp === 2){
				gfx.draw_2bppTileset(anim,pal, 0,0, xtmax, ctxAnim);
			}
			if(bpp === 4){
				gfx.draw_4bppTileset(anim,pal, 0,0, xtmax, ctxAnim);
			}
			if(bpp === 8){
				gfx.draw_8bppTileset(anim,pal256, 0,0, xtmax, ctxAnim);
			}
		};

		// vram buffer
		let display_vram = function(){
			let vram = TLST._vram;
			let ctx =  tlstArea.elems.screen.vram_buffer.ctx;
			ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			if(bpp === 2){
				gfx.draw_2bppTileset(vram,pal, 0,0, xtmax, ctx);
			}
			if(bpp === 4){
				gfx.draw_4bppTileset(vram,pal, 0,0, xtmax, ctx);
			}
			if(bpp === 8){
				gfx.draw_8bppTileset(vram,pal256, 0,0, xtmax, ctx);
			}
		};

		// type
		let display_type = function(typeObj, typeFlag){
			let ctx =  tlstArea.elems.screen.type_buffer.ctx;
			ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			let palette = bpp === 8 ? pal256 : pal;
			if(typeFlag === 'd')
				gfx.draw_decodedTileset_NEW(typeObj,palette, 0,0, xtmax, ctx);
			if(typeFlag === 'f')
				gfx.draw_formatedTileset(typeObj,palette, 0,0, xtmax, ctx);
		};

		//////////////
		// COLUMN 1 //
		//////////////

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
		
		//////////////
		// COLUMN 2 //
		//////////////

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

		//////////////
		// COLUMN 3 //
		//////////////

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

		//////////////
		// COLUMN 4 //
		//////////////

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

		//////////////
		// COLUMN 5 //
		//////////////

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

			start_miniEditor();

			_TLST = TLST;
		};

		// [🡸] work botton : type object to vram
		tlstArea.elems.btn.work_typeToVram.onclick = function(){
			TLST.sync(miniEditor_currentType);

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


		// MINI EDITOR (test)
		let miniEditor_currentType = 'formated'+bpp;
		let miniEditor_typeFlag = 'f';
		let start_miniEditor = function(){

			let hoverPreview = tlstArea.elems.screen.type_buffer;
			let type = TLST.type[miniEditor_currentType];
			let iColor = 0;
			let xtp, ytp, iTile;

			let update_pos = function(xMousePos, yMousePos){
				let x = xMousePos, y = yMousePos;
				let xt = x >> 3 // div by 8
				let yt = y >> 3 // div by 8
				xtp = x - (xt<<3); // % 8
				ytp = y - (yt<<3); // % 8
				iTile = (yt * xtmax) + xt;
			};

			let get_pixel = function(){
				iColor = type[iTile][ytp][xtp];
			};
			let put_pixel = function(){
				type[iTile][ytp][xtp] = iColor;
				display_type(type, miniEditor_typeFlag);
			};

			tlstArea.elems.screen.type_buffer.hoverBox.onmousemove = function(e){
				let pos = hoverPreview.get_mousePos(e);
				update_pos(pos.x,pos.y);
				if(e.buttons&0x1) put_pixel();
			};

			tlstArea.elems.screen.type_buffer.hoverBox.onmousedown = function(e){
				e.preventDefault();
				if(e.buttons&0x1) put_pixel();
				if(e.buttons&0x4) get_pixel();
			};

		};
		// END : MINI EDITOR


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
