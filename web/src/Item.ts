enum Item
{
	PencilMoustache
}

class ItemInfo
{
	name        : string;
	description : string;
	price       : number;
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
