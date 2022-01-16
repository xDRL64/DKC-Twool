

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
		
		// create CSS sheet
		this.create_styleManager = function(){

			let elem = document.createElement("style");
			document.head.appendChild(elem);
			let sheet = elem.sheet;

			this.addCSS = function(selector, propList){
				let rule = selector + ' {\n';
				for(let i=0, len=propList.length; i<len; i++)
					rule += '\t' + propList[i] + ';\n';
				rule += '}\n\n';
				sheet.insertRule(rule);
			};

		};

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
		
			// methods

			this.srcFilePanel.check_slot = function(){
				let o = true;
				for(let i=0, len=arguments.length; i<len; i++){
					o &= this[arguments[i]].multi > 0;
				}
				return o;
			};
			

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
			fileIndex.style.whiteSpace = "nowrap";
			fileIndex.style.backgroundColor = "#ffaaaa";
			fileIndex.style.border = "none";
			fileIndex.placeholder = "index (multi files)";
			
			let fileArea = document.createElement("div");
			fileArea.style.position = "relative";
			fileArea.style.width = "80%";
			fileArea.style.whiteSpace = "nowrap";
			fileArea.style.backgroundColor = "#ddddff";
			fileArea.textContent = "file name";
			
			let importButton = document.createElement("div");
			importButton.style.position = "relative";
			importButton.style.width = "10%";
			importButton.style.whiteSpace = "nowrap";
			importButton.style.backgroundColor = "#ffeecc";
			importButton.textContent = "Imp";
			
			let exportButton = document.createElement("div");
			exportButton.style.position = "relative";
			exportButton.style.width = "10%";
			exportButton.style.whiteSpace = "nowrap";
			exportButton.style.backgroundColor = "#bbffcc";
			exportButton.textContent = "Exp";
			
			let fileInfo = document.createElement("div");
			fileInfo.style.position = "relative";
			fileInfo.style.width = "100%";
			fileInfo.style.whiteSpace = "nowrap";
			fileInfo.style.backgroundColor = "#aaddff";
			fileInfo.textContent = "file info";
		
			let decompressionState = document.createElement("div");
			decompressionState.style.position = "relative";
			decompressionState.style.width = "100%";
			decompressionState.style.whiteSpace = "pre";
			decompressionState.style.backgroundColor = "#eeffcc";
			decompressionState.textContent = "[ ] use decompression";
			
			let parameters = document.createElement("input");
			parameters.type = "text";
			parameters.style.position = "relative";
			parameters.style.width = "100%";
			parameters.style.whiteSpace = "pre";
			parameters.style.backgroundColor = "#ffddaa";
			parameters.style.border = "none";
			parameters.placeholder = "parameters";
			
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
		
			this.editModePanel.test0 = this.create_editModeSlot("palette displayer", 'mode0');
			this.editModePanel.test0.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test0;
			
			this.editModePanel.test1 = this.create_editModeSlot("tileset displayer", 'mode1');
			this.editModePanel.test1.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test1;
		
			this.editModePanel.test2 = this.create_editModeSlot("mapchip displayer", 'mode2');
			this.editModePanel.test2.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test2;
			
			this.editModePanel.test3 = this.create_editModeSlot("background displayer", 'mode3');
			this.editModePanel.test3.add(this.editModePanel.elem);
			list_editModeSlot[list_editModeSlot.length] = this.editModePanel.test3;
			
			this.editModePanel.test4 = this.create_editModeSlot("level tilemap displayer", 'mode4', ["p0",2,[3.4,"5"]]);
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
		
			let elem = document.createElement("div");
			elem.style.position = "relative";
			elem.style.width = "100%";
			elem.style.whiteSpace = "nowrap";
			elem.style.margin = "0 0 8 0";
			elem.style.backgroundColor = "#cceeff";
			elem.style.border = "1px solid black";
			elem.style.padding = "4 0 4 4";
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
		
		this.create_styleManager(); // at first

		this.make_mainArea();
		this.init_mainArea();
	
	};
	
	o.start_workspace = function(){
	
		let workspace = this.workspace;

		workspace.list_generator = [];
			
		// palette
		workspace.list_generator['mode0'] = app.mode[0];
		
		// tileset
		workspace.list_generator['mode1'] = app.mode[1];
		
		// mapchip
		workspace.list_generator['mode2'] = app.mode[2];
		
		// bg tilemap
		workspace.list_generator['mode3'] = app.mode[3];
		
		// level tilemap
		workspace.list_generator['mode4'] = app.mode[4];
		
	};
	
	return o;
})();

