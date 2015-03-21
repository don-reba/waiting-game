enum Activity
{ None      = 0
, Stop      = 1
, TV        = 2
, Community = 3
, Monopoly  = 4
, Civ       = 5
, Cooking   = 6
}
module Activity
{
	var descriptions : string[] =
		[ "Убивать время"
		, "Разойтись по домам"
		, "Смотреть телевизор"
		, "Смотреть комьюнити"
		, "Играть в Монополию"
		, "Играть в Цивилизацию"
		, "Готовить ужин"
		];

	export function GetDescription(activity : Activity) : string
	{
		return descriptions[activity];
	}
}
