enum Activity
{
	None = 0,
	Stop = 1,
	TV   = 2
}
module Activity
{
	var names : string[] =
		[ "Убивать время"
		, "Разойтись по домам"
		, "Смотреть фильмы"
		];

	export function GetName(activity : Activity) : string
	{
		return names[activity];
	}
}
