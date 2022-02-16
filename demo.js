
(function(app=dkc2ldd){

    let params = new URLSearchParams(location.search);
    let p = params;

    if(p.has('preload') && p.get('preload')==='rom'){
        app.interface.srcFilePanel.rom.set_oneDataFile(
            {name:'decompressed U1.0 rom.smc', data:dkc2debug.preload.decompressedRom, useDec:false}, true
        );
    }

    if(p.has('demo') && p.get('demo')==='animated'){

        // set file data
        app.interface.update_workspace('mode_');
        
        // show mapchip with animated tileset
        app.interface.srcFilePanel.mapchip.parameters.value = "vram=1";
        app.interface.update_workspace('mode2');

        // hide side panels
        let fakeEvent = {stopPropagation:function(){},preventDefault:function(){}};
        app.event.slide_panel(fakeEvent, app.interface.srcFilePanel);
        app.event.slide_panel(fakeEvent, app.interface.editModePanel);
    
    }

})();



