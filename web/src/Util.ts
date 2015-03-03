module Util
{
	export function Sample<T>(a : Array<T>) : T
	{
		if (a.length > 0)
			return a[Math.floor(Math.random() * a.length)];
	}

	export function AlignUnderneath(anchor : JQuery, element : JQuery) : void
	{
		var p = anchor.position();
		var h = anchor.outerHeight(false);

		var x = p.left;
		var y = p.top + h;

		element.css({ left : x + "px", top : y + "px" });
	}
}
