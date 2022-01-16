
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ /**/put new mode id/**/ ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

        // empty workspace (to empty html child elements)
        workspace.elem.textContent = "";

        // current workspace object
        let o = {};

        // code ...

        // update
        o.update = function(trigger){

        };

        // connect current workspace object (export update methode)
        workspace.current = o;

    };

})();
