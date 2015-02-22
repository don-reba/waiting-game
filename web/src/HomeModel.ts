/// <reference path="HomeItem.ts"    />
/// <reference path="IHomeModel.ts"  />
/// <reference path="IPersistent.ts" />

class HomeModelState
{
	waitingGuests : string[];
	guests        : string[];
	atEntrance    : boolean;
	activity      : HomeItem;
}

class HomeModel implements IHomeModel, IPersistent
{
	private canvas          : string[][];
	private selectedFriends : string[];
	private waitingGuests   : string[];
	private guests          : string[];
	private atEntrance      : boolean;
	private items           : HomeItem[];
	private activity        : HomeItem;

	private maxFriends = 3;  // has to be single-digit
	private nx         = 78;
	private ny         = 23;

	// IHomeModel implementation

	FriendsArriving = new Signal();
	GuestsChanged   = new Signal();

	constructor
		( private characterManager : CharacterManager
		, private timer            : Timer
		)
	{
		timer.AddEvent(this.OnAdvance.bind(this), 20);

		this.canvas = [];
		for (var y = 0; y != this.ny; ++y)
			this.canvas.push(new Array<string>(this.nx));

		this.waitingGuests = [];
		this.guests        = [];

		this.items = [ HomeItem.TV ];
	}

	AreGuestsIn() : boolean
	{
		return this.waitingGuests.length + this.guests.length > 0;
	}

	ClearFriendSelection() : void
	{
		this.selectedFriends = [];
	}

	GetCanvas() : HomeCanvas
	{
		this.Clear();
		for (var i = 0; i != this.items.length; ++i)
		{
			var item = this.items[i];
			if (item == this.activity)
				this.RenderActiveItem(item);
			else
				this.RenderInactiveItem(item);
		}
		if (this.atEntrance)
			this.RenderEntrance();

		var characters = [ null ];
		for (var i = 0; i != this.guests.length; ++i)
		{
			var guest = this.guests[i];
			characters.push(this.characterManager.GetCharacter(guest));
		}

		return <HomeCanvas>
			{ rows       : this.MergeLines(this.canvas)
			, characters : characters
			};
	}

	GetFriends() : ICharacter[]
	{
		return this.characterManager.GetAllCharacters();
	}

	InviteFriends() : void
	{
		if (this.selectedFriends.length == 0)
			return;

		for (var i = 0; i != this.selectedFriends.length; ++i)
			this.waitingGuests.push(this.selectedFriends[i]);
		this.selectedFriends = [];
		this.guests          = [];
		this.activity        = HomeItem.TV;
		this.FriendsArriving.Call();
	}

	IsFriendLimitReached() : boolean
	{
		return this.selectedFriends.length >= this.maxFriends;
	}

	IsInviteEnabled() : boolean
	{
		return this.selectedFriends.length > 0;
	}

	SetFriendStatus(character : ICharacter, enabled : boolean) : void
	{
		var f = this.selectedFriends;
		var i = f.indexOf(character.id);
		if (enabled)
		{
			if (i < 0)
				f.push(character.id);
		}
		else
		{
			if (i >= 0)
				f.splice(i, 1);
		}
	}

	// event handlers

	private OnAdvance() : void
	{
		if (this.atEntrance)
		{
			this.atEntrance = false;
			this.GuestsChanged.Call();
		}

		var waiting = this.waitingGuests;
		if (waiting.length == 0)
			return;

		var i = Math.floor(Math.random() * waiting.length);
		this.guests.push(waiting[i]);
		waiting.splice(i, 1);

		this.atEntrance = true;

		this.GuestsChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <HomeModelState>JSON.parse(str);
		this.waitingGuests = state.waitingGuests;
		this.guests        = state.guests;
		this.atEntrance    = state.atEntrance;
		this.activity      = state.activity;
	}

	ToPersistentString() : string
	{
		var state : HomeModelState =
			{ waitingGuests : this.waitingGuests
			, guests        : this.guests
			, atEntrance    : this.atEntrance
			, activity      : this.activity
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
