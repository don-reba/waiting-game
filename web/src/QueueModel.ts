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
	head      : QueuePosition;
	ticket    : number;
	dialogID  : string;
	speakerID : string;
}

class QueueModel implements IQueueModel, IPersistent
{
	private queue     : QueuePosition[];
	private head      : QueuePosition;
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

		this.ticket = 1;

		this.queue = [];

		this.head = this.MakeStockPosition();

		for (var i = 0; i != this.maxLength; ++i)
			this.queue.push(this.MakeStockPosition());
	}

	// IQueueModel implementation

	CurrentTicketChanged = new Signal();
	DialogChanged        = new Signal();
	PeopleChanged        = new Signal();
	PlayerTicketChanged  = new Signal();

	AdvanceDialog(ref : string) : void
	{
		var finishedLastMansDialog = !ref && this.queue[0].characterID == this.speakerID
		var waitingToAdvance = !this.head || this.head.remaining <= 0;
		if (finishedLastMansDialog && waitingToAdvance)
			this.AdvanceQueue();

		this.dialogID = ref;
		if (!this.dialogID)
			this.speakerID = null;
		this.DialogChanged.Call();

		this.dialogManager.ActivateDialog(this.dialogID);
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
			this.queue.push(this.MakePlayerPosition());
	}

	GetCharacters() : ICharacter[]
	{
		var characters : ICharacter[] = [];
		for (var i = 0; i != this.queue.length; ++i)
		{
			var c = this.characterManager.GetCharacter(this.queue[i].characterID);
			if (c && this.player.HasNotMet(c))
				characters.push({ id : c.id, name : "\\o/" });
			else if (!c)
				characters.push(null);
			else
				characters.push(c);
		}
		return characters;
	}

	GetCurrentTicket() : string
	{
		if (this.head)
			return this.head.ticket;
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

		var hasNotMet = this.player.HasNotMet(speaker);

		this.player.IntroduceTo(speaker);
		this.dialogManager.ActivateDialog(this.dialogID);

		if (hasNotMet)
			this.PeopleChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue      = state.queue;
		this.head  = state.head;
		this.ticket     = state.ticket;
		this.dialogID   = state.dialogID;
		this.speakerID  = state.speakerID;
	}

	ToPersistentString() : string
	{
		var state : QueueModelState =
			{ queue     : this.queue
			, head : this.head
			, ticket    : this.ticket
			, dialogID  : this.dialogID
			, speakerID : this.speakerID
			};
		return JSON.stringify(state);
	}

	// event handlers

	private OnAdvance() : void
	{
		var head = this.head;

		if (head && head.remaining > 0)
			--head.remaining;

		if (!head || head.remaining <= 0)
		{
			if (this.speakerID && this.queue.length > 0 && this.queue[0].characterID == this.speakerID)
				this.HoldLast();
			else
				this.AdvanceQueue();
		}
	}

	private OnKnock() : void
	{
		if (this.queue.length < this.maxLength && Math.random() < 0.3)
		{
			this.queue.push(this.MakeStockPosition());
			this.PeopleChanged.Call();
		}
	}

	// private implementation

	private MakeStockPosition() : QueuePosition
	{
		var character;
		do
		{
			character = this.characterManager.GetRandomCharacter();
		} while (this.InQueue(character));

		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		return <QueuePosition>
			{ characterID : character.id
			, remaining   : remaining
			, ticket      : ticket
			};
	}

	private MakePlayerPosition() : QueuePosition
	{
		var remaining = Math.floor(2 + Math.random() * 8);
		var ticket    = String(this.ticket++);
		return <QueuePosition>
			{ characterID : null
			, remaining   : remaining
			, ticket      : ticket
			};
	}

	private HoldLast() : void
	{
		this.dialogID = this.characterManager.GetDialogID(this.speakerID, DialogType.QueueEscape);
		this.DialogChanged.Call();
	}

	private InQueue(c : ICharacter) : boolean
	{
		return this.queue.some(p => { return p.characterID && p.characterID === c.id; });
	}

	private AdvanceQueue() : void
	{
		if (this.queue.length > 0)
		{
			this.head = this.queue[0];
			this.queue.shift();
			this.CurrentTicketChanged.Call();
			this.PeopleChanged.Call();
			if (!this.head.characterID)
				this.PlayerTicketChanged.Call();
		}
		else
		{
			this.head = null;
		}
		this.CurrentTicketChanged.Call();
	}
}
