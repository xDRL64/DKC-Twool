dkc2ldd.WorkspaceToolPack = (function(){

    console.log('start WorkspaceToolPack');

    // EDIT TOOL PACK SETTINGS

    // path from root page to script toolpack folder
    let packLoaderPath = "./WorkspaceToolPack/";

    // App objet name
    let globalMainJsObjectName = 'dkc2ldd';

    // Toolpack object name
    let toolPackName = 'WorkspaceToolPack';

    let appDataTransferScriptTagPropName = 'WebApp_NON_STANDARD_PROPERTY_nameChain';

    // TODO : location : +'masterObject'
    // each entry has :
    //     path               : from toolpack folder to each script to load
    //     location           : 'toolpack' or 'mainobject' or if not 'global' (by default)
    //     ownParentNameChain : for example 'parentObj.prentObj.Obj' or just 'Obj'
    let scriptList = [
        // {path:'/betaDev/examples/myExample.js', location:'toolpack', ownParentNameChain:'AllExmplObj.myExObj'}
        {path:'/betaDev/HtmlHexInput/HexInput.js', location:'toolpack', ownParentNameChain:'HexInput'},
    ];

    // DO NOT EDIT /////////////////////////////////////////////////////////////////////

    let baseStorageNameChain = globalMainJsObjectName + '.' + toolPackName;

    let entry, script, nameChain

    for(entry of scriptList){
        script = document.createElement("script");
        script.setAttribute("defer", true);
        nameChain = entry.location==='mainobject'? globalMainJsObjectName+'.' : '';
        nameChain = entry.location==='toolpack'? baseStorageNameChain+'.' : '';
        nameChain += entry.ownParentNameChain;
        script[appDataTransferScriptTagPropName] = nameChain;
        document.head.appendChild(script);
        script.src = packLoaderPath + entry.path;
    }

    let o = {};

    console.log('end WorkspaceToolPack');

    return o;
})();