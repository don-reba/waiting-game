class ItemInfo
{
	name        : string;
	description : string;
	price       : number;
	rateBonus   : number;
}

enum Item
{ PencilMoustache = 0
, Tophat          = 1
, TV              = 2
, Table           = 3
, Community       = 4
, Monopoly        = 5
, Stove           = 6
}

class StagedItem
{
	name          : string;
	descriptions  : string[];
	startingPrice : number;
	inflation     : number;
	rateBonus     : number;

	constructor
		( name          : string
		, descriptions  : string[]
		, startingPrice : number
		, inflation     : number
		, rateBonus     : number
		)
	{
		this.name          = name;
		this.descriptions  = descriptions;
		this.startingPrice = startingPrice;
		this.inflation     = inflation;
		this.rateBonus     = rateBonus;
	}

	GetInfo(level : number) : ItemInfo
	{
		if (level < 0 || level >= this.descriptions.length)
			return undefined;
		return <ItemInfo>
			{ name        : this.name
			, description : this.descriptions[level]
			, price       : this.startingPrice * Math.pow(this.inflation, level)
			, rateBonus   : this.rateBonus
			}
	}
}

module Item
{
	var items : ItemInfo[] =
	[
		{ name        : "Усы «Карандаш»"
		, description : "Мужественность со скидкой."
		, price       : 1000
		, rateBonus   : 0.5
		}, // 0
		{ name        : "Шляпа «Цилиндр»"
		, description : "Выбор успешного человека."
		, price       : 10000
		, rateBonus   : 10
		}, // 1
		{ name        : "Телевизор"
		, description : "С тёплым ламповым звуком."
		, price       : 100000
		, rateBonus   : 10
		}, // 2
		{ name        : "Кофейный столик"
		, description : "Для приёма гостей."
		, price       : 50000
		, rateBonus   : 10
		}, // 3
		{ name        : "«Комьюнити»"
		, description : "Испанский 101."
		, price       : 20000
		, rateBonus   : 5
		}, // 4
		{ name        : "«Монополия»"
		, description : "Отличный способ разрушить дружбу."
		, price       : 20000
		, rateBonus   : 5
		}, // 5
		{ name        : "Кухонная плита"
		, description : "+ 100 лучших блинных рецептов."
		, price       : 200000
		, rateBonus   : 10
		}, // 6
	];

	export var Candy = new StagedItem
		( "Конфеты"
		,
			[ "Трюфели"
			, "Фундук «Петрович»"
			, "Миндаль «Товарищ»"
			, "Ириски"
			, "Петербурженка"
			, "Крыжовник в сахарной пудре"
			, "Чайкины лапки"
			, "Арахис в мармеладе"
			, "Алёнушка"
			, "Настенька"
			, "со вкусом полуночных навтов"
			, "со вкусом тюленья в одеяле"
			, "со вкусом клёвых гостей"
			, "со вкусом интересной работы"
			, "M&M's без красных"
			, "Бобы в шоколадной глазури"
			, "Бобы в горьком шоколаде"
			, "Бобы в белом шоколаде"
			, "Бобы в молочном шоколаде"
			, "Речные камешки"
			, "Барбарис"
			, "Марципановая картошка"
			, "Дали"
			, "Фрейд"
			, "Запеченые яблоки Люкс"
			, "Шоколадка+"
			]
		, 50, 1.2, 1
		);

	export function GetInfo(item : Item) : ItemInfo
	{
		return items[item];
	}
}
