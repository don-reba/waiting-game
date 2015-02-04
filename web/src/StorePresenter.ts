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
		storeView.GoToApartment.Add(this.OnGoToApartment.bind(this));
	}

	private OnGoToApartment() : void
	{
		this.mainModel.SetView(ClientViewType.Apartment);
	}
}
