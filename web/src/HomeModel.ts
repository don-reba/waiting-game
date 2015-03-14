/// <reference path="HomeItem.ts"    />
/// <reference path="IHomeModel.ts"  />
/// <reference path="IPersistent.ts" />
/// <reference path="Player.ts"      />
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

interface Target
{
	id : string;
	x  : number;
	y  : number;
}

interface HomeModelState
{
	waitingGuests : string[];
	guests        : Guest[];
	targets       : Target[];
	positions     : Position[];
	atEntrance    : boolean;
	activity      : Activity;
	dialogID      : string;
	speakerID     : string;
}

class HomeModel implements IHomeModel, IPersistent
{
	private canvas : string[][];

	private waitingGuests : string[]   = [];
	private guests        : Guest[]    = [];
	private targets       : Target[]   = [];
	private positions     : Position[] = [];
	private atEntrance    : boolean    = false;
	private activity      : Activity   = Activity.None;


	private dialogID  : string;
	private speakerID : string;

	private nx    : number = 78;
	private ny    : number = 23;
	private speed : number = 3;

	constructor
		( private timer            : Timer
		, private characterManager : CharacterManager
		, private dialogManager    : DialogManager
		, private player           : Player
		)
	{
		timer.AddEvent(this.OnAnimate.bind(this), 2);
		timer.AddEvent(this.OnKnock.bind(this), 25);

		player.Awkward.Add(this.OnAwkward.bind(this));

		this.canvas = [];
		for (var y = 0; y != this.ny; ++y)
			this.canvas.push(new Array<string>(this.nx));
	}

	// IHomeModel implementation

	DialogChanged = new Signal();
	GuestsChanged = new Signal();
	StateChanged  = new Signal();

	AreGuestsArriving() : boolean
	{
		return this.waitingGuests.length > 0;
	}

	AreGuestsIn() : boolean
	{
		return this.guests.length > 0;
	}

	GetActivity() : Activity
	{
		return this.activity;
	}

	GetCanvas() : HomeCanvas
	{
		this.Clear();
		var items = this.GetHomeItems();
		for (var i = 0; i != items.length; ++i)
			this.RenderItem(items[i]);

		var characters : HomeCanvasCharacter[] = [];
		for (var i = 0; i != this.guests.length; ++i)
		{
			var guest = this.guests[i];
			var x     = Math.round(guest.x);
			var y     = Math.round(guest.y);

			this.RenderGuest(i);

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

		var target : Target =
			{ id : this.guests[this.guests.length - 1].id
			, x  : this.positions[0].x
			, y  : this.positions[0].y
			};
		this.targets.push(target);
		this.positions.shift();

		this.GuestsChanged.Call();

		if (this.waitingGuests.length == 0)
			this.StateChanged.Call();
	}

	SetActivity(activity : Activity) : void
	{
		switch (activity)
		{
		case Activity.Stop:
			this.guests   = [];
			this.activity = Activity.None;
			this.GuestsChanged.Call();
			this.StateChanged.Call();
			break;
		default:
			this.activity = activity;
			this.UpdateActiveItem();

			this.targets = [];
			for (var i = 0; i != this.guests.length; ++i)
			{
				var target : Target =
					{ id : this.guests[i].id
					, x  : this.positions[i].x
					, y  : this.positions[i].y
					};
				this.targets.push(target);
			}
		}
	}

	StartDialog(speaker : ICharacter) : void
	{
		this.speakerID = speaker.id;
		this.dialogID  = this.characterManager.GetDialogID(speaker.id, DialogType.HomeConversation);
		this.player.ResetComposure();
		this.DialogChanged.Call();
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

			this.dialogID = this.speakerID = null;
		}
		this.DialogChanged.Call();
	}

	// event handlers

	private OnAnimate() : void
	{
		if (this.targets.length == 0)
			return;

		for (var i = 0; i != this.targets.length; ++i)
		{
			var t = this.targets[i];
			var g = this.guests.find(g => { return g.id == t.id });

			var dx = t.x - g.x;
			var dy = t.y - g.y;

			var d = Math.sqrt(dx * dx + dy * dy);

			if (d > this.speed)
			{
				// move towards destnation
				g.x += dx * this.speed / d;
				g.y += dy * this.speed / d;
			}
			else
			{
				// arrive at destination
				g.x = t.x;
				g.y = t.y;
				this.targets.splice(i, 1);
				--i;
			}
		}

		this.GuestsChanged.Call();
	}

	private OnAwkward() : void
	{
		if (!this.speakerID)
			return;

		this.speakerID = "";
		this.dialogID  = "StdPterodactyl";
		this.DialogChanged.Call();

		this.guests   = [];
		this.activity = Activity.None;
		this.GuestsChanged.Call();
		this.StateChanged.Call();
	}

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
		this.targets       = state.targets;
		this.positions     = state.positions;
		this.atEntrance    = state.atEntrance;
		this.activity      = state.activity;
		this.dialogID      = state.dialogID;
		this.speakerID     = state.speakerID;
	}

	ToPersistentString() : string
	{
		var state : HomeModelState =
			{ waitingGuests : this.waitingGuests
			, guests        : this.guests
			, targets       : this.targets
			, positions     : this.positions
			, atEntrance    : this.atEntrance
			, activity      : this.activity
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

	private GetHomeItems() : HomeItem[]
	{
		var items = [];
		if (this.player.HasItem(Item.TV))
			items.push(HomeItem.TV);
		if (this.player.HasItem(Item.Table))
			items.push(HomeItem.Table);
		return items;
	}

	private IsDigit(n : any) : boolean
	{
		return [true, true, true, true][<number>n];
	}

	private MergeLines(canvas : string[][]) : string[]
	{
		var result = Array<string>(canvas.length);
		for (var y = 0; y != canvas.length; ++y)
			result[y] = canvas[y].join("");
		return result;
	}

	private RenderGuest(i : number) : void
	{
		var guest = this.guests[i];
		var x     = Math.round(guest.x);
		var y     = Math.round(guest.y);

		// check that we don't overlap another guest
		var row = this.canvas[y];
		if (this.IsDigit(row[x-1]) || this.IsDigit(row[x]) || this.IsDigit(row[x+1]))
			return;

		row[x-1] = row[x] = row[x+1] = String(i);
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

	private UpdateActiveItem() : void
	{
		var item = null;
		switch (this.activity)
		{
		case Activity.Community: item = HomeItem.TV;    break;
		case Activity.Monopoly:  item = HomeItem.Table; break;
		}

		// get the free positions for this activity
		this.positions = [];
		if (item == null)
			return;
		var info = HomeItem.GetInfo(item);
		var gfx  = info.graphic;
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
}
