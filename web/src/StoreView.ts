/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />

class StoreView implements IStoreView, IClientView
{
	// IStoreView implementation

	GoToApartment = new Signal();

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Store;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		e.text("Store");

		var button = $("<button id='goApartment' type='button' />");
		button.text("вернуться домой");
		button.click(() => { this.GoToApartment.Call(); });
		e.append(button);
	}
}
