/// <reference path="CharacterManager.ts" />
/// <reference path="DialogManager.ts"    />
/// <reference path="IQueueModel.ts"      />
/// <reference path="IPersistent.ts"      />

class QueuePosition
{
	characterID : string;
	remaining   : number;
	ticket      : string;
}

class QueueModelState
{
	queue     : QueuePosition[];
	ticket    : number;
	dialogID  : string;
	speakerID : string;
}

class QueueModel implements IQueueModel, IPersistent
{
	private queue     : QueuePosition[];
	private playerPos : QueuePosition;
	private ticket    : number;
	private dialogID  : string;
	private speakerID : string;

	private maxLength = 6;

	constructor
		( private timer            : Timer
		, private characterManager : CharacterManager
		, private dialogManager    : DialogManager
		, private player           : Player
		)
	{
		timer.AddEvent(this.OnAdvance.bind(this), 40);
		timer.AddEvent(this.OnKnock.bind(this),   37);

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
		if (this.dialogID == null)
			this.speakerID = null;
		this.DialogChanged.Call();
	}

	EndDialog() : void
	{
		this.dialogID  = null;
		this.speakerID = null;
		this.DialogChanged.Call();
	}

	EnterQueue() : void
	{
		if (this.queue.every(p => { return p.characterID != null; }))
			this.AddPlayerPosition();
	}

	GetCharacters() : ICharacter[]
	{
		return this.queue.map(p => { return this.characterManager.GetCharacter(p.characterID); });
	}

	GetCurrentTicket() : string
	{
		if (this.queue.length > 0)
			return this.queue[0].ticket;
		return null;
	}

	GetDialog() : IDialog
	{
		return this.dialogManager.GetDialog(this.dialogID);
	}

	GetPlayerTicket() : string
	{
		for (var i = 0; i != this.queue.length; ++i)
		{
			if (!this.queue[i].characterID)
				return this.queue[i].ticket;
		}
		return null;
	}

	GetSpeaker() : ICharacter
	{
		return this.characterManager.GetCharacter(this.speakerID);
	}

	StartDialog(speaker : ICharacter) : void
	{
		this.speakerID = speaker.id;
		this.dialogID  = this.characterManager.GetDialogID(speaker.id, DialogType.QueueConversation);

		this.DialogChanged.Call();

		this.player.IntroduceTo(speaker);
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue      = state.queue;
		this.ticket     = state.ticket;
		this.dialogID   = state.dialogID;
		this.speakerID  = state.speakerID;
	}

	ToPersistentString() : string
	{
		var state : QueueModelState =
			{ queue     : this.queue
			, ticket    : this.ticket
			, dialogID  : this.dialogID
			, speakerID : this.speakerID
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
			{ characterID : character.id
			, remaining   : remaining
			, ticket      : ticket
			};

		this.queue.push(p);
	}

	private AddPlayerPosition() : void
	{
		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		var p         =
			{ characterID : null
			, remaining   : remaining
			, ticket      : ticket
			};

		this.queue.push(p);
	}

	private InQueue(c : ICharacter) : boolean
	{
		return this.queue.some(p => { return p.characterID && p.characterID === c.id; });
	}

	private ProcessNextCharacter() : void
	{
		if (this.queue.length == 0)
			return;
		if (this.speakerID && this.queue[0].characterID == this.speakerID)
		{
			this.dialogID = this.characterManager.GetDialogID(this.speakerID, DialogType.QueueEscape);
			this.DialogChanged.Call();
		}
	}

	// event handlers

	private OnAdvance() : void
	{
		if (this.queue.length == 0)
			return;

		var p = this.queue[0];
		--p.remaining;

		if (p.remaining <= 0)
		{
			this.queue.shift();
			if (p.characterID)
			{
				this.ProcessNextCharacter();
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
		if (this.queue.length < this.maxLength && Math.random() < 0.3)
		{
			this.AddStockPosition();
			this.PeopleChanged.Call();
		}
	}
}
