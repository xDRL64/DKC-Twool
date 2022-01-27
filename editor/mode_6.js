
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
		
		// empty workspace after sampling
		workspace.elem.textContent = "";
		
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
		viewport.elem.style.verticalAlign = "top";
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
		let lvlPrev;
		(function(){
			let lvltilemap = srcFilePanel.tilemap.get_data()[0];
			let len = Math.floor(lvltilemap.length / 2);
			let ytmax = 16;
			let xtmax = Math.ceil(len / ytmax);
			let lowByte, highByte;
			let hMapFlip,vMapFlip;
			let iChip, chipOffset;

			let data = srcFilePanel.collisionmap.get_data()[0];
			let collchipLen = /*Math.floor*/(data / 4);
			let iByte;
			let A, B;
			let fA, fB;

			let flip; // final flip

			let xlt, ylt;
			let pix, p;
			let W = xtmax * 32;
			let H = ytmax * 32;

			let prevScale = 1;
			// collision map viewport
			lvlPrev = wLib.create_preview(W, H, prevScale);
			workspace.elem.appendChild(lvlPrev.elem);

			// display txt debug
			let txtPrev = wLib.create_preview(W, H, prevScale);
			lvlPrev.elem.appendChild(txtPrev.elem);
			txtPrev.elem.style.position = "absolute";
			txtPrev.elem.style.left = 0;
			txtPrev.ctx.fillStyle = "red";
			txtPrev.ctx.font = "10px Courier New";

			let study = {};
				study.list = [];
				study.xmlns = 'http://www.w3.org/2000/svg';
				study.svg = document.createElementNS(study.xmlns, "svg");
				study.svg.style.width = W;
				study.svg.style.height = H;
				study.svg.style.position = "absolute";
				study.svg.style.left = 0;
				study.path = document.createElementNS(study.xmlns, "path");
				study.path.setAttributeNS(null, 'fill', 'none');
				study.path.setAttributeNS(null, 'stroke', 'red');
				study.path.setAttributeNS(null, 'stroke-width', 2);
				study.svg.appendChild(study.path);
				lvlPrev.elem.appendChild(study.svg);

			let pixels = lvlPrev.ctx.createImageData(W, H);

			for(let iLTM=0; iLTM<len; iLTM++){
				// get iChip
				lowByte = lvltilemap[(iLTM*2)+0];
				highByte = lvltilemap[(iLTM*2)+1];
				
				iChip = ((highByte&0x0F)<<8) + lowByte;
				chipOffset = iChip * 32;
				
				hMapFlip = (highByte & 0x40) >> 6;
				//vMapFlip = (highByte & 0x80) >> 7;
				
				xlt = Math.floor(iLTM/ytmax);
				ylt = iLTM % ytmax;


				// txt display debug
				iByte = iChip * 4;
				//txtPrev.ctx.fillText(data[iByte+1].toString(16), xlt*32+8,ylt*32+8);
				txtPrev.ctx.fillText(iChip, xlt*32+8,ylt*32+8);
				// txt display debug end


				// study
				/*if( iChip>=128 && iChip<128+16 ) study.list.push( xlt, ylt );
				iChip = iChip<128 ? iChip : iChip-128;*/
				// study end


				if(iChip >= collchipLen){
					iChip = 0;
				}

				iByte = iChip * 4;
				A = data[iByte  ] & 0x7F;
				B = data[iByte+2] & 0x7F;

				fA = (data[iByte   + 1] & 0x80) >> 7;
				fB = (data[iByte+2 + 1] & 0x80) >> 7;
				
				fA = fA ^ hMapFlip;
				fB = fB ^ hMapFlip;

				if(hMapFlip){
					let tmp;
					tmp = A; A = B; B = tmp;
					tmp = fA; fA = fB; fB = tmp;
				}

				// study
				/*let bitmask = 0x80; // unknown 0x20 0x10 0x08 0x04 0x02 (swap)
				let swap = 0;
				if( (data[iByte+0 +swap]&bitmask) || (data[iByte+2 +swap]&bitmask) )
					study.list.push( xlt, ylt );*/
				// study end


				for(let y=0; y<32; y++){
				for(let x=0; x<16; x++){
					p = ( (y*16) + x ) * 4;
					pix = ( (ylt*32*W)+(y*W) + (xlt*32)+x ) * 4;

					pixels.data[pix  ] = gfxCollset[A][fA].data[p  ];
					pixels.data[pix+1] = gfxCollset[A][fA].data[p+1];
					pixels.data[pix+2] = gfxCollset[A][fA].data[p+2];
					pixels.data[pix+3] = gfxCollset[A][fA].data[p+3];

					//p = ( (y*16) + x ) * 4;
					pix = ( (ylt*32*W)+(y*W) + (xlt*32)+16+x ) * 4;

					pixels.data[pix  ] = gfxCollset[B][fB].data[p  ];
					pixels.data[pix+1] = gfxCollset[B][fB].data[p+1];
					pixels.data[pix+2] = gfxCollset[B][fB].data[p+2];
					pixels.data[pix+3] = gfxCollset[B][fB].data[p+3];
				}
				}

				

			}
			lvlPrev.ctx.putImageData(pixels, 0,0);

			// study display
			/*let paths = wLib.borderPoints(study.list);
			str = wLib.pathListToSvgPath(paths, 8, 32);
            study.path.setAttributeNS(null, 'd', str);*/
		})();


		// HTML element child/parent connexion
		//divTag.appendChild(imgTag);
		divTag.appendChild(lvlPrev.elem);
		divTag.appendChild(prev.elem);
		divTag.appendChild(viewport.elem);
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
