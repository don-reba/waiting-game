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
		mainModel.ResetActivated.Add(this.OnResetActivated.bind(this));
		mainModel.ViewChanged.Add(this.OnViewChanged.bind(this));

		mainView.ResetRequested.Add(this.OnResetRequested.bind(this));
	}

	Start() : void
	{
		this.mainModel.Reset();
	}

	private OnMoneyChanged() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
	}

	private OnResetActivated() : void
	{
		//this.mainView.Reset();
	}

	private OnResetRequested() : void
	{
		this.mainModel.Reset();
	}

	private OnViewChanged() : void
	{
		this.mainView.SetClientView(this.mainModel.GetView());
	}
}
