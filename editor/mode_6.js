
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 6 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...
		/*
		let img = dkc2ldd.interface.srcFilePanel.collisionmap.fileData[0];
		let str = "";
		for(let i=0; i<img.length; i++)
			str += String.fromCharCode(img[i]);
		let src = 'data:image/png;base64,' + btoa(str);
		let imgTag = document.createElement('img');
		imgTag.src = src;
		workspace.elem.appendChild(imgTag);
		*/

		// none flex container
		let divTag = document.createElement("div");

		// displayer : collision set buffer
		let prev = wLib.create_preview(256+16,((256+8)*2)+1, 1);
		
		// img source to sample to create collision set buffer
		let imgTag = new Image();
		imgTag.src = app.imgPack.gfxCollisionset;
		workspace.elem.appendChild(imgTag);
		
		// create sampler
		let sampler = document.createElement("canvas").getContext('2d');
		sampler.canvas.width = 256;
		sampler.canvas.height = 512;
		sampler.drawImage(imgTag, 0,0);

		// create mirrorer
		sampler.save();
		sampler.scale(-1,1);
		sampler.translate(-256,0);
		sampler.drawImage(imgTag, 0,256);
		sampler.restore();

		workspace.elem.appendChild(sampler.canvas);

		// sampling process
		let gfxCollset = [];
		let w = 256 / 16;
		let h = 256 / 32;
		let len = w * h;
		let i = 0;
		for(let y=0; y<h; y++)
		for(let x=0; x<w; x++){
			// create gfx collision set buffer
			gfxCollset.push( [
				sampler.getImageData(x*16, y*32, 16, 32),
				sampler.getImageData( ((w-1)*16)-(x*16), 256+(y*32), 16, 32 ),
			] );
			// check gfx collision set buffer
			prev.ctx.putImageData(gfxCollset[i][0], x*17, y*33);
			prev.ctx.putImageData(gfxCollset[i][1], x*17, 256+8+(y*33));
			i++;
		}
		
		
		// display collision chip
		let dat = dkc2ldd.interface.srcFilePanel.collisionmap.get_data();
		let data = dat[0];
		len = /*Math.floor*/(data.length / 4);
		let xtmax = 16;
		w = xtmax;
		h = Math.ceil(len / xtmax);
		let W = w * 32;
		let H = h * 32;

		let viewport = wLib.create_preview(W,H, 1);
		let pixels = viewport.ctx.createImageData(W,H);

		let iMap = 0;
		let iByte = 0;
		let A, B;
		let fA, fB;
		for(let y=0; y<H; y+=32)
		for(let x=0; x<W; x+=32){
			A = data[iByte  ] & 0x7F;
			B = data[iByte+2] & 0x7F;

			fA = (data[iByte   + 1] & 0x80) >> 7;
			fB = (data[iByte+2 + 1] & 0x80) >> 7;

			viewport.ctx.putImageData(gfxCollset[A][fA], x,y);
			viewport.ctx.putImageData(gfxCollset[B][fB], x+16,y);
			//debugger;
			iMap++;
			iByte += 4;
		}

		// test for displaying HORIZONTAL collision map



		// HTML element child/parent connexion
		divTag.appendChild(imgTag);
		divTag.appendChild(prev.view);
		divTag.appendChild(viewport.view);
		workspace.elem.appendChild(divTag);

		// update
		o.update = function(trigger){

		};

		// close
		o.close = function(){
			// app.mode[ 6 ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();
