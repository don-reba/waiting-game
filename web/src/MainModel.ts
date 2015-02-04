/// <reference path="IMainModel.ts"  />
/// <reference path="IPersistent.ts" />

class MainModelState
{
	constructor
		( public money : number
		, public view  : ClientViewType
		)
	{
	}
}

class MainModel implements IMainModel, IPersistent
{
	private money : number;
	private view  : ClientViewType;

	constructor
		( private timer : Timer
		)
	{
		timer.AddEvent(this.OnPay.bind(this), 20);
		this.Reset();
	}

	// IMainModel implementation

	MoneyChanged   = new Signal();
	ResetActivated = new Signal();
	ViewChanged    = new Signal();

	GetView() : ClientViewType
	{
		return this.view;
	}

	GetMoney() : number
	{
		return this.money;
	}

	Reset() : void
	{
		this.money = 0;
		this.view  = ClientViewType.Apartment;
		this.ResetActivated.Call();
		this.MoneyChanged.Call();
		this.ViewChanged.Call();
	}

	SetView(view : ClientViewType) : void
	{
		this.view = view;
		this.ViewChanged.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <MainModelState>JSON.parse(str);
		this.money = state.money;
		this.view  = state.view;
		this.ViewChanged.Call();
		this.MoneyChanged.Call();
	}

	ToPersistentString() : string
	{
		var state = new MainModelState
			( this.money
			, this.view
			);
		return JSON.stringify(state);
	}

	// private implementation

	private OnPay() : void
	{
		++this.money;
		this.MoneyChanged.Call();
	}
}
