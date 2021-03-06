

dkc2ldd.event = (function(app=dkc2ldd){


	let o = {};

	let disable_dropFileEffect = function(e){
		e.stopPropagation();
		e.preventDefault();
	}
	
	let enable_dropFileEffect = function(e){
		e.stopPropagation();
		e.preventDefault();
		
		e.dataTransfer.dropEffect = 'copy';
	}
	
	let slide_panel = function(e, panel){
		e.stopPropagation();
		e.preventDefault();
		
		panel.isOpen = !panel.isOpen;
		
		if(panel.isOpen)
			panel.slideBoard.style.width = panel.width;
		else
			panel.slideBoard.style.width = "0%";
	};
	o.slide_panel = slide_panel;
	

	let set_fileIndex = function(slot, index){
	
		slot.index = index;
		slot.fileIndex.value = index;

		slot.setText_fileArea();
		slot.setText_fileInfo();
		
		slot.setText_decompressionState();

	};
	
	let input_fileIndex = function(e, slot){
	
		let val = parseInt(slot.fileIndex.value) || 0; // prevent NaN
		val = val>slot.multi ? slot.multi : val;
		val = val<0 ? 0 : val;
		set_fileIndex(slot, val);
	};

	let load_file = function(fileRef, slot, last){
		
		let reader = new FileReader();
		
		reader.onloadend = function(e){
			if (e.target.readyState === FileReader.DONE){
				let binStr = e.target.result;
				let size = binStr.length;
				let data = new Uint8Array(size);
				
				for(let i=0; i<size; i++)
					data[i] = binStr.charCodeAt(i);
				
				let binFile = {name:fileRef.name, data:data, useDec:false};
				slot.set_oneDataFile(binFile, last);

				// update
				if(last) check_forUpdate(slot.name);
			}
		};
		reader.readAsBinaryString(fileRef);
	};
	
	let get_file = function(slot, files){

		let len = files.length;
		let end = len - 1;
		let isLast;
		for(let i=0; i<len; i++){
			isLast = (i === end);
			load_file(files[i], slot, isLast);
		}

	};


	let drop_file = function(e, slot){
		e.stopPropagation();
		e.preventDefault();
	
		get_file(slot, e.dataTransfer.files);

	};
	
	let open_fileBrowser = function(e, slot){
		e.stopPropagation();
		e.preventDefault();
		
		slot.htmlInput.click();
	};
	
	let selected_file = function(e, slot){
		//load_file(slot.htmlInput.files[0], slot);
		get_file(slot, slot.htmlInput.files);
	};

	let toggle_useDecompression = function(e, slot){
	
		e.stopPropagation();
		e.preventDefault();
	
		if(slot.multi !== 0){
		
			let index = slot.index;
		
			slot.useDec[index] = !slot.useDec[index];

			slot.setText_decompressionState();
			
			if(slot.multi > 0)
				slot.fileIndex.focus();

			check_forUpdate(slot.name);
		}
	};
	
	let check_forUpdate = function(slotName){
		
		// check update for workspace
		if(app.interface.workspace.current !== undefined)
			app.interface.workspace.current.update(slotName);
	};
	
	o.setEvent_srcFilePanel = function(){
	
		// main area (whole app)
		
		let mainArea = app.interface.mainArea;
		
		mainArea.elem.addEventListener("dragover", disable_dropFileEffect);
		mainArea.elem.addEventListener("drop", disable_dropFileEffect);
			
		// panel handle (source file panel)
		
		let srcFilePanel = app.interface.srcFilePanel;
		srcFilePanel.handle.addEventListener("click", (function(e){slide_panel(e, srcFilePanel);}) );
		
		// source file panel (all file slots)
		
		let len = app.interface.srcFilePanel.list_dkc2FileSlot.length;

		for(let i=0; i<len; i++){
			let fileSlot = app.interface.srcFilePanel.list_dkc2FileSlot[i];
			
			// file index (set input events)
			fileSlot.fileIndex.addEventListener("input", (function(e){input_fileIndex(e,fileSlot);}) );
			
			// file area (set drag and drop events)
			fileSlot.fileArea.addEventListener("dragover", (function(e){enable_dropFileEffect(e);}) );
			fileSlot.fileArea.addEventListener("drop", (function(e){drop_file(e,fileSlot);}) );
			
			// import button (set click events)
			fileSlot.importButton.addEventListener("click", (function(e){open_fileBrowser(e,fileSlot);}) );
			fileSlot.htmlInput.addEventListener("change", (function(e){selected_file(e,fileSlot);}) );
			
			// decompression state (set click events)
			fileSlot.decompressionState.addEventListener("click", (function(e){toggle_useDecompression(e,fileSlot);}) );
			
		}
		
	};
	
	let change_editMode = function(e, slot){
	
		app.interface.update_workspace(slot.workspaceRef, slot.params);
	
	};
	
	o.setEvent_editModePanel = function(){
		
		// panel handles (edit mode panel)
		
		let editModePanel = app.interface.editModePanel;
		editModePanel.handle.addEventListener("click", (function(e){slide_panel(e, editModePanel);}) );
		
		// edit mode panel (all edit mode buttons)
		
		let len = app.interface.editModePanel.list_editModeSlot.length;
		
		for(let i=0; i<len; i++){
		
			let modeSlot = app.interface.editModePanel.list_editModeSlot[i];
			
			modeSlot.elem.addEventListener("click", (function(e){change_editMode(e,modeSlot);}) );
		
		}
	
	};

	return o;

})();

