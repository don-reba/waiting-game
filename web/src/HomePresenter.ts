/// <reference path="IHomeModel.ts" />
/// <reference path="IHomeView.ts"  />
/// <reference path="IMainModel.ts"      />

class HomePresenter
{
	constructor
		( private homeModel : IHomeModel
		, private mainModel : IMainModel
		, private homeView  : IHomeView
		)
	{
		homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		homeView.GoToStore.Add(this.OnGoToStore.bind(this));
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
