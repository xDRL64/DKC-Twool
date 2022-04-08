
(function(app=dkc2ldd){

	app.gfx.fast.create_4formated2bppTileset = function(data){

		// _4formatedTileset [tileIndex] [flip(4)] [yPixel(8)] [xPixel(8)]
		// _4formatedTileset .n|.h|.v|.a [tileIndex] [yPixel(8)] [xPixel(8)]

		let count = data.length >> 4; // div by 16
		let len = count << 4; // mul by 16

		let o = new Array(count); // tile index dimension
		o.n = new Array(count);
		o.h = new Array(count);
		o.v = new Array(count);
		o.a = new Array(count);
		
		let i = 0; //iTile
		let A,B;
		let d = data;
		let t, n,h,v,a;

		for(let tOfst=0; tOfst<len; tOfst+=16,i++){

			t = o[i] = new Array(4); // flip dimension

			n = o.n[i] = t[0] = new Array(8); // tile row dimension
			n[0] = new Uint8Array(8) // tile pixel dimension
			n[1] = new Uint8Array(8) // tile pixel dimension
			n[2] = new Uint8Array(8) // tile pixel dimension
			n[3] = new Uint8Array(8) // tile pixel dimension
			n[4] = new Uint8Array(8) // tile pixel dimension
			n[5] = new Uint8Array(8) // tile pixel dimension
			n[6] = new Uint8Array(8) // tile pixel dimension
			n[7] = new Uint8Array(8) // tile pixel dimension

			h = o.h[i] = t[1] = new Array(8); // tile row dimension
			h[0] = new Uint8Array(8) // tile pixel dimension
			h[1] = new Uint8Array(8) // tile pixel dimension
			h[2] = new Uint8Array(8) // tile pixel dimension
			h[3] = new Uint8Array(8) // tile pixel dimension
			h[4] = new Uint8Array(8) // tile pixel dimension
			h[5] = new Uint8Array(8) // tile pixel dimension
			h[6] = new Uint8Array(8) // tile pixel dimension
			h[7] = new Uint8Array(8) // tile pixel dimension

			v = o.v[i] = t[2] = new Array(8); // tile row dimension
			v[0] = new Uint8Array(8) // tile pixel dimension
			v[1] = new Uint8Array(8) // tile pixel dimension
			v[2] = new Uint8Array(8) // tile pixel dimension
			v[3] = new Uint8Array(8) // tile pixel dimension
			v[4] = new Uint8Array(8) // tile pixel dimension
			v[5] = new Uint8Array(8) // tile pixel dimension
			v[6] = new Uint8Array(8) // tile pixel dimension
			v[7] = new Uint8Array(8) // tile pixel dimension

			a = o.a[i] = t[3] = new Array(8); // tile row dimension
			a[0] = new Uint8Array(8) // tile pixel dimension
			a[1] = new Uint8Array(8) // tile pixel dimension
			a[2] = new Uint8Array(8) // tile pixel dimension
			a[3] = new Uint8Array(8) // tile pixel dimension
			a[4] = new Uint8Array(8) // tile pixel dimension
			a[5] = new Uint8Array(8) // tile pixel dimension
			a[6] = new Uint8Array(8) // tile pixel dimension
			a[7] = new Uint8Array(8) // tile pixel dimension

			
			// row 0
			A=d[tOfst+0x00]; B=d[tOfst+0x01];
			// pix x:0 y:0
			n[0][0] = h[0][7] = v[7][0] = a[7][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:0
			n[0][1] = h[0][6] = v[7][1] = a[7][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:0
			n[0][2] = h[0][5] = v[7][2] = a[7][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:0
			n[0][3] = h[0][4] = v[7][3] = a[7][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:0
			n[0][4] = h[0][3] = v[7][4] = a[7][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:0
			n[0][5] = h[0][2] = v[7][5] = a[7][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:0
			n[0][6] = h[0][1] = v[7][6] = a[7][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:0
			n[0][7] = h[0][0] = v[7][7] = a[7][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 1
			A=d[tOfst+0x02]; B=d[tOfst+0x03];
			// pix x:0 y:1
			n[1][0] = h[1][7] = v[6][0] = a[6][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:1
			n[1][1] = h[1][6] = v[6][1] = a[6][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:1
			n[1][2] = h[1][5] = v[6][2] = a[6][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:1
			n[1][3] = h[1][4] = v[6][3] = a[6][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:1
			n[1][4] = h[1][3] = v[6][4] = a[6][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:1
			n[1][5] = h[1][2] = v[6][5] = a[6][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:1
			n[1][6] = h[1][1] = v[6][6] = a[6][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:1
			n[1][7] = h[1][0] = v[6][7] = a[6][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 2
			A=d[tOfst+0x04]; B=d[tOfst+0x05];
			// pix x:0 y:2
			n[2][0] = h[2][7] = v[5][0] = a[5][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:2
			n[2][1] = h[2][6] = v[5][1] = a[5][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:2
			n[2][2] = h[2][5] = v[5][2] = a[5][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:2
			n[2][3] = h[2][4] = v[5][3] = a[5][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:2
			n[2][4] = h[2][3] = v[5][4] = a[5][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:2
			n[2][5] = h[2][2] = v[5][5] = a[5][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:2
			n[2][6] = h[2][1] = v[5][6] = a[5][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:2
			n[2][7] = h[2][0] = v[5][7] = a[5][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 3
			A=d[tOfst+0x06]; B=d[tOfst+0x07];
			// pix x:0 y:3
			n[3][0] = h[3][7] = v[4][0] = a[4][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:3
			n[3][1] = h[3][6] = v[4][1] = a[4][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:3
			n[3][2] = h[3][5] = v[4][2] = a[4][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:3
			n[3][3] = h[3][4] = v[4][3] = a[4][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:3
			n[3][4] = h[3][3] = v[4][4] = a[4][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:3
			n[3][5] = h[3][2] = v[4][5] = a[4][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:3
			n[3][6] = h[3][1] = v[4][6] = a[4][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:3
			n[3][7] = h[3][0] = v[4][7] = a[4][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 4
			A=d[tOfst+0x08]; B=d[tOfst+0x09];
			// pix x:0 y:4
			n[4][0] = h[4][7] = v[3][0] = a[3][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:4
			n[4][1] = h[4][6] = v[3][1] = a[3][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:4
			n[4][2] = h[4][5] = v[3][2] = a[3][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:4
			n[4][3] = h[4][4] = v[3][3] = a[3][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:4
			n[4][4] = h[4][3] = v[3][4] = a[3][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:4
			n[4][5] = h[4][2] = v[3][5] = a[3][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:4
			n[4][6] = h[4][1] = v[3][6] = a[3][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:4
			n[4][7] = h[4][0] = v[3][7] = a[3][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 5
			A=d[tOfst+0x0A]; B=d[tOfst+0x0B];
			// pix x:0 y:5
			n[5][0] = h[5][7] = v[2][0] = a[2][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:5
			n[5][1] = h[5][6] = v[2][1] = a[2][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:5
			n[5][2] = h[5][5] = v[2][2] = a[2][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:5
			n[5][3] = h[5][4] = v[2][3] = a[2][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:5
			n[5][4] = h[5][3] = v[2][4] = a[2][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:5
			n[5][5] = h[5][2] = v[2][5] = a[2][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:5
			n[5][6] = h[5][1] = v[2][6] = a[2][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:5
			n[5][7] = h[5][0] = v[2][7] = a[2][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 6
			A=d[tOfst+0x0C]; B=d[tOfst+0x0D];
			// pix x:0 y:6
			n[6][0] = h[6][7] = v[1][0] = a[1][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:6
			n[6][1] = h[6][6] = v[1][1] = a[1][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:6
			n[6][2] = h[6][5] = v[1][2] = a[1][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:6
			n[6][3] = h[6][4] = v[1][3] = a[1][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:6
			n[6][4] = h[6][3] = v[1][4] = a[1][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:6
			n[6][5] = h[6][2] = v[1][5] = a[1][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:6
			n[6][6] = h[6][1] = v[1][6] = a[1][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:6
			n[6][7] = h[6][0] = v[1][7] = a[1][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 7
			A=d[tOfst+0x0E]; B=d[tOfst+0x0F];
			// pix x:0 y:7
			n[7][0] = h[7][7] = v[0][0] = a[0][7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:7
			n[7][1] = h[7][6] = v[0][1] = a[0][6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:7
			n[7][2] = h[7][5] = v[0][2] = a[0][5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:7
			n[7][3] = h[7][4] = v[0][3] = a[0][4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:7
			n[7][4] = h[7][3] = v[0][4] = a[0][3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:7
			n[7][5] = h[7][2] = v[0][5] = a[0][2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:7
			n[7][6] = h[7][1] = v[0][6] = a[0][1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:7
			n[7][7] = h[7][0] = v[0][7] = a[0][0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

		}

		return o;
	};

})();







/* 
// CREATE HARD CODE
let str = '';
let fx,fy, o=0;
let H = (v => '0x'+dkc2ldd.lib.get_hex2str(v));
let hx;
for(let y=0; y<8; y++){
	str += `// row ${y}\n`;
	str += `A=d[tOfst+${H(o+0x00)}]; B=d[tOfst+${H(o+0x01)}];\n`;
	for(let x=0; x<8; x++){
		fx = 7 - x;
		fy = 7 - y;
		str += `// pix x:${x} y:${y}\n`;
		hx = H(0x80>>x);
		str += `n[${y}][${x}] = h[${y}][${fx}] = v[${fy}][${x}] = a[${fy}][${fx}] =\n`;
		str += `(A&${hx}?0x01:0) + (B&${hx}?0x02:0);\n`;
	}
	str += '\n';
	o += 2;
}

// DISPLAY TO COPY
document.body.textContent = "";
let div = document.createElement("div");
div.style.position = "absolute";
div.style.whiteSpace = "pre";
div.style.fontFamily = "monospace";
div.style.left = 0;
div.style.right = 0;
document.body.appendChild(div);
div.textContent = str;
 */