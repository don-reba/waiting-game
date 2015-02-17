/// <reference path="CharacterManager.ts" />
/// <reference path="DialogManager.ts"    />
/// <reference path="IQueueModel.ts"      />
/// <reference path="IPersistent.ts"      />

class QueuePosition
{
	character : ICharacter;
	remaining : number;
	ticket    : string;
}

class QueueModelState
{
	queue    : QueuePosition[];
	player   : QueuePosition;
	ticket   : number;
	dialogID : string;
	speaker  : string;
}

class QueueModel implements IQueueModel
{
	private queue    : QueuePosition[];
	private player   : QueuePosition;
	private ticket   : number;
	private dialogID : string;
	private speaker  : string;

	constructor
		( private timer            : Timer
		, private characterManager : CharacterManager
		, private dialogManager    : DialogManager
		, private maxLength        : number
		)
	{
		timer.AddEvent(this.OnAdvance.bind(this), 20);
		timer.AddEvent(this.OnKnock.bind(this),   19);

		this.ticket = 0;

		this.queue = [];
		for (var i = 0; i != this.maxLength; ++i)
			this.AddStockPosition();
	}

	// IQueueModel implementation

	CurrentTicketChanged = new Signal();
	DialogChanged        = new Signal();
	PeopleChanged        = new Signal();
	PlayerTicketChanged  = new Signal();

	AdvanceDialog(reply : number) : void
	{
		this.dialogID = this.dialogManager.GetRefDialogID(this.dialogID, reply);
		this.DialogChanged.Call();
	}

	EnterQueue() : void
	{
		if (this.queue.every((p) => { return p.character != null; }))
			this.AddPlayerPosition();
	}

	GetDialog() : IDialog
	{
		return this.dialogManager.GetDialog(this.dialogID);
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

	GetSpeaker() : string
	{
		return this.speaker;
	}

	StartDialog(speaker : string) : void
	{
		this.speaker  = speaker;
		this.dialogID = "StdQueueGreetingInit";
		this.DialogChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue    = state.queue;
		this.player   = state.player;
		this.ticket   = state.ticket;
		this.dialogID = state.dialogID;
		this.speaker  = state.speaker;
	}

	ToPersistentString() : string
	{
		var state : QueueModelState =
			{ queue    : this.queue
			, player   : this.player
			, ticket   : this.ticket
			, dialogID : this.dialogID
			, speaker  : this.speaker
			};
		return JSON.stringify(state);
	}

	// private implementation

	private AddStockPosition() : void
	{
		var character;
		do
		{
			character = this.characterManager.GetRandomCharacter();
		} while (this.InQueue(character));

		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		var p         =
			{ character : character
			, remaining : remaining
			, ticket    : ticket
			};

		this.queue.push(p);
	}

	private AddPlayerPosition() : void
	{
		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		var p         =
			{ character : null
			, remaining : remaining
			, ticket    : ticket
			};

		this.queue.push(p);
	}

	private InQueue(c : ICharacter) : boolean
	{
		return this.queue.some((p) => { return p.character && p.character.id === c.id; });
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
				this.PeopleChanged.Call();
			else
				this.PlayerTicketChanged.Call();
			this.CurrentTicketChanged.Call();
		}
	}

	private OnKnock() : void
	{
		if (this.queue.length < this.maxLength && Math.random() < 0.3)
		{
			this.AddStockPosition();
			this.PeopleChanged.Call();
		}
	}
}
