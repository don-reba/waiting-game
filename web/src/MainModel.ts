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
		player.HatChanged.Add(this.OnHatChanged.bind(this));
		player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
		player.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
	}

	// IMainModel implementation

	HatChanged       = new Signal();
	MoneyChanged     = new Signal();
	MoustacheChanged = new Signal();
	ViewChanged      = new Signal();

	GetHat() : Hat
	{
		return this.player.GetHat();
	}

	GetMoney() : string
	{
		var money = Math.floor(this.player.GetMoney());
		var rate  = Math.round(this.player.GetRate() * 10) / 10;
		return money.toLocaleString() + " руб. (" + rate.toLocaleString() + " руб./с)";
	}

	GetMoustache() : Moustache
	{
		return this.player.GetMoustache();
	}

	GetView() : ClientViewType
	{
		return this.view;
	}

	OpenAbout() : void
	{
		window.location.href = "about.html";
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

	private OnHatChanged() : void
	{
		this.HatChanged.Call();
	}

	private OnMoneyChanged() : void
	{
		this.MoneyChanged.Call();
	}

	private OnMoustacheChanged() : void
	{
		this.MoustacheChanged.Call();
	}
}
