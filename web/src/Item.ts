class ItemInfo
{
	name        : string;
	description : string;
	price       : number;
}

enum Item
{
	PencilMoustache = 0,
	Tophat          = 1
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
		}
	];

	export function GetInfo(item : Item) : ItemInfo
	{
		return items[item];
	}
}
