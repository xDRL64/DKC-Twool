

dkc2ldd.imgPack = (function(){

	let o = {};

	// <- left

	o.left = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAY0lEQVRIidXQMRIAIQgEQf7/aYwuUZGFMfA2n64Csz/PadwG3ADgBoA5LgG7WAaiWAJOcQpk8RFQ4hBQ4y1QiRegGjuN7wL4hCtP7CDhMKAi6TCQIfIwECHlYWBG2sPAhzywAbWe0S9/4dVbAAAAAElFTkSuQmCC";


	// -> right

	o.right = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAYklEQVRIidXSORLAIAxDUd//0k5FA14klIHk93qFx2Zfyd8AJMRNRNxEZAZoJAIoJANgpAIgpANaBAFKBAVShAFChAUWZAfw68C9I4YdeaQyadwBUNI4A6ik8QxsJY0H8NMe4DjRL6h2qQkAAAAASUVORK5CYII=";


	// graphics of collision set

	o.gfxCollisionset = "data:image/png;base64,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";


	// alpha bg texture

	o.alphaTex = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAVSURBVBhXY6ivrz98+DADENfX1wMANOIHjfsyn+QAAAAASUVORK5CYII=";
	

	return o;
	
})();
