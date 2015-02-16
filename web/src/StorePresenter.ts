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
		storeModel.Purchased.Add(this.OnPurchased.bind(this));

		storeView.GoToHome.Add(this.OnGoToHome.bind(this));
		storeView.ItemSelected.Add(this.OnItemSelected.bind(this));
		storeView.Shown.Add(this.OnShown.bind(this));
	}

	private OnGoToHome() : void
	{
		this.mainModel.SetView(ClientViewType.Home);
	}

	private OnItemSelected() : void
	{
		this.storeModel.Purchase(this.storeView.GetSelectedItem());
	}

	private OnPurchased() : void
	{
		this.storeView.SetItems(this.storeModel.GetItems());
	}

	private OnShown()
	{
		this.storeModel.UpdateStock();
		this.storeView.SetItems(this.storeModel.GetItems());
	}
}
