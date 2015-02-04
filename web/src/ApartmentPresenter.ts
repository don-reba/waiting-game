/// <reference path="IApartmentModel.ts" />
/// <reference path="IApartmentView.ts"  />
/// <reference path="IMainModel.ts"      />

class ApartmentPresenter
{
	constructor
		( private apartmentModel : IApartmentModel
		, private mainModel      : IMainModel
		, private apartmentView  : IApartmentView
		)
	{
		apartmentView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		apartmentView.GoToStore.Add(this.OnGoToStore.bind(this));
	}

	private OnGoToQueue() : void
	{
		this.mainModel.SetView(ClientViewType.Queue);
	}

	private OnGoToStore() : void
	{
		this.mainModel.SetView(ClientViewType.Store);
	}
}
