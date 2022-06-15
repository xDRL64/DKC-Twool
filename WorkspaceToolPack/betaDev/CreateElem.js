dkc2ldd.ScriptPackLoader.connector().wrapper = (function(){
	
	let flags = {
		posRel:1, posAbs:1,
		disBlk:1, disInb:1, disInl:1, disFlx:1, disGrd:1,
		ovfHid:1, ovxHid:1, ovyHid:1, ovfScl:1, ovxScl:1, ovyScl:1,
		wtsPre:1,
		bxszbb:1,
		fdrRow:1, fdrCln:1, jtcCen:1, atmCen:1,
	};

	let SetElem = function(elem, settings={}){

		// suported shortcut names :
		let {
			posRel, posAbs,
			display, disBlk, disInb, disInl, disFlx, disGrd,
			left, right, top, bottom,
			ovfHid, ovxHid, ovyHid, ovfScl, ovxScl, ovyScl,
			whiSpa, wtsPre,
			bgCol,
			w, width, h, height,
			padding,
			bxszbb,
			margin,
			txtCnt, _type, _value, _size, _min, _max, _step,
			flxDir, fdrRow, fdrCln,
			flxGrw, flxShr,
			jusCnt, jtcCen,
			alnItm, atmCen,
		} = settings;

		// position prop
		if(posRel) elem.style.position = 'relative';
		if(posAbs) elem.style.position = 'absolute';

		// left/right/top/bottom prop
		left = left?.toString();
		if(left) elem.style.left = left;
		right = right?.toString();
		if(right) elem.style.right = right;
		top = top?.toString();
		if(top) elem.style.top = top;
		bottom = bottom?.toString();
		if(bottom) elem.style.bottom = bottom;

		display = display?.toString();
		if(display) elem.style.display = display;
		if(disBlk) elem.style.display = 'block';
		if(disInb) elem.style.display = 'inline-block';
		if(disInl) elem.style.display = 'inline';
		if(disFlx) elem.style.display = 'flex';
		if(disGrd) elem.style.display = 'grid';

		// overflow prop
		if(ovfHid) elem.style.overflow = 'hidden';
		if(ovxHid) elem.style.overflowX = 'hidden';
		if(ovyHid) elem.style.overflowY = 'hidden';

		if(ovfScl) elem.style.overflow = 'scroll';
		if(ovxScl) elem.style.overflowX = 'scroll';
		if(ovyScl) elem.style.overflowY = 'scroll';

		// space/breakline prop
		whiSpa = whiSpa?.toString();
		if(whiSpa) elem.style.whiteSpace = whiSpa;
		if(wtsPre) elem.style.whiteSpace = 'pre'; 

		// color prop
		bgCol = bgCol?.toString();
		if(bgCol) elem.style.backgroundColor = bgCol;

		// dimension prop
		width = width?.toString() || w?.toString();
		if(width) elem.style.width = width;

		height = height?.toString() || h?.toString();
		if(height) elem.style.height = height;

		padding = padding?.toString();
		if(padding) elem.style.padding = padding;

		if(bxszbb) elem.style.boxSizing = 'border-box';

		// margin prop
		margin = margin?.toString();
		if(margin) elem.style.margin = margin;

		// .textContent
		txtCnt = txtCnt?.toString();
		if(txtCnt) elem.textContent = txtCnt;

		// attributes
		_type = _type?.toString();
		if(_type) elem.setAttribute('type', _type);
		
		_value = _value?.toString();
		if(_value) elem.setAttribute('value', _value);

		_size = _size?.toString();
		if(_size) elem.setAttribute('size', _size);

		_min = _min?.toString();
		if(_min) elem.setAttribute('min', _min);

		_max = _max?.toString();
		if(_max) elem.setAttribute('max', _max);

		_step = _step?.toString();
		if(_step) elem.setAttribute('step', _step);

		// flex prop
		flxDir = flxDir?.toString();
		if(flxDir) elem.style.flexDirection = flxDir;
		if(fdrRow) elem.style.flexDirection = 'row';
		if(fdrCln) elem.style.flexDirection = 'column';

		jusCnt = jusCnt?.toString();
		if(jusCnt) elem.style.justifyContent = jusCnt;
		if(jtcCen) elem.style.justifyContent = 'center';

		alnItm = alnItm?.toString();
		if(alnItm) elem.style.alignItems = alnItm;
		if(atmCen) elem.style.alignItems = 'center';

		flxGrw = flxGrw?.toString();
		if(flxGrw) elem.style.flexGrow = flxGrw;

		flxShr = flxShr?.toString();
		if(flxShr) elem.style.flexShrink = flxShr;
		
	};

	let CreateElem = function(type, settings={}){
		let elem = document.createElement(type);
		SetElem(elem, settings);
		return elem;
	};

	CreateElem.flags = flags;
	CreateElem.Set = SetElem;

	return CreateElem;

})();