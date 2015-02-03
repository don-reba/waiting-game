/// <reference path="IQueueModel.ts" />

class Character
{
	constructor(public name : string) { }
}

class QueuePosition
{
	constructor
		( public character : Character
		, public delay     : number
		, public ticket    : string
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
			[ new Character("Alice")
			, new Character("Bob")
			, new Character("Charlie")
			, new Character("Dan")
			, new Character("Ellie")
			, new Character("Fate")
			, new Character("George")
			, new Character("Hope")
			, new Character("Ian")
			, new Character("Jack")
			, new Character("Ken")
			];

		this.ticket = 0;

		this.queue = [];
		for (var i = 0; i != this.maxLength; ++i)
			this.AddStockPosition();
		this.ProcessNext();
	}

	// private implementation

	private AddStockPosition() : void
	{
		var j      = Math.floor(Math.random() * this.stock.length);
		var delay  = Math.floor(20 + Math.random() * 80);
		var ticket = String(this.ticket++);
		var p      = new QueuePosition(this.stock[j], delay, ticket);

		this.stock.splice(j, 1);
		this.queue.push(p);
	}

	private AddPlayerPosition() : void
	{
		var delay  = Math.floor(20 + Math.random() * 80);
		var ticket = String(this.ticket++);
		var p      = new QueuePosition(null, delay, ticket);

		this.queue.push(p);
	}

	private OnAdvance() : void
	{
		this.ProcessNext();

		this.PlayerTicketChanged.Call();
		this.CurrentTicketChanged.Call();
		this.PeopleChanged.Call();
	}

	private OnNewcomer() : void
	{
		this.AddStockPosition();

		this.PeopleChanged.Call();
	}

	private ProcessNext() : void
	{
		if (this.queue.length == 0)
			return;
		var p = this.queue[0];
		this.queue.shift();

		if (p.character)
			this.stock.push(p.character);

		this.timer.AddOneTimeEvent(this.OnAdvance.bind(this), p.delay);
		var noise = Math.floor(Math.random() * 40) - 20;
		this.timer.AddOneTimeEvent(this.OnNewcomer.bind(this), Math.max(1, p.delay + noise));
	}
}
