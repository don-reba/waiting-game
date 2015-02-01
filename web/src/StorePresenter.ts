/// <reference path="IStoreModel.ts" />
/// <reference path="IStoreView.ts"  />
/// <reference path="IMainView.ts"  />

class StorePresenter
{
	constructor
		( private storeModel : IStoreModel
		, private storeView  : IStoreView
		, private mainView   : IMainView
		)
	{
		storeView.GoToApartment.Add(this, this.OnGoToApartment);
	}

	private OnGoToApartment() : void
	{
		this.mainView.SetClientView(ClientViewType.Apartment);
	}
}
