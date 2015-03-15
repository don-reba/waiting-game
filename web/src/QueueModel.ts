/// <reference path="CharacterManager.ts" />
/// <reference path="DialogManager.ts"    />
/// <reference path="IQueueModel.ts"      />
/// <reference path="IPersistent.ts"      />
/// <reference path="Util.ts"             />

class QueuePosition
{
	characterID : string;
	remaining   : number;
	spokenTo    : boolean;
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

		player.Awkward.Add(this.OnAwkward.bind(this));

		this.ticket = 1;
		this.queue  = [];
		this.head   = this.MakeStockPosition();

		for (var i = 0; i != this.maxLength; ++i)
			this.queue.push(this.MakeStockPosition());
	}

	Remove(character : ICharacter) : void
	{
		for (var i = 0; i != this.queue.length; ++i)
		{
			if (this.queue[i].characterID != character.id)
				continue;
			this.queue.splice(i, 1);
			this.PeopleChanged.Call();
			return;
		}
	}

	// IQueueModel implementation

	CurrentTicketChanged = new Signal();
	DialogChanged        = new Signal();
	PeopleChanged        = new Signal();
	PlayerTicketChanged  = new Signal();

	EnterQueue() : void
	{
		if (this.queue.every(p => { return p.characterID != null }))
			this.queue.push(this.MakePlayerPosition());
	}

	GetCharacters() : [ICharacter, boolean][]
	{
		var characters = [];
		for (var i = 0; i != this.queue.length; ++i)
		{
			var c = this.characterManager.GetCharacter(this.queue[i].characterID);
			if (c && this.player.HasNotMet(c))
				c = { id : c.id, name : "\\o/" };
			characters.push([c, c == null || !this.SpokenTo(c)]);
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

	SetDialog(ref : string) : void
	{
		if (ref)
		{
			this.player.ResetComposure();

			this.dialogID = ref;

			this.dialogManager.ActivateDialog(this.dialogID);
		}
		else
		{
			this.player.ClearComposure();

			var finishedLastMansDialog = this.queue[0].characterID == this.speakerID;
			var waitingToAdvance = !this.head || this.head.remaining <= 0;
			if (finishedLastMansDialog && waitingToAdvance)
				this.AdvanceQueue();

			this.dialogID = this.speakerID = null;
		}
		this.DialogChanged.Call();
	}

	StartDialog(speaker : ICharacter) : void
	{
		this.speakerID = speaker.id;
		this.dialogID  = this.characterManager.GetDialogID(speaker.id, DialogType.QueueConversation);

		this.DialogChanged.Call();

		this.GetPosition(speaker).spokenTo = true;

		this.PeopleChanged.Call();


		if (this.player.HasNotMet(speaker))
		{
			this.player.IntroduceTo(speaker);
			this.PeopleChanged.Call();
		}

		this.player.ResetComposure();
		this.dialogManager.ActivateDialog(this.dialogID);
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <QueueModelState>JSON.parse(str);
		this.queue     = state.queue;
		this.head      = state.head;
		this.ticket    = state.ticket;
		this.dialogID  = state.dialogID;
		this.speakerID = state.speakerID;
	}

	ToPersistentString() : string
	{
		var state : QueueModelState =
			{ queue     : this.queue
			, head      : this.head
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

	private OnAwkward() : void
	{
		if (!this.speakerID)
			return;

		this.speakerID = "";
		this.dialogID  = "StdPterodactyl";
		this.DialogChanged.Call();

		for (var i = 0; i != this.queue.length; ++i)
		{
			if (this.queue[i].characterID)
				continue;
			this.queue.splice(i, 1);
			this.PeopleChanged.Call();
			this.PlayerTicketChanged.Call();
			break;
		}
	}

	private OnKnock() : void
	{
		if (this.queue.length < this.maxLength && Math.random() < 0.4)
		{
			var p = this.MakeStockPosition();
			this.queue.push(p);

			this.PeopleChanged.Call();
		}
	}

	// private implementation

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

	private GenerateRemaining() : number
	{
		var min = 4;
		var max = 16;
		return min + Util.Random(max - min);
	}

	private GetPosition(character : ICharacter) : QueuePosition
	{
		var id = character ? character.id : null;
		for (var i = 0; i != this.queue.length; ++i)
		{
			var p = this.queue[i];
			if (p.characterID == id)
				return p;
		}
	}

	private HoldLast() : void
	{
		var holdDialogID = this.characterManager.GetDialogID(this.speakerID, DialogType.QueueEscape);
		if (this.dialogID != holdDialogID)
		{
			this.dialogID = holdDialogID;
			this.DialogChanged.Call();
		}
	}

	private InQueue(c : ICharacter) : boolean
	{
		return this.queue.some(p => { return p.characterID && p.characterID === c.id });
	}

	private MakeStockPosition() : QueuePosition
	{
		var character;
		do
		{
			character = this.characterManager.GetRandomCharacter();
		} while (this.InQueue(character));

		return <QueuePosition>
			{ characterID : character.id
			, remaining   : this.GenerateRemaining()
			, spokenTo    : false
			, ticket      : String(this.ticket++)
			};
	}

	private MakePlayerPosition() : QueuePosition
	{
		return <QueuePosition>
			{ characterID : null
			, remaining   : this.GenerateRemaining()
			, spokenTo    : false
			, ticket      : String(this.ticket++)
			};
	}

	private SpokenTo(character : ICharacter) : boolean
	{
		for (var i = 0; i != this.queue.length; ++i)
		{
			var p = this.queue[i];
			if (p.characterID == character.id)
				return p.spokenTo;
		}
		return false;
	}
}
