/// <reference path="Item.ts"        />
/// <reference path="ICharacter.ts"  />
/// <reference path="IPersistent.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Signal.ts"      />

class PlayerState
{
	hat       : Hat;
	moustache : Moustache;
	money     : number;
	rate      : number;
	hasMet    : string[];
	friends   : string[];
	items     : Item[];
}

class Player implements IPersistent
{
	private hat       : Hat       = Hat.None;
	private moustache : Moustache = Moustache.None;
	private money     : number    = 0;
	private rate      : number    = 0.5;
	private hasMet    : string[]  = [];
	private friends   : string[]  = [];
	private items     : Item[]    = [];

	HatChanged       = new Signal();
	MoustacheChanged = new Signal();
	MoneyChanged     = new Signal();
	RateChanged      = new Signal();

	constructor(timer : Timer)
	{
		timer.AddEvent(this.OnPay.bind(this), 10);
	}

	AddItem(item : Item) : void
	{
		if (this.items.indexOf(item) < 0)
			this.items.push(item);
	}

	Befriend(character : ICharacter)
	{
		if (this.friends.indexOf(character.id) < 0)
			this.friends.push(character.id);
	}

	GetFriendIDs() : string[]
	{
		return this.friends;
	}

	GetHat() : Hat
	{
		return this.hat;
	}

	GetItems() : Item[]
	{
		return this.items;
	}

	GetMoney() : number
	{
		return this.money;
	}

	GetMoustache() : Moustache
	{
		return this.moustache;
	}

	GetRate() : number
	{
		return this.rate;
	}

	HasItem(item : Item) : boolean
	{
		return this.items.indexOf(item) >= 0;
	}

	// complexity: linear
	HasNotMet(character : ICharacter) : boolean
	{
		return this.hasMet.indexOf(character.id) < 0;
	}

	// complexity: linear
	IntroduceTo(character : ICharacter) : void
	{
		if (this.hasMet.indexOf(character.id) < 0)
			this.hasMet.push(character.id);
	}

	SetHat(hat : Hat) : void
	{
		this.hat = hat;
		this.HatChanged.Call();
	}

	SetMoney(money : number) : void
	{
		this.money = money;
		this.MoneyChanged.Call();
	}

	SetMoustache(moustache : Moustache) : void
	{
		this.moustache = moustache;
		this.MoustacheChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <PlayerState>JSON.parse(str);
		this.hat       = state.hat;
		this.moustache = state.moustache;
		this.money     = state.money;
		this.rate      = state.rate;
		this.hasMet    = state.hasMet;
		this.friends   = state.friends;
		this.items     = state.items;
	}

	ToPersistentString() : string
	{
		var state : PlayerState =
			{ hat       : this.hat
			, moustache : this.moustache
			, money     : this.money
			, rate      : this.rate
			, hasMet    : this.hasMet
			, friends   : this.friends
			, items     : this.items
			};
		return JSON.stringify(state);
	}

	// private implementation

	private OnPay() : void
	{
		this.money += this.rate;
		this.MoneyChanged.Call();
	}
}
