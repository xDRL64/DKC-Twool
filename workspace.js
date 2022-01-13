dkc2ldd.workspace = (function(app=dkc2ldd){

    let o = {};

    o.create_cursor = function(parent, w, h, s, border=1, elemBorder){
		
        let o = {};
    
        let wSize = w * s;
        let hSize = h * s;
    
        // private elem
        let elem = document.createElement("div");
        elem.style.position = "absolute";
        elem.style.display = "block";
        elem.style.width = wSize;
        elem.style.height = hSize;
        elem.style.borderStyle = "solid";
        elem.style.borderWidth = border;
        elem.style.pointerEvents = "none";
        elem.style.borderColor = "red";

        parent.appendChild(elem);
        
        // public mothods
        o.pixMove = function(x,y){
            elem.style.left = (x*s) - border;
            elem.style.top  = (y*s) - border;
        };
        
        o.gridMove = function(x,y){
            elem.style.left = (wSize*x) - border;
            elem.style.top  = (hSize*y) - border;
        };
        
        o.elemMove = function(x,y){
            if(elemBorder){
                elem.style.left = (((elemBorder*2)+wSize) * x) - (border-elemBorder);
                elem.style.top  = (((elemBorder*2)+hSize) * y) - (border-elemBorder);
            }
        };
        
        o.setColor = function(c){
            elem.style.borderColor = c;
        };
        
        o.setVisible = function(v){
            elem.style.display = v ? "block" : "none";
        };
        
        o.setBorderSize = function(size){
        
            let outSide = size > 0;
        
            if(outSide){
                border = size;
                elem.style.borderWidth = size;
                elem.style.boxSizing = "content-box";
            }else{
                border = 0;
                elem.style.borderWidth = Math.abs(size);
                elem.style.boxSizing = "border-box";
            }
        };
        
        return o;
    };

    o.create_canvas = function(wPix, hPix, wSize, hSize){
        let elem = document.createElement("canvas");
        
        elem.width = wPix;
        elem.height = hPix;
        elem.style.position = "relative";
        elem.style.display = "inline-block";
        elem.style.width = wSize;
        elem.style.height = hSize;
        elem.style.imageRendering = "pixelated";

        return elem;
    };

    o.create_preview = function(w,h, s, cursors, border=0){
		
        let _o = this;

        let wSize = w * s;
        let hSize = h * s;
    
        let elem = document.createElement("div");
        elem.style.position = "relative";
        elem.style.display = "inline-block";
        elem.style.border = border + "px solid black";
        
        let view = _o.create_canvas(w,h, wSize,hSize);
        let ctx = view.getContext("2d");
        
        elem.appendChild(view);
        
        // add cursor as last child
        let cursor = {};
        if(cursors !== undefined){
            for(let i=0; i<cursors.length; i++){
                cursor[ cursors[i][0] ] = _o.create_cursor(elem, cursors[i][1],cursors[i][2], s, cursors[i][3]);
            }
        }
        
        return {elem:elem, view:view, ctx:ctx, cursor:cursor};
    };

    o.get_offsetXY = function(event, area){

        let elem = area.elem;

        let s = getComputedStyle(elem);
        let rect = elem.getBoundingClientRect();
        
        let left = Math.floor(rect.left);
        let top = Math.floor(rect.top);

        let mLeft = parseInt(s.marginLeft);
        let bLeft = parseInt(s.borderLeftWidth);
        let pLeft = parseInt(s.paddingLeft);
        let _left = bLeft + pLeft;
        
        let mTop = parseInt(s.marginTop);
        let bTop = parseInt(s.borderTopWidth);
        let pTop = parseInt(s.paddingTop);
        let _top = bTop + pTop;
        
        let x = event.clientX;
        let y = event.clientY;
        
        x = x - left - _left;
        y = y - top - _top;
        
        let w = area.W * area.S;
        let h = area.H * area.S;
        
        area.xPos = x<0 ? 0 : x<w? x : w-1;
        area.yPos = y<0 ? 0 : y<h? y : h-1;
        
        area._left = mLeft + bLeft + pLeft;
        area._top = mTop + bTop + pTop;
        
        return {x: area.xPos, y: area.yPos};
    };

    o.create_hoverPreview = function(w,h, scale, cursors, border, hoverPadding=1){
		
        let _o = this;

        let o =  _o.create_preview(w, h, scale, cursors, border);
        
        o.view.style.pointerEvents = "none";
        
        // get_offsetXY function properties
            o.W = w;
            o.H = h;
            o.S = scale;
            o._left = 0;
            o._top = 0;
            o.xPos = 0;
            o.yPos = 0;
            
        o.hoverBox = document.createElement("div");
        o.hoverBox.style.width = "fit-content";
        o.hoverBox.style.height = "fit-content";
        o.hoverBox.style.padding = hoverPadding;
        
        o.hoverBox.appendChild(o.elem);
    
        o.get_mousePos = function(mouseEvent){
            return _o.get_offsetXY(mouseEvent, o);
        };
    
        o.init = function(parent){
            parent.appendChild(o.hoverBox);
        };
        
        return o;
    };

    o.create_4previewPanel = function(wPrev, hPrev, scale, cursors){
		
        let _o = this;

        let o = {};
    
        let wPrevSize = wPrev * scale;
        let hPrevSize = hPrev * scale;
        
        let prevBordSize = 1;
    
        // panel
        o.elem = document.createElement("div");
        o.elem.style.position = "relative";
        o.elem.style.display = "inline-block";
        o.elem.style.width = "fit-content";
        o.elem.style.height = "fit-content";
        o.elem.style.maxWidth = (wPrevSize+(prevBordSize*2)) * 2;
        o.elem.style.maxHeight = (hPrevSize+(prevBordSize*2)) * 2;
        o.elem.style.whiteSpace = "normal";
        o.elem.style.border = "1px solid black";
    
        // preview
        o.nFlip = _o.create_preview(wPrev, hPrev, scale, cursors, prevBordSize);
        o.hFlip = _o.create_preview(wPrev, hPrev, scale, cursors, prevBordSize);
        o.vFlip = _o.create_preview(wPrev, hPrev, scale, cursors, prevBordSize);
        o.aFlip = _o.create_preview(wPrev, hPrev, scale, cursors, prevBordSize);
    
        // add
        o.elem.appendChild(o.nFlip.elem);
        o.elem.appendChild(o.hFlip.elem);
        o.elem.appendChild(o.vFlip.elem);
        o.elem.appendChild(o.aFlip.elem);
    
        // panel cursor
        let cursorBorder = 1;
        o.cursor = _o.create_cursor(o.elem, wPrev,hPrev, scale, cursorBorder, prevBordSize);
    
        o.set_prevCurVisible = function(n, h, v, a){
            let names = Object.getOwnPropertyNames(o.nFlip.cursor);
            let name;
            for(let i=0; i<names.length; i++){
                name =  names[i];
                o.nFlip.cursor[ name ].setVisible(n);
                o.hFlip.cursor[ name ].setVisible(h);
                o.vFlip.cursor[ name ].setVisible(v);
                o.aFlip.cursor[ name ].setVisible(a);
            }
        };
        
        return o;
    };


    return o;

})();