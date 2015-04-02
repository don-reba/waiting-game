class ItemInfo
{
	name        : string;
	description : string;
	price       : number;
	rateBonus   : number;
}

enum Item
{ Tophat    = 0
, TV        = 1
, Table     = 2
, Community = 3
, Monopoly  = 4
, Stove     = 5
, Civ       = 6
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
		{ name        : "Шляпа"
		, description : "Цилиндр"
		, price       : 10000
		, rateBonus   : 20
		}, // 0
		{ name        : "Телевизор"
		, description : "С тёплым ламповым звуком."
		, price       : 100000
		, rateBonus   : 10
		}, // 1
		{ name        : "Кофейный столик"
		, description : "Для приёма гостей."
		, price       : 50000
		, rateBonus   : 10
		}, // 2
		{ name        : "«Комьюнити»"
		, description : "Испанский 101."
		, price       : 20000
		, rateBonus   : 5
		}, // 3
		{ name        : "«Монополия»"
		, description : "Отличный способ разрушить дружбу."
		, price       : 20000
		, rateBonus   : 5
		}, // 4
		{ name        : "Кухонная плита"
		, description : "+ 100 лучших блинных рецептов."
		, price       : 200000
		, rateBonus   : 10
		}, // 5
		{ name        : "«Цивилизация»"
		, description : "Ещё один ход."
		, price       : 20000
		, rateBonus   : 10
		}, // 6
	];

	export var Moustache = new StagedItem
		( "Усы"
		,
			[ "Карандаш"
			, "Зубная щётка"
			, "Морж"
			, "Фу Манчу"
			, "Дали"
			, "Венгерские"
			, "Английские"
			, "Шеврон"
			, "Кручёные"
			]
		, 1000, 2, 5
		);

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
			, "со вкусом тюления в одеяле"
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
			, "Моне"
			, "Дали"
			, "Ницше"
			, "Фрейд"
			, "Полудний Звон"
			, "Запеченые яблоки Люкс"
			, "Шоколадка им. Лёши"
			, "Шоколадка+"
			, "Шоколадка++"
			, "Шоколадка+++"
			, "Шоколадка++++"
			, "Шоколадка+++"
			, "Шоколадка++"
			, "Шоколадка+"
			, "Шоколадка"
			, "Шоколадк"
			, "Шоколад"
			, "Шокола"
			, "Шокол"
			, "Шоко"
			, "Шок"
			, "Шо"
			, "Ш"
			]
		, 50, 1.3, 1
		);

	export function GetInfo(item : Item) : ItemInfo
	{
		return items[item];
	}
}
