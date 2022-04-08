
(function(app=dkc2ldd){

	app.gfx.fast.create_4decoded2bppTileset = function(data){

		// _4decodedTileset [tileIndex] [flip(4)] [pixel(64)]
		// _4decodedTileset .n|.h|.v|.a [tileIndex] [pixel(64)]

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

			n = o.n[i] = t[0] = new Uint8Array(64); // tile pixel buffer dimension
			h = o.h[i] = t[1] = new Uint8Array(64); // tile pixel buffer dimension
			v = o.v[i] = t[2] = new Uint8Array(64); // tile pixel buffer dimension
			a = o.a[i] = t[3] = new Uint8Array(64); // tile pixel buffer dimension

			
			// row 0
			A=d[tOfst+0x00]; B=d[tOfst+0x01];
			// pix x:0 y:0
			n[0] = h[7] = v[56] = a[63] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:0
			n[1] = h[6] = v[57] = a[62] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:0
			n[2] = h[5] = v[58] = a[61] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:0
			n[3] = h[4] = v[59] = a[60] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:0
			n[4] = h[3] = v[60] = a[59] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:0
			n[5] = h[2] = v[61] = a[58] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:0
			n[6] = h[1] = v[62] = a[57] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:0
			n[7] = h[0] = v[63] = a[56] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 1
			A=d[tOfst+0x02]; B=d[tOfst+0x03];
			// pix x:0 y:1
			n[8] = h[15] = v[48] = a[55] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:1
			n[9] = h[14] = v[49] = a[54] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:1
			n[10] = h[13] = v[50] = a[53] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:1
			n[11] = h[12] = v[51] = a[52] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:1
			n[12] = h[11] = v[52] = a[51] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:1
			n[13] = h[10] = v[53] = a[50] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:1
			n[14] = h[9] = v[54] = a[49] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:1
			n[15] = h[8] = v[55] = a[48] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 2
			A=d[tOfst+0x04]; B=d[tOfst+0x05];
			// pix x:0 y:2
			n[16] = h[23] = v[40] = a[47] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:2
			n[17] = h[22] = v[41] = a[46] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:2
			n[18] = h[21] = v[42] = a[45] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:2
			n[19] = h[20] = v[43] = a[44] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:2
			n[20] = h[19] = v[44] = a[43] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:2
			n[21] = h[18] = v[45] = a[42] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:2
			n[22] = h[17] = v[46] = a[41] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:2
			n[23] = h[16] = v[47] = a[40] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 3
			A=d[tOfst+0x06]; B=d[tOfst+0x07];
			// pix x:0 y:3
			n[24] = h[31] = v[32] = a[39] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:3
			n[25] = h[30] = v[33] = a[38] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:3
			n[26] = h[29] = v[34] = a[37] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:3
			n[27] = h[28] = v[35] = a[36] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:3
			n[28] = h[27] = v[36] = a[35] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:3
			n[29] = h[26] = v[37] = a[34] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:3
			n[30] = h[25] = v[38] = a[33] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:3
			n[31] = h[24] = v[39] = a[32] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 4
			A=d[tOfst+0x08]; B=d[tOfst+0x09];
			// pix x:0 y:4
			n[32] = h[39] = v[24] = a[31] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:4
			n[33] = h[38] = v[25] = a[30] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:4
			n[34] = h[37] = v[26] = a[29] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:4
			n[35] = h[36] = v[27] = a[28] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:4
			n[36] = h[35] = v[28] = a[27] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:4
			n[37] = h[34] = v[29] = a[26] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:4
			n[38] = h[33] = v[30] = a[25] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:4
			n[39] = h[32] = v[31] = a[24] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 5
			A=d[tOfst+0x0A]; B=d[tOfst+0x0B];
			// pix x:0 y:5
			n[40] = h[47] = v[16] = a[23] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:5
			n[41] = h[46] = v[17] = a[22] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:5
			n[42] = h[45] = v[18] = a[21] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:5
			n[43] = h[44] = v[19] = a[20] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:5
			n[44] = h[43] = v[20] = a[19] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:5
			n[45] = h[42] = v[21] = a[18] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:5
			n[46] = h[41] = v[22] = a[17] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:5
			n[47] = h[40] = v[23] = a[16] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 6
			A=d[tOfst+0x0C]; B=d[tOfst+0x0D];
			// pix x:0 y:6
			n[48] = h[55] = v[8] = a[15] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:6
			n[49] = h[54] = v[9] = a[14] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:6
			n[50] = h[53] = v[10] = a[13] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:6
			n[51] = h[52] = v[11] = a[12] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:6
			n[52] = h[51] = v[12] = a[11] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:6
			n[53] = h[50] = v[13] = a[10] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:6
			n[54] = h[49] = v[14] = a[9] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:6
			n[55] = h[48] = v[15] = a[8] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);

			// row 7
			A=d[tOfst+0x0E]; B=d[tOfst+0x0F];
			// pix x:0 y:7
			n[56] = h[63] = v[0] = a[7] =
			(A&0x80?0x01:0) + (B&0x80?0x02:0);
			// pix x:1 y:7
			n[57] = h[62] = v[1] = a[6] =
			(A&0x40?0x01:0) + (B&0x40?0x02:0);
			// pix x:2 y:7
			n[58] = h[61] = v[2] = a[5] =
			(A&0x20?0x01:0) + (B&0x20?0x02:0);
			// pix x:3 y:7
			n[59] = h[60] = v[3] = a[4] =
			(A&0x10?0x01:0) + (B&0x10?0x02:0);
			// pix x:4 y:7
			n[60] = h[59] = v[4] = a[3] =
			(A&0x08?0x01:0) + (B&0x08?0x02:0);
			// pix x:5 y:7
			n[61] = h[58] = v[5] = a[2] =
			(A&0x04?0x01:0) + (B&0x04?0x02:0);
			// pix x:6 y:7
			n[62] = h[57] = v[6] = a[1] =
			(A&0x02?0x01:0) + (B&0x02?0x02:0);
			// pix x:7 y:7
			n[63] = h[56] = v[7] = a[0] =
			(A&0x01?0x01:0) + (B&0x01?0x02:0);


		}

		return o;
	};

})();



/* 
// CREATE HARD CODE
let str = '';
let n,h,v,a, o=0;
let H = (v => '0x'+dkc2ldd.lib.get_hex2str(v));
let hx;
for(let y=0; y<8; y++){
	str += `// row ${y}\n`;
	str += `A=d[tOfst+${H(o+0x00)}]; B=d[tOfst+${H(o+0x01)}];\n`;
	for(let x=0; x<8; x++){
		n = (y*8)+x;
		h = (y*8)+(7-x);
		v = ((7-y)*8)+x;
		a = ((7-y)*8)+(7-x);

		str += `// pix x:${x} y:${y}\n`;
		hx = H(0x80>>x);
		str += `n[${n}] = h[${h}] = v[${v}] = a[${a}] =\n`;
		str += `(A&${hx}?0x01:0) + (B&${hx}?0x02:0);\n`
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