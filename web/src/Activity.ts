enum Activity
{ None      = 0
, Stop      = 1
, Community = 2
, Monopoly  = 3
}
module Activity
{
	var names : string[] =
		[ "Убивать время"
		, "Разойтись по домам"
		, "Смотреть комьюнити"
		, "Играть в Монополию"
		];

	export function GetName(activity : Activity) : string
	{
		return names[activity];
	}
}
