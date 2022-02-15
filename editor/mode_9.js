
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 9 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "mode 9";

		// current workspace object
		let o = {};

		// code ...

		// update
		o.update = function(trigger){

		};

		// close
		o.close = function(){
			// app.mode[ 9 ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();
