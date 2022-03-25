
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 7 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...
		let pal = app.gfx.defaultPalettes[1];
		let _pal = app.gfx.defaultPalettes;

		let pal256 = _pal[0].concat(_pal[1]).concat(_pal[2]).concat(_pal[3]).
					 concat(_pal[4]).concat(_pal[5]).concat(_pal[6]).concat(_pal[7]);
		pal256 = pal256.concat(pal256);
		
		let ts = srcFilePanel.tileset.get_data()[0];

		let pal256_oneCol = new Array(256);
		pal256_oneCol.fill([0,255,0]);
		pal256_oneCol[0] = [0,0,0];

		let xtmax  = 16;
		let h = Math.ceil( (ts.length/32) / xtmax ) * 8;
		let w = xtmax * 8;
	

		// performance test
		let timeA, timeB, timeC;

		let nflip, hflip, vflip, aflip;


		let makelabel = (label, height) => {
			let o = document.createElement('span');
			o.textContent = label;
			o.style.display = "inline-flex";
			o.style.alignItems = "center";
			o.style.height = height;
			o.style.verticalAlign = "top";
			return o;
		};


		//////////
		// 2BPP //
		//////////


		// 4 decode_2bppTileset() preview
		timeA = performance.now();
		nflip = app.gfx.fast.decode_2bppTileset(ts, 0,0);
		hflip = app.gfx.fast.decode_2bppTileset(ts, 1,0);
		vflip = app.gfx.fast.decode_2bppTileset(ts, 0,1);
		aflip = app.gfx.fast.decode_2bppTileset(ts, 1,1);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("4 decode_2bppTileset() : ", timeB-timeA);

		let viewport_d2ts = wLib.create_preview(w*4,h*2, 1);
		let ctx_d2ts = viewport_d2ts.ctx;
		viewport_d2ts.elem.appendChild(makelabel('D2 : '+timeC,h*2));

		app.gfx.fast.draw_decodedTileset_NEW(nflip, pal, 0,0, xtmax, ctx_d2ts,0,0);
		app.gfx.fast.draw_decodedTileset_NEW(hflip, pal, 0,0, xtmax, ctx_d2ts,w,0);
		app.gfx.fast.draw_decodedTileset_NEW(vflip, pal, 0,0, xtmax, ctx_d2ts,w*2,0);
		app.gfx.fast.draw_decodedTileset_NEW(aflip, pal, 0,0, xtmax, ctx_d2ts,w*3,0);


		// create_4decoded2bppTileset() preview
		timeA = performance.now();
		let _4dts2bpp = app.gfx.fast.create_4decoded2bppTileset(ts);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("create_4decoded2bppTileset() : ", timeB-timeA);

		let viewport_4d2ts = wLib.create_preview(w*4,h*2, 1);
		let ctx_4d2ts = viewport_4d2ts.ctx;
		viewport_4d2ts.elem.appendChild(makelabel('4D2 : '+timeC,h*2));
		
		app.gfx.fast.draw_decodedTileset_NEW(_4dts2bpp.n, pal, 0,0, xtmax, ctx_4d2ts,0,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4dts2bpp.h, pal, 0,0, xtmax, ctx_4d2ts,w,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4dts2bpp.v, pal, 0,0, xtmax, ctx_4d2ts,w*2,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4dts2bpp.a, pal, 0,0, xtmax, ctx_4d2ts,w*3,0);


		// 4 format_2bppTileset() preview
		timeA = performance.now();
		nflip = app.gfx.fast.format_2bppTileset(ts, 0,0);
		hflip = app.gfx.fast.format_2bppTileset(ts, 1,0);
		vflip = app.gfx.fast.format_2bppTileset(ts, 0,1);
		aflip = app.gfx.fast.format_2bppTileset(ts, 1,1);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("4 format_2bppTileset() : ", timeB-timeA);

		let viewport_f2ts = wLib.create_preview(w*4,h*2, 1);
		let ctx_f2ts = viewport_f2ts.ctx;
		viewport_f2ts.elem.appendChild(makelabel('F2 : '+timeC,h*2));

		app.gfx.fast.draw_formatedTileset(nflip, pal, 0,0, xtmax, ctx_f2ts,0,0);
		app.gfx.fast.draw_formatedTileset(hflip, pal, 0,0, xtmax, ctx_f2ts,w,0);
		app.gfx.fast.draw_formatedTileset(vflip, pal, 0,0, xtmax, ctx_f2ts,w*2,0);
		app.gfx.fast.draw_formatedTileset(aflip, pal, 0,0, xtmax, ctx_f2ts,w*3,0);


		// create_4formated2bppTileset() preview
		timeA = performance.now();
		let _4ts2bpp = app.gfx.fast.create_4formated2bppTileset(ts);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("create_4formated2bppTileset() : ", timeB-timeA);

		let viewport_4f2ts = wLib.create_preview(w*4,h*2, 1);
		let ctx_4f2ts = viewport_4f2ts.ctx;
		viewport_4f2ts.elem.appendChild(makelabel('4F2 : '+timeC,h*2));
		
		app.gfx.fast.draw_formatedTileset(_4ts2bpp.n, pal, 0,0, xtmax, ctx_4f2ts,0,0);
		app.gfx.fast.draw_formatedTileset(_4ts2bpp.h, pal, 0,0, xtmax, ctx_4f2ts,w,0);
		app.gfx.fast.draw_formatedTileset(_4ts2bpp.v, pal, 0,0, xtmax, ctx_4f2ts,w*2,0);
		app.gfx.fast.draw_formatedTileset(_4ts2bpp.a, pal, 0,0, xtmax, ctx_4f2ts,w*3,0);
		

		//////////
		// 4BPP //
		//////////


		// 4 decode_4bppTileset_NEW() preview
		timeA = performance.now();
		nflip = app.gfx.fast.decode_4bppTileset_NEW(ts, 0,0);
		hflip = app.gfx.fast.decode_4bppTileset_NEW(ts, 1,0);
		vflip = app.gfx.fast.decode_4bppTileset_NEW(ts, 0,1);
		aflip = app.gfx.fast.decode_4bppTileset_NEW(ts, 1,1);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("4 decode_4bppTileset_NEW() : ", timeB-timeA);

		let viewport_d4ts = wLib.create_preview(w*4,h, 1);
		let ctx_d4ts = viewport_d4ts.ctx;
		viewport_d4ts.elem.appendChild(makelabel('D4 : '+timeC,h));

		app.gfx.fast.draw_decodedTileset_NEW(nflip, pal, 0,0, xtmax, ctx_d4ts,0,0);
		app.gfx.fast.draw_decodedTileset_NEW(hflip, pal, 0,0, xtmax, ctx_d4ts,w,0);
		app.gfx.fast.draw_decodedTileset_NEW(vflip, pal, 0,0, xtmax, ctx_d4ts,w*2,0);
		app.gfx.fast.draw_decodedTileset_NEW(aflip, pal, 0,0, xtmax, ctx_d4ts,w*3,0);
		

		// create_4decoded4bppTileset() preview
		timeA = performance.now();
		let _4d4ts = app.gfx.fast.create_4decoded4bppTileset(ts);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("create_4decoded4bppTileset() : ", timeB-timeA);

		let viewport_4d4ts = wLib.create_preview(w*4,h, 1);
		let ctx_4d4ts = viewport_4d4ts.ctx;
		viewport_4d4ts.elem.appendChild(makelabel('4D4 : '+timeC,h));
		
		app.gfx.fast.draw_decodedTileset_NEW(_4d4ts.n, pal, 0,0, xtmax, ctx_4d4ts,0,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4d4ts.h, pal, 0,0, xtmax, ctx_4d4ts,w,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4d4ts.v, pal, 0,0, xtmax, ctx_4d4ts,w*2,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4d4ts.a, pal, 0,0, xtmax, ctx_4d4ts,w*3,0);


		// 4 format_4bppTileset() preview
		timeA = performance.now();
		nflip = app.gfx.fast.format_4bppTileset(ts, 0,0);
		hflip = app.gfx.fast.format_4bppTileset(ts, 1,0);
		vflip = app.gfx.fast.format_4bppTileset(ts, 0,1);
		aflip = app.gfx.fast.format_4bppTileset(ts, 1,1);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("4 format_4bppTileset() : ", timeB-timeA);

		let viewport_f4ts = wLib.create_preview(w*4,h, 1);
		let ctx_f4ts = viewport_f4ts.ctx;
		viewport_f4ts.elem.appendChild(makelabel('F4 : '+timeC,h));

		app.gfx.fast.draw_formatedTileset(nflip, pal, 0,0, xtmax, ctx_f4ts,0,0);
		app.gfx.fast.draw_formatedTileset(hflip, pal, 0,0, xtmax, ctx_f4ts,w,0);
		app.gfx.fast.draw_formatedTileset(vflip, pal, 0,0, xtmax, ctx_f4ts,w*2,0);
		app.gfx.fast.draw_formatedTileset(aflip, pal, 0,0, xtmax, ctx_f4ts,w*3,0);


		// create_4formatedTileset() preview
		timeA = performance.now();
		let _4f4ts = app.gfx.fast.create_4formatedTileset(ts);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("create_4formatedTileset() : ", timeB-timeA);

		let viewport_4f4ts = wLib.create_preview(w*4,h, 1);
		let ctx_4f4ts = viewport_4f4ts.ctx;
		viewport_4f4ts.elem.appendChild(makelabel('4F4 : '+timeC,h));
		
		app.gfx.fast.draw_formatedTileset(_4f4ts.n, pal, 0,0, xtmax, ctx_4f4ts,0,0);
		app.gfx.fast.draw_formatedTileset(_4f4ts.h, pal, 0,0, xtmax, ctx_4f4ts,w,0);
		app.gfx.fast.draw_formatedTileset(_4f4ts.v, pal, 0,0, xtmax, ctx_4f4ts,w*2,0);
		app.gfx.fast.draw_formatedTileset(_4f4ts.a, pal, 0,0, xtmax, ctx_4f4ts,w*3,0);
		

		//////////
		// 8BPP //
		//////////
		let _8bppPal = pal256;


		// 4 decode_8bppTileset() preview
		timeA = performance.now();
		nflip = app.gfx.fast.decode_8bppTileset(ts, 0,0);
		hflip = app.gfx.fast.decode_8bppTileset(ts, 1,0);
		vflip = app.gfx.fast.decode_8bppTileset(ts, 0,1);
		aflip = app.gfx.fast.decode_8bppTileset(ts, 1,1);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("4 decode_8bppTileset() : ", timeB-timeA);

		let viewport_d8ts = wLib.create_preview(w*4,h/2, 1);
		let ctx_d8ts = viewport_d8ts.ctx;
		viewport_d8ts.elem.appendChild(makelabel('D8 : '+timeC,h/2));

		let d8ts_pal = _8bppPal;
		app.gfx.fast.draw_decodedTileset_NEW(nflip, d8ts_pal, 0,0, xtmax, ctx_d8ts,0,0);
		app.gfx.fast.draw_decodedTileset_NEW(hflip, d8ts_pal, 0,0, xtmax, ctx_d8ts,w,0);
		app.gfx.fast.draw_decodedTileset_NEW(vflip, d8ts_pal, 0,0, xtmax, ctx_d8ts,w*2,0);
		app.gfx.fast.draw_decodedTileset_NEW(aflip, d8ts_pal, 0,0, xtmax, ctx_d8ts,w*3,0);


		// create_4decoded8bppTileset() preview
		timeA = performance.now();
		let _4d8ts = app.gfx.fast.create_4decoded8bppTileset(ts);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("create_4decoded8bppTileset() : ", timeB-timeA);

		let viewport_4d8ts = wLib.create_preview(w*4,h/2, 1);
		let ctx_4d8ts = viewport_4d8ts.ctx;
		viewport_4d8ts.elem.appendChild(makelabel('4D8 : '+timeC,h/2));
		
		let _4d8ts_pal = _8bppPal;
		app.gfx.fast.draw_decodedTileset_NEW(_4d8ts.n, _4d8ts_pal, 0,0, xtmax, ctx_4d8ts,0,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4d8ts.h, _4d8ts_pal, 0,0, xtmax, ctx_4d8ts,w,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4d8ts.v, _4d8ts_pal, 0,0, xtmax, ctx_4d8ts,w*2,0);
		app.gfx.fast.draw_decodedTileset_NEW(_4d8ts.a, _4d8ts_pal, 0,0, xtmax, ctx_4d8ts,w*3,0);


		// 4 format_8bppTileset() preview
		timeA = performance.now();
		nflip = app.gfx.fast.format_8bppTileset(ts, 0,0);
		hflip = app.gfx.fast.format_8bppTileset(ts, 1,0);
		vflip = app.gfx.fast.format_8bppTileset(ts, 0,1);
		aflip = app.gfx.fast.format_8bppTileset(ts, 1,1);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("4 format_8bppTileset() : ", timeB-timeA);

		let viewport_f8ts = wLib.create_preview(w*4,h/2, 1);
		let ctx_f8ts = viewport_f8ts.ctx;
		viewport_f8ts.elem.appendChild(makelabel('F8 : '+timeC,h/2));

		let f8ts_pal = _8bppPal;
		app.gfx.fast.draw_formatedTileset(nflip, f8ts_pal, 0,0, xtmax, ctx_f8ts,0,0);
		app.gfx.fast.draw_formatedTileset(hflip, f8ts_pal, 0,0, xtmax, ctx_f8ts,w,0);
		app.gfx.fast.draw_formatedTileset(vflip, f8ts_pal, 0,0, xtmax, ctx_f8ts,w*2,0);
		app.gfx.fast.draw_formatedTileset(aflip, f8ts_pal, 0,0, xtmax, ctx_f8ts,w*3,0);


		// create_4formated8bppTileset() preview
		timeA = performance.now();
		let _4f8ts = app.gfx.fast.create_4formated8bppTileset(ts);
		timeB = performance.now();
		timeC = timeB-timeA;
		console.log("create_4formated8bppTileset() : ", timeB-timeA);

		let viewport_4f8ts = wLib.create_preview(w*4,h/2, 1);
		let ctx_4f8ts = viewport_4f8ts.ctx;
		viewport_4f8ts.elem.appendChild(makelabel('4F8 : '+timeC,h/2));
		
		let _4f8ts_pal = _8bppPal;
		app.gfx.fast.draw_formatedTileset(_4f8ts.n, _4f8ts_pal, 0,0, xtmax, ctx_4f8ts,0,0);
		app.gfx.fast.draw_formatedTileset(_4f8ts.h, _4f8ts_pal, 0,0, xtmax, ctx_4f8ts,w,0);
		app.gfx.fast.draw_formatedTileset(_4f8ts.v, _4f8ts_pal, 0,0, xtmax, ctx_4f8ts,w*2,0);
		app.gfx.fast.draw_formatedTileset(_4f8ts.a, _4f8ts_pal, 0,0, xtmax, ctx_4f8ts,w*3,0);




		// workspace element connexion
		let noflexdiv = document.createElement("div");
		noflexdiv.style.width = "fit-content";
		noflexdiv.style.height = "fit-content";
		noflexdiv.style.overflow = "hidden";
		noflexdiv.style.whiteSpace = "nowrap";
			noflexdiv.appendChild(viewport_d2ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_4d2ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_f2ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_4f2ts.elem);
			noflexdiv.appendChild(document.createElement("br"));

			noflexdiv.appendChild(viewport_d4ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_4d4ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_f4ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_4f4ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			
			noflexdiv.appendChild(viewport_d8ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_4d8ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_f8ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
			noflexdiv.appendChild(viewport_4f8ts.elem);
			noflexdiv.appendChild(document.createElement("br"));
		workspace.elem.appendChild(noflexdiv);
		




/*
		// check value
		let OK = {n:[],h:[],v:[],a:[]};
		if(_4ts.n.length===nflip.length){
			let len = _4ts.n.length;
			for(let i=0; i<len; i++){
				for(let y=0; y<8; y++)
				for(let x=0; x<8; x++)
				{
					if(_4ts.n[i][y][x] === nflip[i][y][x]) OK.n.push(i); else console.log("n : ", i, x,y);
					if(_4ts.h[i][y][x] === hflip[i][y][x]) OK.h.push(i); else console.log("h : ", i, x,y);
					if(_4ts.v[i][y][x] === vflip[i][y][x]) OK.v.push(i); else console.log("v : ", i, x,y);
					if(_4ts.a[i][y][x] === aflip[i][y][x]) OK.a.push(i); else console.log("a : ", i, x,y);
				}
			}
			console.log("end : ", OK);
		}else
			console.log("wrong size");

		OK = [];
		let A = ctx_0.getImageData(0,0, w*4,h);
		let B = ctx_1.getImageData(0,0, w*4,h);
		if(A.data.length===B.data.length){
			let len = A.data.length;
			for(let i=0; i<len; i++){
				if(A.data[i] === B.data[i]) OK.push(i); else console.log("AB : ", i);
			}
			console.log("end : ", w*4*h, OK);
		}else
			console.log("wrong size");
*/


		// update
		o.update = function(trigger){

		};

		// close
		o.close = function(){
			// app.mode[ 7 ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();











































