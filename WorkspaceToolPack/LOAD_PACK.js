(function(){

    // each entry has :
    //     path               : from toolpack folder to each script to load
    //     location           : 'scriptpack' or 'mainobject' or if not 'global' (by default)
    //     ownParentNameChain : for example 'parentObj.prentObj.Obj' or just 'Obj'
    let scriptList = [
        // {path:'/betaDev/examples/myExample.js', location:'mainobject', ownParentNameChain:'AllExmplObj.myExObj'}
        {path:'/betaDev/HtmlHexInput/HexInput.js', location:'scriptpack', ownParentNameChain:'HexInput'},
        {path:'/betaDev/DropList.js', location:'scriptpack', ownParentNameChain:'DropList'},
    ];

    let parameters = {
        packLoaderPath : "./WorkspaceToolPack/",
        globalMainJsObjectName : 'dkc2ldd',
        scriptPackName : 'WorkspaceToolPack',
        appDataTransferScriptTagPropName : undefined,
        scriptList : scriptList,
    }

    dkc2ldd.ScriptPackLoader.loader(parameters);
})();
