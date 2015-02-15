/// <reference path="IPersistent.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Signal.ts"      />

class PlayerState
{
	moustache : Moustache;
	money     : number;
	rate      : number;
}

class Player implements IPersistent
{
	MoustacheChanged = new Signal();
	MoneyChanged     = new Signal();
	RateChanged      = new Signal();

	moustache = Moustache.None;
	money     = 0;
	rate      = 1;

	constructor(timer : Timer)
	{
		timer.AddEvent(this.OnPay.bind(this), 20);
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <PlayerState>JSON.parse(str);
		this.moustache = state.moustache;
		this.money     = state.money;
		this.rate      = state.rate;
	}

	ToPersistentString() : string
	{
		var state : PlayerState =
			{ moustache : this.moustache
			, money     : this.money
			, rate      : this.rate
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
