/// <reference path="IApartmentView.ts" />
/// <reference path="IClientView.ts" />

class ApartmentView implements IApartmentView, IClientView
{
	// IApartmentView implementation

	GoToQueue = new Signal();
	GoToStore = new Signal();

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Apartment;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		var header = $("<div>");
		e.append(header);

		var button = $("<button id='goQueue' type='button' />");
		button.text("в очередь");
		button.click(() => { this.GoToQueue.Call(); });
		header.append(button);

		var button = $("<button id='goStore' type='button' />");
		button.text("в магазин");
		button.click(() => { this.GoToStore.Call(); });
		header.append(button);

		var text = $("<p>");
		text.text("Вы у себя дома.");
		e.append(text);
	}
}
