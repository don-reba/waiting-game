/// <reference path="IMainModel.ts"  />
/// <reference path="IStoreModel.ts" />
/// <reference path="IStoreView.ts"  />

class StorePresenter
{
	constructor
		( private mainModel  : IMainModel
		, private storeModel : IStoreModel
		, private storeView  : IStoreView
		)
	{
		storeView.GoToHome.Add(this.OnGoToHome.bind(this));
	}

	private OnGoToHome() : void
	{
		this.mainModel.SetView(ClientViewType.Home);
	}
}
