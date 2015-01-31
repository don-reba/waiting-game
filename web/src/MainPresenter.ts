class MainPresenter
{
	constructor
		( private mainModel : IMainModel
		, private mainView  : IMainView
		)
	{
		mainModel.GameStarted = () => { this.OnGameStarted(); };

		mainView.Reset = () => { this.OnReset(); };
	}

	Start() : void
	{
		this.mainView.Initialize();
		this.mainModel.NewGame();
	}

	private OnGameStarted() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
	}

	private OnReset() : void
	{
		this.mainView.Initialize();
		this.mainModel.NewGame();
	}
}
