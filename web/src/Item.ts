class ItemInfo
{
	name        : string;
	description : string;
	price       : number;
}

enum Item
{ PencilMoustache = 0
, Tophat          = 1
, TV              = 2
, Table           = 3
, Community       = 4
, Monopoly        = 5
}

module Item
{
	var items : ItemInfo[] =
	[
		{ name        : "Усы «Карандаш»"
		, description : "Мужественность со скидкой."
		, price       : 1000
		},
		{ name        : "Шляпа «Цилиндр»"
		, description : "Выбор успешного человека."
		, price       : 10000
		},
		{ name        : "Телевизор"
		, description : "С тёплым ламповым звуком."
		, price       : 100000
		},
		{ name        : "Кофейный столик"
		, description : "Для приёма гостей."
		, price       : 50000
		},
		{ name        : "«Комьюнити»"
		, description : "Испанский 101"
		, price       : 20000
		},
		{ name        : "«Монополия»"
		, description : "Отличный способ разрушить дружбу."
		, price       : 20000
		},
	];

	export function GetInfo(item : Item) : ItemInfo
	{
		return items[item];
	}
}
