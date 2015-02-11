/// <reference path="IQueueModel.ts" />
/// <reference path="IPersistent.ts" />

class Character
{
	constructor(public name : string) { }
}

class QueuePosition
{
	constructor
		( public character : Character
		, public remaining : number
		, public ticket    : string
		)
	{
	}
}

class QueueModelState
{
	constructor
		( public queue  : QueuePosition[]
		, public stock  : Character[]
		, public player : QueuePosition
		, public ticket : number
		)
	{
	}
}

class QueueModel implements IQueueModel
{
	private queue  : QueuePosition[];
	private stock  : Character[];
	private player : QueuePosition;
	private ticket : number;

	constructor
		( private timer     : Timer
		, private maxLength : number
		)
	{
		timer.AddEvent(this.OnAdvance.bind(this), 20);
		timer.AddEvent(this.OnKnock.bind(this),   19);
		this.Reset();
	}

	// IQueueModel implementation

	PlayerTicketChanged  = new Signal();
	CurrentTicketChanged = new Signal();
	PeopleChanged        = new Signal();

	EnterQueue() : void
	{
		if (this.queue.every((p) => { return p.character != null; }))
			this.AddPlayerPosition();
	}

	GetPlayerTicket() : string
	{
		for (var i = 0; i != this.queue.length; ++i)
		{
			if (!this.queue[i].character)
				return this.queue[i].ticket;
		}
		return null;
	}

	GetCurrentTicket() : string
	{
		if (this.queue.length > 0)
			return this.queue[0].ticket;
		return null;
	}

	GetPeopleNames() : string[]
	{
		return this.queue
			.filter((p) => { return p.character != null; })
			.map((p) => { return p.character.name; });
	}

	Reset() : void
	{
		this.stock =
			[ new Character("Аня")
			, new Character("Борис")
			, new Character("Вера")
			, new Character("Григорий")
			, new Character("Даша")
			, new Character("Елена")
			, new Character("Жора")
			, new Character("Зоя")
			, new Character("Инна")
			, new Character("Костик")
			, new Character("Лёша")
			, new Character("Маша")
			, new Character("Настя")
			, new Character("Оля")
			, new Character("Пётр")
			, new Character("Родриг")
			, new Character("Света")
			, new Character("Тамара")
			, new Character("Усач")
			, new Character("Фёдр")
			, new Character("Хосе")
			, new Character("Цезарь")
			, new Character("Чарли")
			, new Character("Шарик")
			, new Character("Элла")
			, new Character("Юра")
			, new Character("Яна")
			];

		this.ticket = 0;

		this.queue = [];
		for (var i = 0; i != this.maxLength; ++i)
			this.AddStockPosition();
	}
	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue  = state.queue;
		this.stock  = state.stock;
		this.player = state.player;
		this.ticket = state.ticket;
		this.PlayerTicketChanged.Call();
		this.CurrentTicketChanged.Call();
		this.PeopleChanged.Call();
	}

	ToPersistentString() : string
	{
		var state = new QueueModelState
			( this.queue
			, this.stock
			, this.player
			, this.ticket
			);
		return JSON.stringify(state);
	}

	// private implementation

	private AddStockPosition() : void
	{
		var i      = Math.floor(Math.random() * this.stock.length);
		var delay  = Math.floor(2 + Math.random() * 8);
		var ticket = String(this.ticket++);
		var p      = new QueuePosition(this.stock[i], delay, ticket);

		this.stock.splice(i, 1);
		this.queue.push(p);
	}

	private AddPlayerPosition() : void
	{
		var delay  = Math.floor(2 + Math.random() * 8);
		var ticket = String(this.ticket++);
		var p      = new QueuePosition(null, delay, ticket);

		this.queue.push(p);
	}

	private OnAdvance() : void
	{
		if (this.queue.length == 0)
			return;

		var p = this.queue[0];
		--p.remaining;

		if (p.remaining <= 0)
		{
			this.queue.shift();
			if (p.character)
			{
				this.stock.push(p.character);
				this.PeopleChanged.Call();
			}
			else
			{
				this.PlayerTicketChanged.Call();
			}
			this.CurrentTicketChanged.Call();
		}
	}

	private OnKnock() : void
	{
		if (this.queue.length < this.maxLength && Math.random() < 0.25)
		{
			this.AddStockPosition();
			this.PeopleChanged.Call();
		}
	}
}
