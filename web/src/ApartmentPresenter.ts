/// <reference path="IApartmentModel.ts" />
/// <reference path="IApartmentView.ts"  />
/// <reference path="IMainView.ts"  />

class ApartmentPresenter
{
	constructor
		( private apartmentModel : IApartmentModel
		, private apartmentView  : IApartmentView
		, private mainView       : IMainView
		)
	{
		apartmentView.GoToQueue = () => { this.OnGoToQueue(); };
		apartmentView.GoToStore = () => { this.OnGoToStore(); };
	}

	private OnGoToQueue() : void
	{
		this.mainView.SetClientView(ClientViewType.Queue);
	}

	private OnGoToStore() : void
	{
		this.mainView.SetClientView(ClientViewType.Store);
	}
}
