
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ 5 ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

        // empty workspace (to empty html child elements)
        workspace.elem.textContent = "";

        let xmlns = 'http://www.w3.org/2000/svg';
        let svg = document.createElementNS(xmlns, "svg");
        let path = document.createElementNS(xmlns, "path");
        let path2 = document.createElementNS(xmlns, "path");
        svg.appendChild(path);
        svg.appendChild(path2);
        
        let wView = 256;
        let hView = 256;
        svg.style.width = wView;
        svg.style.height = hView;
        svg.style.backgroundColor = '#ddd';

        path2.setAttributeNS(null, 'fill', 'none');
        path2.setAttributeNS(null, 'stroke', 'red');
        path2.setAttributeNS(null, 'stroke-width', 2);
        let dashState = true;
        path2.setAttributeNS(null, 'stroke-dasharray', '2,0,0');
        setInterval(function(){
            dashState = !dashState;
            if(dashState)
                path2.setAttributeNS(null, 'stroke-dasharray', '2,0,0');
            else
                path2.setAttributeNS(null, 'stroke-dasharray', '0,2,0');
        }, 250);

        workspace.elem.appendChild(svg);

        console.log(svg);

        




        
        let unit = 32;
        let w = Math.floor(wView / unit);
        let h = Math.floor(hView / unit);

        let m = new Array(h);
        for(let i=0; i<h; i++){
            m[i] = (new Array(w)).fill(false);
        }

        svg.onclick = function(e){

            let x = Math.floor(e.offsetX / unit);
            let y = Math.floor(e.offsetY / unit);

            m[y][x] = !m[y][x];

            let set = [];
            for(y=0; y<h; y++)
                for(x=0; x<w; x++)
                    if(m[y][x])
                        set.push(x,y);
    
            let paths = wLib.borderPoints(set);

            let points = paths[0];
            let len = points.length;
            let str = "M";
            let xp, yp;
            for(let i=0; i<len; i++){
                xp = points[i][0] * unit;
                yp = points[i][1] * unit;
                str += " " + xp + " " + yp + " L";
            }
            str += 'Z';
            str = str.replace('LZ', 'Z');
            
            path.setAttributeNS(null, 'd', str);

            str = wLib.pathListToSvgPath(paths, 8, unit);

            path2.setAttributeNS(null, 'd', str);
            
        };

        let p = wLib.borderPoints([
            1,1, 2,1, 3,1,
            1,3, 3,3
        ]);

        // current workspace object
        let o = {};

        // code ...

        // update
        o.update = function(trigger){

        };

        // close
        o.close = function(){
            // app.mode[ 5 ].save = something;
            // delete something (eventlistener, requestanimationframe, setinveterval, etc..)
        };

        // connect current workspace object (export core methods)
        workspace.current = o;

    };

})();








            /* // without getting corner touch case
            while($){

                // TOP
                if(t){

                    t=0; r=0; b=0; l=0;

                    // first point of top (LEFt to right)
                    o.push( [wOfst+c.x, hOfst+c.y] );

                    // look for extend top
                    while(true){
                        c.t = 0;
                        if( !(c.t|c.b|c.l|c.r) ) used.push(c.iList);
                        if((c.x+1)===w) break;
                        if(m[c.y][c.x+1].t) c = m[c.y][c.x+1]; else break;
                    };
                    
                    // look for perpendicular side
                    // same cell
                    if(c.r) r = 1;
                    // other cell
                    else if(c.x+1<w && c.y-1>=0 && m[c.y-1][c.x+1].l){
                        l = 1;
                        c = m[c.y-1][c.x+1];
                    }
                }

                // RIGHT
                if(r){

                    t=0; r=0; b=0; l=0;

                    // first point of right (TOP to bottom)
                    o.push( [wOfst+c.x+1, hOfst+c.y] );

                    // look for extend top
                    while(true){
                        c.r = 0;
                        if( !(c.t|c.b|c.l|c.r) ) used.push(c.iList);
                        if((c.y+1)===h) break;
                        if(m[c.y+1][c.x].r) c = m[c.y+1][c.x]; else break;
                    }
                    
                    // look for perpendicular side
                    // same cell
                    if(c.b) b = 1;
                    // other cell
                    else if(c.x+1<w && c.y+1<h && m[c.y+1][c.x+1].t){
                        t = 1;
                        c = m[c.y+1][c.x+1];
                    }
                }

                // BOTTOM
                if(b){

                    t=0; r=0; b=0; l=0;

                    // first point of botton (RIGHT to left)
                    o.push( [wOfst+c.x+1, hOfst+c.y+1] );

                    // look for extend top
                    while(true){
                        c.b = 0;
                        if( !(c.t|c.b|c.l|c.r) ) used.push(c.iList);
                        if((c.x-1)===-1) break;
                        if(m[c.y][c.x-1].b) c = m[c.y][c.x-1]; else break;
                    }
                    
                    // look for perpendicular side
                    // same cell
                    if(c.l) l = 1;
                    // other cell
                    else if(c.x-1>=0 && c.y+1<h && m[c.y+1][c.x-1].r){
                        r = 1;
                        c = m[c.y+1][c.x-1];
                    }
                }

                // LEFT
                if(l){

                    t=0; r=0; b=0; l=0;

                    // first point of left (BOTTOM to top)
                    o.push( [wOfst+c.x, hOfst+c.y+1] );

                    // look for extend top
                    while(true){
                        c.l = 0;
                        if( !(c.t|c.b|c.l|c.r) ) used.push(c.iList);
                        if((c.y-1)===-1) break;
                        if(m[c.y-1][c.x].l) c = m[c.y-1][c.x]; else break;
                    }
                    
                    // look for perpendicular side
                    // same cell
                    if(c.t) t = 1;
                    // other cell
                    else if(c.x-1>=0 && c.y-1>=0 && m[c.y-1][c.x-1].b){
                        b = 1;
                        c = m[c.y-1][c.x-1];
                    }
                }

                if(!(t|r|b|l)) break;
            }*/





























        /*let borderPoints = function(T){

            let w, wMin=Infinity, wMax=0, wOfst=0;
            let h, hMin=Infinity, hMax=0, hOfst=0;

            let len = Math.floor(T.length / 2);

            // wh min max
            for(let i=0; i<len; i++){
                wMax = wMax<T[(i*2)  ] ? T[(i*2)  ] : wMax;
                hMax = hMax<T[(i*2)+1] ? T[(i*2)+1] : hMax;
                
                wMin = wMin>T[(i*2)  ] ? T[(i*2)  ] : wMin;
                hMin = hMin>T[(i*2)+1] ? T[(i*2)+1] : hMin;
            }
            
            // get w h
            w = wMax - wMin + 1;
            h = hMax - hMin + 1;

            wOfst = wMin;
            hOfst = hMin;

            // build 2D arrays
            let m = new Array(h);
            let M = new Array(h);

            // init 2D arrays
            for(let y=0; y<h; y++){
                m[y] = (new Array(w)).fill(0);

                M[y] = (new Array(w));
                for(let x=0; x<w; x++) M[y][x] = {t:0,b:0,l:0,r:0};
            }

            // fill 2D array
            for(let i=0; i<len; i++)
                m[ T[(i*2)+1]-hOfst ][ T[(i*2)]-wOfst ] = 1;

            //console.log(m);

            // fill 2D array
            M.borders = [];
            let bdr;
            for(let y=0; y<h; y++){
                for(let x=0; x<w; x++){
    
                    if(m[y][x]){

                        bdr = 0;

                        if(y===0   || !m[y-1][x]) M[y][x].t = bdr = 1;

                        if(y===h-1 || !m[y+1][x]) M[y][x].b = bdr = 1;

                        if(x===0   || !m[y][x-1]) M[y][x].l = bdr = 1;

                        if(x===w-1 || !m[y][x+1]) M[y][x].r = bdr = 1;

                        if(bdr)
                            M.borders.push( M[y][x] );
                        else
                            m[y][x] = 0;
                        
                        
                    }

                }
            }

            console.log(M);
        };
        */






















            /*
            let r = 8;
            let relativeCornerSvgTemplate = {

                // same cell corner rotation
                tr : 'a '+r+','+r+' '+0+' '+0+' '+1+' '+( r)+','+( r),
                rb : 'a '+r+','+r+' '+0+' '+0+' '+1+' '+(-r)+','+( r),
                bl : 'a '+r+','+r+' '+0+' '+0+' '+1+' '+(-r)+','+(-r),
                lt : 'a '+r+','+r+' '+0+' '+0+' '+1+' '+( r)+','+(-r),

                // other cell corner rotation
                tl : 'a '+r+','+r+' '+0+' '+0+' '+0+' '+( r)+','+(-r),
                rt : 'a '+r+','+r+' '+0+' '+0+' '+0+' '+( r)+','+( r),
                br : 'a '+r+','+r+' '+0+' '+0+' '+0+' '+(-r)+','+( r),
                lb : 'a '+r+','+r+' '+0+' '+0+' '+0+' '+(-r)+','+(-r),

                tt : '',
                rr : '',
                bb : '',
                ll : '',
            };

            let corner;
            let i;
            str = '';
            for(let iPath=0; iPath<paths.length; iPath++){

                points = paths[iPath];
                len = points.length;
                str += " M";
                for(i=0; i<len-1; i++){
    
                    xp = (points[i][0]*unit);
                    yp = (points[i][1]*unit);
                    if(points[i][2]==='t') xp += r;
                    if(points[i][2]==='r') yp += r;
                    if(points[i][2]==='b') xp -= r;
                    if(points[i][2]==='l') yp -= r;
                    str += " " + xp + " " + yp + " L";
    
                    xp = (points[i+1][0]*unit);
                    yp = (points[i+1][1]*unit);
                    if(points[i][2]==='t') xp -= r;
                    if(points[i][2]==='r') yp -= r;
                    if(points[i][2]==='b') xp += r;
                    if(points[i][2]==='l') yp += r;
                    //str += " " + xp + " " + yp + " L";
                    str += " " + xp + " " + yp + " ";
    
                    corner = '' + points[i][2] + points[i+1][2];
                    str += relativeCornerSvgTemplate[ corner ] + 'L';
    
                }
    
                // hard last
                    xp = (points[i][0]*unit);
                    yp = (points[i][1]*unit);
                    if(points[i][2]==='t') xp += r;
                    if(points[i][2]==='r') yp += r;
                    if(points[i][2]==='b') xp -= r;
                    if(points[i][2]==='l') yp -= r;
                    str += " " + xp + " " + yp + " L";
    
                    xp = (points[0][0]*unit);
                    yp = (points[0][1]*unit);
                    if(points[i][2]==='t') xp -= r;
                    if(points[i][2]==='r') yp -= r;
                    if(points[i][2]==='b') xp += r;
                    if(points[i][2]==='l') yp += r;
                    //str += " " + xp + " " + yp + " L";
                    str += " " + xp + " " + yp + " ";
    
                    corner = '' + points[i][2] + points[0][2];
                    str += relativeCornerSvgTemplate[ corner ] + 'Z';
                // end hard last
    
                //str += 'Z';
                //str = str.replace('LZ', 'Z');

            }
            */