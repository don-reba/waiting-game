/// <reference path="HomeItem.ts"    />
/// <reference path="IHomeModel.ts"  />
/// <reference path="IPersistent.ts" />
/// <reference path="Util.ts"        />

interface Position
{
	x : number;
	y : number;
}

interface Guest
{
	id : string;
	x  : number;
	y  : number;
}

interface HomeModelState
{
	waitingGuests   : string[];
	guests          : Guest[];
	atEntrance      : boolean;
	activeItem      : HomeItem;
	dialogID        : string;
	speakerID       : string;
}

class HomeModel implements IHomeModel, IPersistent
{
	private canvas        : string[][];
	private waitingGuests : string[];
	private guests        : Guest[];
	private targets       : Guest[];
	private atEntrance    : boolean;
	private items         : HomeItem[];
	private activeItem    : HomeItem;

	private positions : Position[];

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
		timer.AddEvent(this.OnKnock.bind(this), 25);

		this.canvas = [];
		for (var y = 0; y != this.ny; ++y)
			this.canvas.push(new Array<string>(this.nx));

		this.waitingGuests = [];
		this.guests        = [];
		this.targets       = [];

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
			this.RenderItem(this.items[i]);

		var characters : HomeCanvasCharacter[] = [];
		for (var i = 0; i != this.guests.length; ++i)
		{
			var guest = this.guests[i];

			this.canvas[guest.y][guest.x] = String(i);

			var isPlayer     = guest.id == null;
			var isAtEntrance = isAtEntrance && i == this.guests.length - 1;

			var character : HomeCanvasCharacter =
				{ character   : this.characterManager.GetCharacter(guest.id)
				, isClickable : !isPlayer && !isAtEntrance
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

	InviteGuests(guests : ICharacter[]) : void
	{
		for (var i = 0; i != guests.length; ++i)
			this.waitingGuests.push(guests[i].id);

		var player = <Guest>
			{ id : null
			, x  : this.positions[0].x
			, y  : this.positions[0].y
			};
		this.guests = [ player ];
		this.positions.shift();

		this.GuestsChanged.Call();
		this.StateChanged.Call();
	}

	IsGuestAtTheDoor() : boolean
	{
		return this.atEntrance;
	}

	LetTheGuestIn() : void
	{
		this.atEntrance = null;

		var guest = this.guests[this.guests.length - 1];
		var pos   = this.positions[0];
		this.positions.shift();
		guest.x = pos.x;
		guest.y = pos.y;

		this.GuestsChanged.Call();

		if (this.waitingGuests.length == 0)
			this.StateChanged.Call();
	}

	SetActiveItem(item : HomeItem) : void
	{
		// get the free positions for this activity
		this.positions = [];
		var info      = HomeItem.GetInfo(item);
		var gfx       = info.graphic;
		for (var y = 0; y != gfx.length; ++y)
		{
			var line = gfx[y];
			for (var x = 0; x != line.length; ++x)
			{
				if (line[x] == "%")
					this.positions.push(<Position> { x : info.x + x, y : info.y + y });
			}
		}
	}

	SetActivity(activity : Activity) : void
	{
		switch (activity)
		{
		case Activity.Stop:
			this.guests     = [];
			this.activeItem = null;
			this.GuestsChanged.Call();
			this.StateChanged.Call();
			break;
		case Activity.TV:
			this.SetActiveItem(HomeItem.TV);
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

	private OnKnock() : void
	{
		if (this.atEntrance)
			return;

		if (this.waitingGuests.length == 0)
			return;

		if (Math.random() < 0.5)
			return;

		var i  = Util.Random(this.waitingGuests.length);
		var id = this.waitingGuests[i];
		this.waitingGuests.splice(i, 1);
		this.guests.push({ id : id, x : 2, y : 12});

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

	private RenderItem(item : HomeItem) : void
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
