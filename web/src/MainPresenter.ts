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
		mainModel.ViewChanged.Add(this.OnViewChanged.bind(this));

		mainView.ResetRequested.Add(this.OnResetRequested.bind(this));

		this.mainView.SetMoney(this.mainModel.GetMoney());
		this.mainView.SetClientView(this.mainModel.GetView());
	}

	private OnMoneyChanged() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
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
