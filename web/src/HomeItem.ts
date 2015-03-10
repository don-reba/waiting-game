class HomeItemInfo
{
	graphic    : string[];
	x          : number;
	y          : number;
}

enum HomeItem
{ TV    = 0
, Table = 1
}

module HomeItem
{
	var info : HomeItemInfo[] =
		[
		{ graphic : // TV
			[ "  _________  "
			, "═════════════"
			, "             "
			, "             "
			, "             "
			, "             "
			, "%   %   %   %"
			]
		, x : 32, y : 0
		},
		{ graphic : // Tabletop
			[ "         %         "
			, "   ┌───────────┐   "
			, "   │  ╔═════╗  │   "
			, " % │  ║     ║  │ % "
			, "   │  ╚═════╝  │   "
			, "   └───────────┘   "
			, "         %         "
			]
		, x : 29, y : 9
		}
		];

	export function GetInfo(item : HomeItem) : HomeItemInfo
	{
		return info[item];
	}
}


