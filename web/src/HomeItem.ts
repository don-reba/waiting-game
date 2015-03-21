class HomeItemInfo
{
	graphic    : string[];
	x          : number;
	y          : number;
}

enum HomeItem
{ TV    = 0
, Table = 1
, Stove = 2
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
			[ "        %        "
			, "  ┌─────▬─────┐  "
			, "  │  ╔═════╗  │  "
			, "% │▌ ║     ║ ▐│ %"
			, "  │  ╚═════╝  │  "
			, "  └─────▬─────┘  "
			, "        %        "
			]
		, x : 20, y : 14
		},
		{ graphic : // Stove
			[ "   ╓────┐"
			, "%  ║○ ○ │"
			, "%  ║○ ○ │"
			, "   ╙────┘"
			, " %  %    "
			]
		, x : 60, y : 8
		},
		];

	export function GetInfo(item : HomeItem) : HomeItemInfo
	{
		return info[item];
	}
}


