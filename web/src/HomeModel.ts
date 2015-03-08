/// <reference path="HomeItem.ts"    />
/// <reference path="IHomeModel.ts"  />
/// <reference path="IPersistent.ts" />

class HomeModelState
{
	waitingGuests   : string[];
	guests          : string[];
	atEntrance      : boolean;
	activeItem      : HomeItem;
	dialogID        : string;
	speakerID       : string;
}

class HomeModel implements IHomeModel, IPersistent
{
	private canvas          : string[][];
	private waitingGuests   : string[];
	private guests          : string[];
	private atEntrance      : boolean;
	private items           : HomeItem[];
	private activeItem      : HomeItem;

	private dialogID  : string;
	private speakerID : string;

	private nx : number = 78;
	private ny : number = 23;

	// IHomeModel implementation

	DialogChanged = new Signal();
	GuestsChanged = new Signal();
	StateChanged  = new Signal();

	constructor
		( private timer            : Timer
		, private characterManager : CharacterManager
		, private dialogManager    : DialogManager
		)
	{
		timer.AddEvent(this.OnAdvance.bind(this), 25);

		this.canvas = [];
		for (var y = 0; y != this.ny; ++y)
			this.canvas.push(new Array<string>(this.nx));

		this.waitingGuests   = [];
		this.guests          = [];

		this.items = [ HomeItem.TV ];
	}

	AdvanceDialog(ref : string) : void
	{
		this.dialogID = ref;
		if (!this.dialogID)
			this.speakerID = null;
		this.DialogChanged.Call();
	}

	AreGuestsArriving() : boolean
	{
		return this.waitingGuests.length > 0;
	}

	AreGuestsIn() : boolean
	{
		return this.guests.length > 0;
	}

	GetCanvas() : HomeCanvas
	{
		this.Clear();
		for (var i = 0; i != this.items.length; ++i)
		{
			var item = this.items[i];
			if (item == this.activeItem)
				this.RenderActiveItem(item);
			else
				this.RenderInactiveItem(item);
		}
		if (this.atEntrance)
			this.RenderEntrance();

		var characters : HomeCanvasCharacter[] =
			[ { character : null, isClickable : false } ];
		for (var i = 0; i != this.guests.length; ++i)
		{
			var character : HomeCanvasCharacter =
				{ character   : this.characterManager.GetCharacter(this.guests[i])
				, isClickable : !this.atEntrance || i != this.guests.length - 1
				};
			characters.push(character);
		}

		return <HomeCanvas>
			{ rows       : this.MergeLines(this.canvas)
			, characters : characters
			};
	}

	GetDialog() : IDialog
	{
		return this.dialogManager.GetDialog(this.dialogID);
	}

	GetSpeaker() : ICharacter
	{
		return this.characterManager.GetCharacter(this.speakerID);
	}

	InviteFriends(friends : ICharacter[]) : void
	{
		for (var i = 0; i != friends.length; ++i)
			this.waitingGuests.push(friends[i].id);
		this.guests     = [];
		this.activeItem = HomeItem.TV;
		this.StateChanged.Call();
	}

	IsGuestAtTheDoor() : boolean
	{
		return this.atEntrance;
	}

	LetTheGuestIn() : void
	{
		this.atEntrance = false;
		this.GuestsChanged.Call();
		if (this.waitingGuests.length == 0)
			this.StateChanged.Call();
	}

	SetActivity(activity : Activity) : void
	{
		switch (activity)
		{
		case Activity.Stop:
			this.guests = [];
			this.activeItem = null;
			this.GuestsChanged.Call();
			this.StateChanged.Call();
			break;
		}
	}

	StartDialog(speaker : ICharacter) : void
	{
		this.speakerID = speaker.id;
		this.dialogID  = this.characterManager.GetDialogID(speaker.id, DialogType.HomeConversation);
		this.DialogChanged.Call();
	}

	// event handlers

	private OnAdvance() : void
	{
		if (this.atEntrance)
			return;

		if (this.waitingGuests.length == 0)
			return;

		if (Math.random() < 0.5)
			return;

		var i = Math.floor(Math.random() * this.waitingGuests.length);
		var id = this.waitingGuests[i];
		this.waitingGuests.splice(i, 1);
		this.guests.push(id);

		this.atEntrance = true;

		this.GuestsChanged.Call();

		this.speakerID = id;
		this.dialogID  = this.characterManager.GetDialogID(id, DialogType.HomeArrival);
		this.DialogChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <HomeModelState>JSON.parse(str);
		this.waitingGuests = state.waitingGuests;
		this.guests        = state.guests;
		this.atEntrance    = state.atEntrance;
		this.activeItem    = state.activeItem;
		this.dialogID      = state.dialogID;
		this.speakerID     = state.speakerID;
	}

	ToPersistentString() : string
	{
		var state : HomeModelState =
			{ waitingGuests : this.waitingGuests
			, guests        : this.guests
			, atEntrance    : this.atEntrance
			, activeItem    : this.activeItem
			, dialogID      : this.dialogID
			, speakerID     : this.speakerID
			};
		return JSON.stringify(state);
	}

	// private implementation

	private Clear()
	{
		for (var y = 0; y != this.ny; ++y)
		{
			var line = this.canvas[y];
			for (var x = 0; x != this.nx; ++x)
				line[x] = " ";
		}
	}

	private RenderEntrance() : void
	{
		var info = HomeItem.GetInfo(HomeItem.Entrance);
		// the last guest is the one at the entrance
		this.canvas[info.y][info.x] = String(this.guests.length);
	}

	private RenderActiveItem(item : HomeItem) : void
	{
		var i = 0;
		var n = this.atEntrance
			? this.guests.length
			: this.guests.length + 1;

		var info = HomeItem.GetInfo(item);
		var gfx = info.graphic;
		for (var y = 0; y != gfx.length; ++y)
		{
			var src = gfx[y];
			var dst = this.canvas[info.y + y];
			for (var x = 0; x != src.length; ++x)
			{
				var c = src[x];
				if (c === "%")
					c = i < n ? String(i++) : ' ';
				dst[info.x + x] = c;
			}
		}
	}

	private RenderInactiveItem(item : HomeItem) : void
	{
		var info = HomeItem.GetInfo(item);
		var gfx = info.graphic;
		for (var y = 0; y != gfx.length; ++y)
		{
			var src = gfx[y];
			var dst = this.canvas[info.y + y];
			for (var x = 0; x != src.length; ++x)
			{
				var c = src[x];
				dst[info.x + x] = (c === "%") ? ' ' : c;
			}
		}
	}

	private MergeLines(canvas : string[][]) : string[]
	{
		var result = Array<string>(canvas.length);
		for (var y = 0; y != canvas.length; ++y)
			result[y] = canvas[y].join("");
		return result;
	}
}
