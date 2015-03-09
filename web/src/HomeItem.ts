/// <reference path="Activity.ts" />

class HomeItemInfo
{
	graphic    : string[];
	x          : number;
	y          : number;
	activities : Activity[];
}

enum HomeItem
{
	TV = 0,
}

module HomeItem
{
	var info : HomeItemInfo[] =
		[
		{ graphic : // TV
			[ "  _________  "
			, "============="
			, "             "
			, "             "
			, "             "
			, "             "
			, "%   %   %   %"
			]
		, x : 33, y : 0
		, activities : [ Activity.TV ]
		}
		];

	export function GetInfo(item : HomeItem) : HomeItemInfo
	{
		return info[item];
	}
}


