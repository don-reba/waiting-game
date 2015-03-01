/// <reference path="IMainModel.ts" />
/// <reference path="IMainView.ts"  />

class MainPresenter
{
	constructor
		( private mainModel : IMainModel
		, private mainView  : IMainView
		)
	{
		mainModel.HatChanged.Add(this.OnHatChanged.bind(this));
		mainModel.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
		mainModel.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
		mainModel.ViewChanged.Add(this.OnViewChanged.bind(this));

		mainView.ResetRequested.Add(this.OnResetRequested.bind(this));
	}

	LightsCameraAction()
	{
		this.mainView.SetHat(this.mainModel.GetHat());
		this.mainView.SetMoney(this.mainModel.GetMoney());
		this.mainView.SetMoustache(this.mainModel.GetMoustache());
		this.mainView.SetClientView(this.mainModel.GetView());
	}

	private OnHatChanged() : void
	{
		this.mainView.SetHat(this.mainModel.GetHat());
	}

	private OnMoneyChanged() : void
	{
		this.mainView.SetMoney(this.mainModel.GetMoney());
	}

	private OnMoustacheChanged() : void
	{
		this.mainView.SetMoustache(this.mainModel.GetMoustache());
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
