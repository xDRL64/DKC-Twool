
(function(app=dkc2ldd){

	app.gfx.fast.create_4decoded2bppTileset = function(rawTileset){

		// _4decodedTileset [tileIndex] [flip(4)] [pixel(64)]
		// _4decodedTileset .n|.h|.v|.a [tileIndex] [pixel(64)]

		let data = rawTileset;
		let len = data.length;
		let count = len >> 4; // div by 16

		let o = new Array(count); // tile index dimension
		o.n = new Array(count);
		o.h = new Array(count);
		o.v = new Array(count);
		o.a = new Array(count);
		
		let i = 0; //iTile
		let A,B;
		let d = data;
		let t;
		let c;
		for(let tOfst=0; tOfst<len; tOfst+=16){

			t = o[i] = new Array(4); // flip dimension

			t[0] = new Array(64); // tile pixel buffer dimension
			t[1] = new Array(64); // tile pixel buffer dimension
			t[2] = new Array(64); // tile pixel buffer dimension
			t[3] = new Array(64); // tile pixel buffer dimension

			
			// row 0
			A=d[tOfst+0]; B=d[tOfst+1];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [0] = t[1] [7] = t[2] [56] = t[3] [63] = c;
			// pix 1 0
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [1] = t[1] [6] = t[2] [57] = t[3] [62] = c;
			// pix 2 0
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [2] = t[1] [5] = t[2] [58] = t[3] [61] = c;
			// pix 3 0
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [3] = t[1] [4] = t[2] [59] = t[3] [60] = c;
			// pix 4 0
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [4] = t[1] [3] = t[2] [60] = t[3] [59] = c;
			// pix 5 0
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [5] = t[1] [2] = t[2] [61] = t[3] [58] = c;
			// pix 6 0
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [6] = t[1] [1] = t[2] [62] = t[3] [57] = c;
			// pix 7 0
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [7] = t[1] [0] = t[2] [63] = t[3] [56] = c;

			// row 1
			A=d[tOfst+2]; B=d[tOfst+3];
			// pix 0 1
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [8] = t[1] [15] = t[2] [48] = t[3] [55] = c;
			// pix 1 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [9] = t[1] [14] = t[2] [49] = t[3] [54] = c;
			// pix 2 1
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [10] = t[1] [13] = t[2] [50] = t[3] [53] = c;
			// pix 3 1
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [11] = t[1] [12] = t[2] [51] = t[3] [52] = c;
			// pix 4 1
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [12] = t[1] [11] = t[2] [52] = t[3] [51] = c;
			// pix 5 1
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [13] = t[1] [10] = t[2] [53] = t[3] [50] = c;
			// pix 6 1
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [14] = t[1] [9] = t[2] [54] = t[3] [49] = c;
			// pix 7 1
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [15] = t[1] [8] = t[2] [55] = t[3] [48] = c;

			// row 2
			A=d[tOfst+4]; B=d[tOfst+5];
			// pix 0 2
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [16] = t[1] [23] = t[2] [40] = t[3] [47] = c;
			// pix 1 2
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [17] = t[1] [22] = t[2] [41] = t[3] [46] = c;
			// pix 2 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [18] = t[1] [21] = t[2] [42] = t[3] [45] = c;
			// pix 3 2
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [19] = t[1] [20] = t[2] [43] = t[3] [44] = c;
			// pix 4 2
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [20] = t[1] [19] = t[2] [44] = t[3] [43] = c;
			// pix 5 2
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [21] = t[1] [18] = t[2] [45] = t[3] [42] = c;
			// pix 6 2
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [22] = t[1] [17] = t[2] [46] = t[3] [41] = c;
			// pix 7 2
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [23] = t[1] [16] = t[2] [47] = t[3] [40] = c;

			// row 3
			A=d[tOfst+6]; B=d[tOfst+7];
			// pix 0 3
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [24] = t[1] [31] = t[2] [32] = t[3] [39] = c;
			// pix 1 3
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [25] = t[1] [30] = t[2] [33] = t[3] [38] = c;
			// pix 2 3
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [26] = t[1] [29] = t[2] [34] = t[3] [37] = c;
			// pix 3 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [27] = t[1] [28] = t[2] [35] = t[3] [36] = c;
			// pix 4 3
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [28] = t[1] [27] = t[2] [36] = t[3] [35] = c;
			// pix 5 3
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [29] = t[1] [26] = t[2] [37] = t[3] [34] = c;
			// pix 6 3
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [30] = t[1] [25] = t[2] [38] = t[3] [33] = c;
			// pix 7 3
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [31] = t[1] [24] = t[2] [39] = t[3] [32] = c;

			// row 4
			A=d[tOfst+8]; B=d[tOfst+9];
			// pix 0 4
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [32] = t[1] [39] = t[2] [24] = t[3] [31] = c;
			// pix 1 4
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [33] = t[1] [38] = t[2] [25] = t[3] [30] = c;
			// pix 2 4
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [34] = t[1] [37] = t[2] [26] = t[3] [29] = c;
			// pix 3 4
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [35] = t[1] [36] = t[2] [27] = t[3] [28] = c;
			// pix 4 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [36] = t[1] [35] = t[2] [28] = t[3] [27] = c;
			// pix 5 4
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [37] = t[1] [34] = t[2] [29] = t[3] [26] = c;
			// pix 6 4
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [38] = t[1] [33] = t[2] [30] = t[3] [25] = c;
			// pix 7 4
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [39] = t[1] [32] = t[2] [31] = t[3] [24] = c;

			// row 5
			A=d[tOfst+10]; B=d[tOfst+11];
			// pix 0 5
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [40] = t[1] [47] = t[2] [16] = t[3] [23] = c;
			// pix 1 5
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [41] = t[1] [46] = t[2] [17] = t[3] [22] = c;
			// pix 2 5
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [42] = t[1] [45] = t[2] [18] = t[3] [21] = c;
			// pix 3 5
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [43] = t[1] [44] = t[2] [19] = t[3] [20] = c;
			// pix 4 5
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [44] = t[1] [43] = t[2] [20] = t[3] [19] = c;
			// pix 5 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [45] = t[1] [42] = t[2] [21] = t[3] [18] = c;
			// pix 6 5
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [46] = t[1] [41] = t[2] [22] = t[3] [17] = c;
			// pix 7 5
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [47] = t[1] [40] = t[2] [23] = t[3] [16] = c;

			// row 6
			A=d[tOfst+12]; B=d[tOfst+13];
			// pix 0 6
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [48] = t[1] [55] = t[2] [8] = t[3] [15] = c;
			// pix 1 6
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [49] = t[1] [54] = t[2] [9] = t[3] [14] = c;
			// pix 2 6
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [50] = t[1] [53] = t[2] [10] = t[3] [13] = c;
			// pix 3 6
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [51] = t[1] [52] = t[2] [11] = t[3] [12] = c;
			// pix 4 6
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [52] = t[1] [51] = t[2] [12] = t[3] [11] = c;
			// pix 5 6
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [53] = t[1] [50] = t[2] [13] = t[3] [10] = c;
			// pix 6 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [54] = t[1] [49] = t[2] [14] = t[3] [9] = c;
			// pix 7 6
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [55] = t[1] [48] = t[2] [15] = t[3] [8] = c;

			// row 7
			A=d[tOfst+14]; B=d[tOfst+15];
			// pix 0 7
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [56] = t[1] [63] = t[2] [0] = t[3] [7] = c;
			// pix 1 7
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [57] = t[1] [62] = t[2] [1] = t[3] [6] = c;
			// pix 2 7
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [58] = t[1] [61] = t[2] [2] = t[3] [5] = c;
			// pix 3 7
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [59] = t[1] [60] = t[2] [3] = t[3] [4] = c;
			// pix 4 7
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [60] = t[1] [59] = t[2] [4] = t[3] [3] = c;
			// pix 5 7
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [61] = t[1] [58] = t[2] [5] = t[3] [2] = c;
			// pix 6 7
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [62] = t[1] [57] = t[2] [6] = t[3] [1] = c;
			// pix 7 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [63] = t[1] [56] = t[2] [7] = t[3] [0] = c;


			o.n[i] = t[0];
			o.h[i] = t[1];
			o.v[i] = t[2];
			o.a[i] = t[3];

			i++;
		}

		return o;
	};

})();



/*
// CREATE HARD CODE
let str = '';
let n,h,v,a, o=0;
let hex = dkc2ldd.lib.get_hex2str;
let hx;
for(let y=0; y<8; y++){
	str += `// row ${y}\n`;
	str += `A=d[tOfst+${o}]; B=d[tOfst+${o+1}];\n`;
	for(let x=0; x<8; x++){
		n = (y*8)+x;
		h = (y*8)+(7-x);
		v = ((7-y)*8)+x;
		a = ((7-y)*8)+(7-x);

		str += `// pix ${x} ${y}\n`;
		hx = hex((0x80>>x),'0x');
		str += `c = (A&${hx}?1:0) + (B&${hx}?2:0);\n`
		str += `t[0] [${n}] = t[1] [${h}] = t[2] [${v}] = t[3] [${a}] = c;\n`;
	}
	str += '\n';
	o += 2;
}

// DISPLAY TO COPY
document.body.textContent = "";
let div = document.createElement("div");
div.style.position = "absolute";
div.style.whiteSpace = "pre";
div.style.left = 0;
div.style.right = 0;
document.body.appendChild(div);
div.textContent = str;
*/