class HomeItemInfo
{
	graphic : string[];
	x       : number;
	y       : number;
}

enum HomeItem
{
	Entrance = 0,
	TV       = 1,
}

module HomeItem
{
	var info : HomeItemInfo[] =
		[
		{ graphic : // Entrance
			[]
		, x : 2, y : 12
		},
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
		}
		];

	export function GetInfo(item : HomeItem) : HomeItemInfo
	{
		return info[item];
	}
}


