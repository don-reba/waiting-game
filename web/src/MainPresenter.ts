/// <reference path="IMainModel.ts" />
/// <reference path="IMainView.ts"  />

class MainPresenter
{
	constructor
		( private mainModel : IMainModel
		, private mainView  : IMainView
		)
	{
		mainModel.GameStarted.Add(this.OnGameStarted.bind(this));

		mainView.Reset.Add(this.OnReset.bind(this));
	}

	Start() : void
	{
		this.StartNewGame();
	}

	private OnGameStarted() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
	}

	private OnReset() : void
	{
		this.StartNewGame();
	}

	private StartNewGame() : void
	{
		this.mainView.Initialize();
		this.mainView.SetClientView(ClientViewType.Apartment);
		this.mainModel.NewGame();
	}
}
