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
		storeModel.ItemStatusChanged.Add(this.OnItemStatusChanged.bind(this));
		storeModel.Purchased.Add(this.OnPurchased.bind(this));

		storeView.GoToHome.Add(this.OnGoToHome.bind(this));
		storeView.Hidden.Add(this.OnHidden.bind(this));
		storeView.ItemSelected.Add(this.OnItemSelected.bind(this));
		storeView.Shown.Add(this.OnShown.bind(this));
	}

	private OnGoToHome() : void
	{
		this.mainModel.SetView(ClientViewType.Home);
	}

	private OnHidden() : void
	{
		this.storeModel.Deactivate();
	}

	private OnItemSelected() : void
	{
		this.storeModel.Purchase(this.storeView.GetSelectedItem());
	}

	private OnItemStatusChanged() : void
	{
		var item = this.storeModel.GetChangedItem();
		this.storeView.SetItemStatus(item[0], item[1]);
	}

	private OnPurchased() : void
	{
		this.storeView.SetItems(this.storeModel.GetItems());
	}

	private OnShown()
	{
		this.storeView.SetItems(this.storeModel.GetItems());
	}
}
