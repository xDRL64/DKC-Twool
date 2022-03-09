
(function(app=dkc2ldd){

	app.gfx.fast.create_4formated2bppTileset = function(rawTileset){

		// _4formatedTileset [tileIndex] [flip(4)] [yPixel(8)] [xPixel(8)]
		// _4formatedTileset .n|.h|.v|.a [tileIndex] [yPixel(8)] [xPixel(8)]

		let data = rawTileset;
		let len = data.length;
		let count = len >> 4; // div by 16

		let o = new Array(count); // tile index dimension
		o.n = new Array(count);
		o.h = new Array(count);
		o.v = new Array(count);
		o.a = new Array(count);
		
		let i = 0; //iTile
		let A,B,C,D;
		let d = data;
		let t;
		let c;
		for(let tOfst=0; tOfst<len; tOfst+=16){

			t = o[i] = new Array(4); // flip dimension

			t[0] = new Array(8); // tile row dimension
				t[0] [0] = new Array(8) // tile pixel dimension
				t[0] [1] = new Array(8) // tile pixel dimension
				t[0] [2] = new Array(8) // tile pixel dimension
				t[0] [3] = new Array(8) // tile pixel dimension
				t[0] [4] = new Array(8) // tile pixel dimension
				t[0] [5] = new Array(8) // tile pixel dimension
				t[0] [6] = new Array(8) // tile pixel dimension
				t[0] [7] = new Array(8) // tile pixel dimension

			t[1] = new Array(8); // tile row dimension
				t[1] [0] = new Array(8) // tile pixel dimension
				t[1] [1] = new Array(8) // tile pixel dimension
				t[1] [2] = new Array(8) // tile pixel dimension
				t[1] [3] = new Array(8) // tile pixel dimension
				t[1] [4] = new Array(8) // tile pixel dimension
				t[1] [5] = new Array(8) // tile pixel dimension
				t[1] [6] = new Array(8) // tile pixel dimension
				t[1] [7] = new Array(8) // tile pixel dimension

			t[2] = new Array(8); // tile row dimension
				t[2] [0] = new Array(8) // tile pixel dimension
				t[2] [1] = new Array(8) // tile pixel dimension
				t[2] [2] = new Array(8) // tile pixel dimension
				t[2] [3] = new Array(8) // tile pixel dimension
				t[2] [4] = new Array(8) // tile pixel dimension
				t[2] [5] = new Array(8) // tile pixel dimension
				t[2] [6] = new Array(8) // tile pixel dimension
				t[2] [7] = new Array(8) // tile pixel dimension

			t[3] = new Array(8); // tile row dimension
				t[3] [0] = new Array(8) // tile pixel dimension
				t[3] [1] = new Array(8) // tile pixel dimension
				t[3] [2] = new Array(8) // tile pixel dimension
				t[3] [3] = new Array(8) // tile pixel dimension
				t[3] [4] = new Array(8) // tile pixel dimension
				t[3] [5] = new Array(8) // tile pixel dimension
				t[3] [6] = new Array(8) // tile pixel dimension
				t[3] [7] = new Array(8) // tile pixel dimension

			// row 0
			A=d[tOfst]; B=d[tOfst+1];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [0][0] = t[1] [0][7] = t[2] [7][0] = t[3] [7][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [0][1] = t[1] [0][6] = t[2] [7][1] = t[3] [7][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [0][2] = t[1] [0][5] = t[2] [7][2] = t[3] [7][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [0][3] = t[1] [0][4] = t[2] [7][3] = t[3] [7][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [0][4] = t[1] [0][3] = t[2] [7][4] = t[3] [7][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [0][5] = t[1] [0][2] = t[2] [7][5] = t[3] [7][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [0][6] = t[1] [0][1] = t[2] [7][6] = t[3] [7][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [0][7] = t[1] [0][0] = t[2] [7][7] = t[3] [7][0] = c;

			// row 1
			A=d[tOfst+2]; B=d[tOfst+3];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [1][0] = t[1] [1][7] = t[2] [6][0] = t[3] [6][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [1][1] = t[1] [1][6] = t[2] [6][1] = t[3] [6][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [1][2] = t[1] [1][5] = t[2] [6][2] = t[3] [6][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [1][3] = t[1] [1][4] = t[2] [6][3] = t[3] [6][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [1][4] = t[1] [1][3] = t[2] [6][4] = t[3] [6][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [1][5] = t[1] [1][2] = t[2] [6][5] = t[3] [6][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [1][6] = t[1] [1][1] = t[2] [6][6] = t[3] [6][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [1][7] = t[1] [1][0] = t[2] [6][7] = t[3] [6][0] = c;

			// row 2
			A=d[tOfst+4]; B=d[tOfst+5];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [2][0] = t[1] [2][7] = t[2] [5][0] = t[3] [5][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [2][1] = t[1] [2][6] = t[2] [5][1] = t[3] [5][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [2][2] = t[1] [2][5] = t[2] [5][2] = t[3] [5][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [2][3] = t[1] [2][4] = t[2] [5][3] = t[3] [5][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [2][4] = t[1] [2][3] = t[2] [5][4] = t[3] [5][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [2][5] = t[1] [2][2] = t[2] [5][5] = t[3] [5][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [2][6] = t[1] [2][1] = t[2] [5][6] = t[3] [5][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [2][7] = t[1] [2][0] = t[2] [5][7] = t[3] [5][0] = c;

			// row 3
			A=d[tOfst+6]; B=d[tOfst+7];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [3][0] = t[1] [3][7] = t[2] [4][0] = t[3] [4][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [3][1] = t[1] [3][6] = t[2] [4][1] = t[3] [4][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [3][2] = t[1] [3][5] = t[2] [4][2] = t[3] [4][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [3][3] = t[1] [3][4] = t[2] [4][3] = t[3] [4][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [3][4] = t[1] [3][3] = t[2] [4][4] = t[3] [4][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [3][5] = t[1] [3][2] = t[2] [4][5] = t[3] [4][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [3][6] = t[1] [3][1] = t[2] [4][6] = t[3] [4][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [3][7] = t[1] [3][0] = t[2] [4][7] = t[3] [4][0] = c;
			
			// row 4
			A=d[tOfst+8]; B=d[tOfst+9];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [4][0] = t[1] [4][7] = t[2] [3][0] = t[3] [3][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [4][1] = t[1] [4][6] = t[2] [3][1] = t[3] [3][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [4][2] = t[1] [4][5] = t[2] [3][2] = t[3] [3][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [4][3] = t[1] [4][4] = t[2] [3][3] = t[3] [3][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [4][4] = t[1] [4][3] = t[2] [3][4] = t[3] [3][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [4][5] = t[1] [4][2] = t[2] [3][5] = t[3] [3][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [4][6] = t[1] [4][1] = t[2] [3][6] = t[3] [3][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [4][7] = t[1] [4][0] = t[2] [3][7] = t[3] [3][0] = c;

			// row 5
			A=d[tOfst+10]; B=d[tOfst+11];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [5][0] = t[1] [5][7] = t[2] [2][0] = t[3] [2][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [5][1] = t[1] [5][6] = t[2] [2][1] = t[3] [2][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [5][2] = t[1] [5][5] = t[2] [2][2] = t[3] [2][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [5][3] = t[1] [5][4] = t[2] [2][3] = t[3] [2][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [5][4] = t[1] [5][3] = t[2] [2][4] = t[3] [2][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [5][5] = t[1] [5][2] = t[2] [2][5] = t[3] [2][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [5][6] = t[1] [5][1] = t[2] [2][6] = t[3] [2][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [5][7] = t[1] [5][0] = t[2] [2][7] = t[3] [2][0] = c;

			// row 6
			A=d[tOfst+12]; B=d[tOfst+13];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [6][0] = t[1] [6][7] = t[2] [1][0] = t[3] [1][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [6][1] = t[1] [6][6] = t[2] [1][1] = t[3] [1][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [6][2] = t[1] [6][5] = t[2] [1][2] = t[3] [1][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [6][3] = t[1] [6][4] = t[2] [1][3] = t[3] [1][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [6][4] = t[1] [6][3] = t[2] [1][4] = t[3] [1][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [6][5] = t[1] [6][2] = t[2] [1][5] = t[3] [1][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [6][6] = t[1] [6][1] = t[2] [1][6] = t[3] [1][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [6][7] = t[1] [6][0] = t[2] [1][7] = t[3] [1][0] = c;

			// row 7
			A=d[tOfst+14]; B=d[tOfst+15];
			// pix 0 0
			c = (A&0x80?1:0) + (B&0x80?2:0);
			t[0] [7][0] = t[1] [7][7] = t[2] [0][0] = t[3] [0][7] = c;
			// pix 0 1
			c = (A&0x40?1:0) + (B&0x40?2:0);
			t[0] [7][1] = t[1] [7][6] = t[2] [0][1] = t[3] [0][6] = c;
			// pix 0 2
			c = (A&0x20?1:0) + (B&0x20?2:0);
			t[0] [7][2] = t[1] [7][5] = t[2] [0][2] = t[3] [0][5] = c;
			// pix 0 3
			c = (A&0x10?1:0) + (B&0x10?2:0);
			t[0] [7][3] = t[1] [7][4] = t[2] [0][3] = t[3] [0][4] = c;
			// pix 0 4
			c = (A&0x08?1:0) + (B&0x08?2:0);
			t[0] [7][4] = t[1] [7][3] = t[2] [0][4] = t[3] [0][3] = c;
			// pix 0 5
			c = (A&0x04?1:0) + (B&0x04?2:0);
			t[0] [7][5] = t[1] [7][2] = t[2] [0][5] = t[3] [0][2] = c;
			// pix 0 6
			c = (A&0x02?1:0) + (B&0x02?2:0);
			t[0] [7][6] = t[1] [7][1] = t[2] [0][6] = t[3] [0][1] = c;
			// pix 0 7
			c = (A&0x01?1:0) + (B&0x01?2:0);
			t[0] [7][7] = t[1] [7][0] = t[2] [0][7] = t[3] [0][0] = c;

			o.n[i] = t[0];
			o.h[i] = t[1];
			o.v[i] = t[2];
			o.a[i] = t[3];

			i++;
		}

		return o;
	};

})();