/// <reference path="HomeItem.ts"    />
/// <reference path="IHomeModel.ts"  />
/// <reference path="IPersistent.ts" />

class HomeModelState
{
	waitingGuests : string[];
	guests        : string[];
	atEntrance    : boolean;
	activity      : HomeItem;
	dialogID      : string;
	speakerID     : string;
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

	private dialogID  : string;
	private speakerID : string;

	private maxFriends = 3;  // has to be single-digit
	private nx         = 78;
	private ny         = 23;

	// IHomeModel implementation

	DialogChanged   = new Signal();
	FriendsArriving = new Signal();
	GuestsChanged   = new Signal();

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

		this.waitingGuests = [];
		this.guests        = [];

		this.items = [ HomeItem.TV ];
	}

	AdvanceDialog(reply : number) : void
	{
		this.dialogID = this.dialogManager.GetRefDialogID(this.dialogID, reply);
		if (this.dialogID == null)
			this.speakerID = null;
		this.DialogChanged.Call();
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

	GetDialog() : IDialog
	{
		return this.dialogManager.GetDialog(this.dialogID);
	}

	GetFriends() : ICharacter[]
	{
		return this.characterManager.GetAllCharacters();
	}

	GetSpeaker() : ICharacter
	{
		return this.characterManager.GetCharacter(this.speakerID);
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

	IsGuestAtTheDoor() : boolean
	{
		return this.atEntrance;
	}

	IsInviteEnabled() : boolean
	{
		return this.selectedFriends.length > 0;
	}

	LetTheGuestIn() : void
	{
		this.atEntrance = false;
		this.GuestsChanged.Call();
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

		var i = Math.floor(Math.random() * this.waitingGuests.length);
		var waiting = this.waitingGuests[i];
		this.waitingGuests.splice(i, 1);
		this.guests.push(waiting);

		this.atEntrance = true;

		this.GuestsChanged.Call();

		var speaker = this.characterManager.GetCharacter(waiting);

		this.speakerID = speaker.id;
		this.dialogID  = this.characterManager.GetDialogID(speaker.id, DialogType.HomeArrival);
		this.DialogChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <HomeModelState>JSON.parse(str);
		this.waitingGuests = state.waitingGuests;
		this.guests        = state.guests;
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
