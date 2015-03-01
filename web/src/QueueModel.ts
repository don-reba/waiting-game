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
	queueHead : QueuePosition;
	ticket    : number;
	dialogID  : string;
	speakerID : string;
	holdLast  : boolean;
}

class QueueModel implements IQueueModel, IPersistent
{
	private queue     : QueuePosition[];
	private queueHead : QueuePosition;
	private ticket    : number;
	private dialogID  : string;
	private speakerID : string;
	private holdLast  : boolean;

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

	AdvanceDialog(ref : string) : void
	{
		this.dialogID = ref;
		if (!this.dialogID)
			this.speakerID = null;
		this.DialogChanged.Call();

		this.dialogManager.ActivateDialog(this.dialogID);

		if (this.holdLast)
			this.ReleaseLast();
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
		if (this.queueHead)
			return this.queueHead.ticket;
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
		this.dialogManager.ActivateDialog(this.dialogID);
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue      = state.queue;
		this.queueHead  = state.queueHead;
		this.ticket     = state.ticket;
		this.dialogID   = state.dialogID;
		this.speakerID  = state.speakerID;
		this.holdLast   = state.holdLast;
	}

	ToPersistentString() : string
	{
		var state : QueueModelState =
			{ queue     : this.queue
			, queueHead : this.queueHead
			, ticket    : this.ticket
			, dialogID  : this.dialogID
			, speakerID : this.speakerID
			, holdLast  : this.holdLast
			};
		return JSON.stringify(state);
	}

	// event handlers

	private OnAdvance() : void
	{
		if (this.queue.length == 0)
			return;

		var p = this.queue[0];
		if (!this.holdLast)
			--p.remaining;

		if (p.remaining <= 0)
		{
			if (this.speakerID && p.characterID == this.speakerID)
				this.HoldLast();
			else
				this.ReleaseLast();
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

	private HoldLast() : void
	{
		this.holdLast = true;
		this.dialogID = this.characterManager.GetDialogID(this.speakerID, DialogType.QueueEscape);
		this.DialogChanged.Call();
	}

	private InQueue(c : ICharacter) : boolean
	{
		return this.queue.some(p => { return p.characterID && p.characterID === c.id; });
	}

	private ReleaseLast() : void
	{
		var p = this.queue[0];

		this.holdLast  = false;
		this.queueHead = this.queue[0];
		this.queue.shift();
		this.PeopleChanged.Call();
		if (!p.characterID)
			this.PlayerTicketChanged.Call();
		this.CurrentTicketChanged.Call();
	}
}
