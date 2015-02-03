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
		var header = $("<div>");
		e.append(header);

		var button = $("<button id='goApartment' type='button' />");
		button.text("вернуться домой");
		button.click(() => { this.GoToApartment.Call(); });
		header.append(button);

		var text = $("<p>");
		text.text("Что вы здесь делаете? Кризис на дворе!");
		e.append(text);
	}
}
