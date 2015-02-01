/// <reference path="IMainModel.ts" />
/// <reference path="IMainView.ts"  />

class MainPresenter
{
	constructor
		( private mainModel : IMainModel
		, private mainView  : IMainView
		, private timer     : Timer
		)
	{
		mainModel.MoneyChanged.Add(this.OnMoneyChanged.bind(this));

		mainView.Reset.Add(this.OnReset.bind(this));

		timer.AddEvent(this.OnPay.bind(this), 10);
	}

	Start() : void
	{
		this.StartNewGame();
	}

	private OnMoneyChanged() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
	}

	private OnPay() : void
	{
		var money = this.mainModel.GetMoney();
		this.mainModel.SetMoney(money + 1);
	}

	private OnReset() : void
	{
		this.StartNewGame();
	}

	private StartNewGame() : void
	{
		this.mainView.Initialize();
		this.mainView.SetClientView(ClientViewType.Apartment);
		this.mainModel.SetMoney(0);
	}
}
