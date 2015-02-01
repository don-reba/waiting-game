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
		apartmentView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		apartmentView.GoToStore.Add(this.OnGoToStore.bind(this));
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
