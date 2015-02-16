/// <reference path="IMainModel.ts"  />
/// <reference path="IPersistent.ts" />

class MainModelState
{
	view : ClientViewType;
}

class MainModel implements IMainModel, IPersistent
{
	private view = ClientViewType.Home;

	constructor
		( private player : Player
		)
	{
		player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
		player.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
	}

	// IMainModel implementation

	MoneyChanged     = new Signal();
	MoustacheChanged = new Signal();
	ViewChanged      = new Signal();

	GetView() : ClientViewType
	{
		return this.view;
	}

	GetMoney() : number
	{
		return this.player.GetMoney();
	}

	GetMoustache() : Moustache
	{
		return this.player.GetMoustache();
	}

	Reset() : void
	{
		localStorage.clear();
		location.reload();
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
		this.view = state.view;
	}

	ToPersistentString() : string
	{
		return JSON.stringify({ view : this.view });
	}

	// private implementation

	private OnMoneyChanged() : void
	{
		this.MoneyChanged.Call();
	}

	private OnMoustacheChanged() : void
	{
		this.MoustacheChanged.Call();
	}
}
