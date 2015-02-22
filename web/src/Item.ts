class ItemInfo
{
	name        : string;
	description : string;
	price       : number;
}

enum Item
{
	PencilMoustache = 0
}

module Item
{
	var items : ItemInfo[] =
	[
		{ name        : "Усы «Карандаш»"
		, description : "Мужественность со скидкой."
		, price       : 1000
		}
	];

	export function GetInfo(item : Item) : ItemInfo
	{
		return items[item];
	}
}
