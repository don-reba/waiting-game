/// <reference path="ICharacter.ts"  />
/// <reference path="IPersistent.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Signal.ts"      />

class PlayerState
{
	moustache : Moustache;
	money     : number;
	rate      : number;
	hasMet    : string[];
}

class Player implements IPersistent
{
	private moustache : Moustache = Moustache.None;
	private money     : number    = 0;
	private rate      : number    = 0.5;
	private hasMet    : string[]  = [];

	MoustacheChanged = new Signal();
	MoneyChanged     = new Signal();
	RateChanged      = new Signal();

	constructor(timer : Timer)
	{
		timer.AddEvent(this.OnPay.bind(this), 10);
	}

	GetMoney() : number
	{
		return this.money;
	}

	GetRate() : number
	{
		return this.rate;
	}

	GetMoustache() : Moustache
	{
		return this.moustache;
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

	SetMoney(money : number)
	{
		this.money = money;
		this.MoneyChanged.Call();
	}

	SetMoustache(moustache : Moustache)
	{
		this.moustache = moustache;
		this.MoustacheChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <PlayerState>JSON.parse(str);
		this.moustache = state.moustache;
		this.money     = state.money;
		this.rate      = state.rate;
		this.hasMet    = state.hasMet;
	}

	ToPersistentString() : string
	{
		var state : PlayerState =
			{ moustache : this.moustache
			, money     : this.money
			, rate      : this.rate
			, hasMet    : this.hasMet
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
