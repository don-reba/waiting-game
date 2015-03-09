module Util
{
	export function AlignUnderneath(anchor : JQuery, element : JQuery) : void
	{
		var p = anchor.position();
		var h = anchor.outerHeight(false);

		var x = p.left;
		var y = p.top + h;

		element.css({ left : x + "px", top : y + "px" });
	}

	export function Random(n : number) : number
	{
		return Math.floor(Math.random() * n);
	}
}

//-----------------
// array extensions
//-----------------

interface Array<T>
{
	find(f : (T) => boolean) : T;

	sample() : T;
}

Array.prototype.find = function<T>(f : (T) => boolean) : T
{
	for (var i = 0; i != this.length; ++i)
	{
		if (f(this[i]))
			return this[i];
	}
}

Array.prototype.sample = function<T>() : T
{
	if (this.length > 0)
		return this[Math.floor(Math.random() * this.length)];
}
