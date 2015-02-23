module Util
{
	export function Sample<T>(a : Array<T>) : T
	{
		if (a.length > 0)
			return a[Math.floor(Math.random() * a.length)];
	}
}
