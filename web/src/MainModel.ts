/// <reference path="IMainModel.ts"  />
/// <reference path="IPersistent.ts" />

class MainModelState
{
	money : number;
	view  : ClientViewType;
}

class MainModel implements IMainModel, IPersistent
{
	private view  : ClientViewType;

	constructor
		( private player : Player
		)
	{
		player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
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
		return this.player.money;
	}

	Reset() : void
	{
		this.view  = ClientViewType.Home;
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
		this.view  = state.view;
		this.ViewChanged.Call();
	}

	ToPersistentString() : string
	{
		return JSON.stringify({ view : this.view });
	}

	private OnMoneyChanged() : void
	{
		this.MoneyChanged.Call();
	}
}
