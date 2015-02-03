/// <reference path="IMainModel.ts" />
/// <reference path="IMainView.ts"  />

class MainPresenter
{
	constructor
		( private mainModel : IMainModel
		, private mainView  : IMainView
		)
	{
		mainModel.MoneyChanged.Add(this.OnMoneyChanged.bind(this));

		mainView.DoReset.Add(this.OnDoReset.bind(this));
	}

	Start() : void
	{
		this.StartNewGame();
	}

	private OnMoneyChanged() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
	}

	private OnDoReset() : void
	{
		this.StartNewGame();
	}

	private StartNewGame() : void
	{
		this.mainView.Reset();
		this.mainView.SetClientView(ClientViewType.Apartment);
		this.mainModel.Reset();
	}
}
