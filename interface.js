

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
			this.init_editModePanel("30%");//90%
		
			this.make_workspace();
			this.init_workspace();
			
			this.make_srcFilePanel();
			this.init_srcFilePanel("40%");//90%
		
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
		
			if(this.workspace.current) this.workspace.current.close();

			this.workspace.list_generator[ref](editModeParams);
			
			this.workspace.current.update('reset');
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

			let slots = {
				rom          : "DECOMPRESSED ROM :",
				palette      : "PALETTE :",
				tileset      : "TILESET :",
				bgtileset    : "BG TILESET :",
				animation    : "ANIMATED TILESET :",
				bganimation  : "ANIMATED BG TILESET :",
				background   : "BG TILEMAP :",
				mapchip      : "MAPCHIP (8x8 TILEMAP) :",
				tilemap      : "LEVEL TILEMAP (32x32) :",
				collisionmap : "COLLISION MAP :"
			};
		
			let list_dkc2FileSlot = [];

			for(slotName in slots){
				this.srcFilePanel[slotName] = this.create_srcFileSlot(slotName, slots[slotName]);
				this.srcFilePanel[slotName].add(this.srcFilePanel.elem);
				list_dkc2FileSlot.push(this.srcFilePanel[slotName]);
			}

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
		
		this.create_srcFileSlot = function(name, labelText){
		
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
			label.textContent = labelText;
			
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
			o.htmlInput = htmlInput;
			o.decompressionState = decompressionState;
			o.parameters = parameters;
			
			o.name = name;

			o.multi = 0;
			o.index = 0;
			//o.useDec = [false];
			
			o.fileData = [];
			o.decompressed = [];

			o.names = [];
			o.useDec = [];

			o.romRefs = [];
			o.vramRefs = [];
			
			let defFile = {name:'', data:[], useDec:false, romRef:null, vramRef:null};
			o.set_oneDataFile = function(file=defFile, last=false){
				
				if(o.multi === 0)
					o.fileIndex.disabled = false;
				
				let index = o.index;

				o.fileData[index] = file.data;

				o.decompressed[index] = app.decompressor(file.data);
				o.useDec[index] = file.useDec;

				o.names[index] = file.name;

				o.romRefs[index] = file.romRef || null;
				o.vramRefs[index] = file.vramRef || null;

				if(o.multi === index) o.multi++;

				if(!last) o.index++;

				// update
				if(last){
					o.fileIndex.max = o.multi;
					o.fileIndex.value = index;
				
					o.setText_fileArea();
					o.setText_fileInfo();
					
					o.setText_decompressionState();
					
					//check_forUpdate(o.name);
					// todo : update chain trigger system
				}
			};

			o.setText_fileArea = function(){
				let index = o.index;
				
				if(index < o.multi){
					o.fileArea.textContent = o.names[index];
				}else{
					o.fileArea.textContent = "%file name";
				}
			};
			
			o.setText_fileInfo = function(){
				let index = o.index;
				
				if(index < o.multi){
					let size = o.fileData[index].length;
					o.fileInfo.textContent = "size : " + size + " " + app.lib.get_hexToStr(size,"0x");
				}else{
					o.fileInfo.textContent = "file info";
				}
			};
		
			o.setText_decompressionState = function(){
			
				let ON  = "[O] use decompression";
				let OFF = "[ ] use decompression";
				
				let index = o.index;
				
				if(index < o.multi){
					let txt = o.useDec[index] ? ON : OFF;
					
					let size = o.decompressed[index].length;
					txt += "\n" + "size : " + size + " " + app.lib.get_hexToStr(size,"0x");
					o.decompressionState.textContent = txt;
				}else{
					o.decompressionState.textContent = OFF;
				}
			
			};

			o.get_data__OLD = function(){
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

			o.get_data = function(){
				let _o = [];
				let len = o.multi;
				for(let i=0; i<len; i++)
					_o.push( o.useDec[i] ? o.decompressed[i] : o.fileData[i] );
				return _o;
			};

			/* o.get_dataWithOwnerAccess_OLD = function(){
				let _o = [];
				let len = o.multi;
				for(let i=0; i<len; i++)
					_o.push( o.useDec[i]
						? {data:o.decompressed[i], owner:o.decompressed, prop:i}
						: {data:o.fileData[i], owner:o.fileData, prop:i}
					);
				return _o;
			}; */

			let OwnerAccess = function(owner, prop){
				return {
					get data() {return owner[prop]},
					set data(v) {owner[prop] = v},
				};
			}

			o.get_dataWithOwnerAccess = function(){
				let _o = [];
				let len = o.multi;
				for(let i=0; i<len; i++)
					_o.push( o.useDec[i]
						? OwnerAccess(o.decompressed, i)
						: OwnerAccess(o.fileData, i)
					);
				return _o;
			};
			//set current(name) { this.log.push(name); },

			o.get_totalSize = function(){
				let len = o.multi;
				let size = 0;
				for(let i=0; i<len; i++)
					size += o.useDec[i] ? o.decompressed[i].length : o.fileData[i].length;
				return size;
			};

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
		
			let slots = {
				test_  : ["rom manager",                  'mode_',  null],
				test0  : ["palette displayer",            'mode0',  ['wearethere','butalwaysnotused']],
				test1  : ["tileset displayer",            'mode1',  null],
				test2  : ["mapchip displayer",            'mode2',  null],
				test3  : ["background displayer",         'mode3',  null],
				test4  : ["level tilemap displayer",      'mode4',  ['something','whatyouwant']],
				test5  : ["test selection",               'mode5',  null],
				test6  : ["test collisionmap",            'mode6',  null],
				test7  : ["test 4formatedTileset",        'mode7',  null],
				test8  : ["test create_mapchipGfxBuffer", 'mode8',  null],
				test9  : ["test animated background",     'mode9',  null],
				test10 : ["test PALETTE type & ext func", 'mode10', null],
				test11 : ["test TILESET type",            'mode11', null],
				test12 : ["test types",                   'mode12', null]

			};

			let list_editModeSlot = [];

			for(slotName in slots){
				let slot = slots[slotName];
				this.editModePanel[slotName] = this.create_editModeSlot(slot[0], slot[1], slot[2]);
				this.editModePanel[slotName].add(this.editModePanel.elem);
				list_editModeSlot.push(this.editModePanel[slotName]);
			}
		
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
			
		// rom
		workspace.list_generator['mode_'] = app.mode['ROM'];

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

		// selection test
		workspace.list_generator['mode5'] = app.mode[5];
		
		// collisionmap
		workspace.list_generator['mode6'] = app.mode[6];

		// test 4formatedTileset
		workspace.list_generator['mode7'] = app.mode[7];
		
		// test create_mapchipGfxBuffer
		workspace.list_generator['mode8'] = app.mode[8];

		// test animated background
		workspace.list_generator['mode9'] = app.mode[9];

		// test PALETTE component types update/draw func & gfx ext func
		workspace.list_generator['mode10'] = app.mode[10];
		
		// test TILESET component and vram for now
		workspace.list_generator['mode11'] = app.mode[11];

		// test 
		workspace.list_generator['mode12'] = app.mode[12];
	};
	
	return o;
})();

