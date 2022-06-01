dkc2ldd.editor = (function(app=dkc2ldd){

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

	o.create_foldableItem = function(){

		// html elements
		let elem = document.createElement('div');
			elem.style.borderStyle = 'solid';
			elem.style.display = 'flex';
			elem.style.alignItems = 'center';
			elem.style.flexWrap = 'wrap';
			elem.style.justifyContent = 'space-between';
			elem.style.height = 'fit-content';
			//elem.style.width = 'fit-content';
			elem.style.minWidth = 'max-content';
			elem.style.overflow = 'hidden';
			elem.style.transition = '0.5s';
		//	elem.style.boxSizing = 'border-box';

			let togglecase = document.createElement('input');
				togglecase.setAttribute('type', 'checkbox');
				togglecase.style.width = 20;
				togglecase.style.height = 20;
				togglecase.style.margin = 0;
			let inputtext = document.createElement('input');
				inputtext.style.backgroundColor = 'transparent';
				inputtext.style.flexBasis = '0px';
				inputtext.style.flexGrow = 1;
				inputtext.style.height = 20;
				inputtext.style.boxSizing = 'border-box';
			let button = document.createElement('input');
				button.setAttribute('type', 'button');
				button.setAttribute('value', "V");
				button.style.width = 20;
				button.style.height = 20;
			let container = document.createElement('div');
				container.style.borderStyle = 'solid';
				container.style.borderColor = 'red';
				container.style.flexBasis = '200px'; // main width of whole foldableItem
				container.style.minWidth = '100%';
				container.style.minHeight = 20;
				container.style.boxSizing = 'border-box';
				//container.style.flexShrink = 0; // not sure it's useful

		// events
		let lastOpenHeight;
		let isOpen = true;
		button.onclick = function(){
			isOpen = !isOpen;
			//elem.style.height = isOpen ? 'fit-content' : parseInt(inputtext.style.height);
			//elem.style.height = isOpen ? 50 : 20;
			
			if(isOpen)
				//elem.style.height = parseInt(getComputedStyle(container).height) + 3 + headerHeight;
				elem.style.height = lastOpenHeight;
			else{
				let headerHeight = parseInt(inputtext.style.height);
				//let headerHeight = inputtext.getBoundingClientRect();

				lastOpenHeight = parseInt(getComputedStyle(elem).height);
				elem.style.height = lastOpenHeight;
				requestAnimationFrame(()=>elem.style.height = headerHeight);
				//elem.style.height = headerHeight;
			}
			
		};

		elem.ontransitionend = function(){
			if(isOpen) elem.style.height = 'fit-content';
		};

		elem.appendChild(togglecase);
		elem.appendChild(inputtext);
		elem.appendChild(button);
		elem.appendChild(container);

		let append_foldableItem = function(foldableItemObject){
			container.appendChild(foldableItemObject.elem);
		};

		return {
			elem:elem, state:togglecase, name:inputtext, fold:button, box:container,
			append:append_foldableItem,
		};
	};
	
	// 2D cell list to border point list
	o.borderPoints = function(_2D_cellList){

		let T = _2D_cellList;

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

		// build 2D map
		let m = new Array(h);
		for(let y=0; y<h; y++){
			m[y] = (new Array(w));
			for(let x=0; x<w; x++)
				m[y][x] = {set:0, bord:0, t:0,b:0,l:0,r:0, x:x,y:y, iList:undefined};
		}

		// init 2D map

		// get m[][].set
		for(let i=0; i<len; i++)
			m[ T[(i*2)+1]-hOfst ][ T[(i*2)]-wOfst ].set = 1;

		// get m[][] .bord .t .b .l .r .iList
		// get m.borders
		m.borders = [];
		let bord;
		for(let y=0; y<h; y++){
			for(let x=0; x<w; x++){

				if(m[y][x].set){

					bord = 0;

					if(y===0   || !m[y-1][x].set) m[y][x].t = bord = 1;

					if(y===h-1 || !m[y+1][x].set) m[y][x].b = bord = 1;

					if(x===0   || !m[y][x-1].set) m[y][x].l = bord = 1;

					if(x===w-1 || !m[y][x+1].set) m[y][x].r = bord = 1;

					if(bord){
						m[y][x].bord = bord;
						m[y][x].iList = m.borders.length;
						m.borders.push( m[y][x] );
					}

				}

			}
		}

		let c = m.borders[0];
		let t,r,b,l;
		let o = [];
		let O = [];
		let iBord = 0;
		
		while(c){

			t=c.t; r=c.r; b=c.b; l=c.l;

			// with getting corner touch case
			while(true){

				// TOP
				if(t){

					t=0; r=0; b=0; l=0;

					// first point of top (LEFt to right)
					o.push( [wOfst+c.x, hOfst+c.y, 't'] );

					// look for extend top
					while(true){
						c.t = 0;
						if( !(c.t|c.b|c.l|c.r) ) c.bord = 0;
						if((c.x+1)===w) break;
						if(m[c.y][c.x+1].t) c = m[c.y][c.x+1]; else break;
					};
					
					// look for perpendicular side
					// other cell
					if(c.x+1<w && c.y-1>=0 && m[c.y-1][c.x+1].l){
						l = 1;
						c = m[c.y-1][c.x+1];
					}
					// same cell
					else if(c.r) r = 1;
				}

				// RIGHT
				if(r){

					t=0; r=0; b=0; l=0;

					// first point of right (TOP to bottom)
					o.push( [wOfst+c.x+1, hOfst+c.y, 'r'] );

					// look for extend top
					while(true){
						c.r = 0;
						if( !(c.t|c.b|c.l|c.r) ) c.bord = 0;
						if((c.y+1)===h) break;
						if(m[c.y+1][c.x].r) c = m[c.y+1][c.x]; else break;
					}
					
					// look for perpendicular side
					// other cell
					if(c.x+1<w && c.y+1<h && m[c.y+1][c.x+1].t){
						t = 1;
						c = m[c.y+1][c.x+1];
					}
					// same cell
					else if(c.b) b = 1;
				}

				// BOTTOM
				if(b){

					t=0; r=0; b=0; l=0;

					// first point of botton (RIGHT to left)
					o.push( [wOfst+c.x+1, hOfst+c.y+1, 'b'] );

					// look for extend top
					while(true){
						c.b = 0;
						if( !(c.t|c.b|c.l|c.r) ) c.bord = 0;
						if((c.x-1)===-1) break;
						if(m[c.y][c.x-1].b) c = m[c.y][c.x-1]; else break;
					}
					
					// look for perpendicular side
					// other cell
					if(c.x-1>=0 && c.y+1<h && m[c.y+1][c.x-1].r){
						r = 1;
						c = m[c.y+1][c.x-1];
					}
					// same cell
					else if(c.l) l = 1;
				}

				// LEFT
				if(l){

					t=0; r=0; b=0; l=0;

					// first point of left (BOTTOM to top)
					o.push( [wOfst+c.x, hOfst+c.y+1, 'l'] );

					// look for extend top
					while(true){
						c.l = 0;
						if( !(c.t|c.b|c.l|c.r) ) c.bord = 0;
						if((c.y-1)===-1) break;
						if(m[c.y-1][c.x].l) c = m[c.y-1][c.x]; else break;
					}
					
					// look for perpendicular side
					// other cell
					if(c.x-1>=0 && c.y-1>=0 && m[c.y-1][c.x-1].b){
						b = 1;
						c = m[c.y-1][c.x-1];
					}
					// same cell
					else if(c.t) t = 1;
				}

				if(!(t|r|b|l)) break;
			}

			O.push( o );
			o = [];

			// look for bord cell not stil parsed
			c = undefined;
			len = m.borders.length;
			for( ; iBord<len; iBord++){
				if(m.borders[iBord].bord){
					c = m.borders[iBord];
					break;
				}
			}

		}

		return O;
	};


	o.pathListToSvgPath = function(pathList, rayBord, cellSize){
		let paths = pathList;
		let r = rayBord;
		let unit = cellSize;

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

		let points;
		let len;
		let xA,yA, xB,yB;
		let str = '';
		let i;
		let corner;
		for(let iPath=0; iPath<paths.length; iPath++){

			points = paths[iPath];
			len = points.length;
			str += " M";
			for(i=0; i<len-1; i++){

				xA = (points[i][0]*unit);
				yA = (points[i][1]*unit);
				xB = (points[i+1][0]*unit);
				yB = (points[i+1][1]*unit);
				if(points[i][2]==='t'){
					xA += r;
					xB -= r;
				}
				if(points[i][2]==='r'){
					yA += r;
					yB -= r;
				}
				if(points[i][2]==='b'){
					xA -= r;
					xB += r;
				}
				if(points[i][2]==='l'){
					yA -= r;
					yB += r;
				}
				str += " " + xA + " " + yA + " L";
				str += " " + xB + " " + yB + " ";

				corner = '' + points[i][2] + points[i+1][2];
				str += relativeCornerSvgTemplate[ corner ] + 'L';

			}

			// hard last
				xA = (points[i][0]*unit);
				yA = (points[i][1]*unit);
				xB = (points[0][0]*unit);
				yB = (points[0][1]*unit);
				if(points[i][2]==='t'){
					xA += r;
					xB -= r;
				}
				if(points[i][2]==='r'){
					yA += r;
					yB -= r;
				}
				if(points[i][2]==='b'){
					xA -= r;
					xB += r;
				}
				if(points[i][2]==='l'){
					yA -= r;
					yB += r;
				}
				str += " " + xA + " " + yA + " L";
				str += " " + xB + " " + yB + " ";

				corner = '' + points[i][2] + points[0][2];
				str += relativeCornerSvgTemplate[ corner ] + 'Z';
			// end hard last

		}

		return str;

	};

	return o;

})();