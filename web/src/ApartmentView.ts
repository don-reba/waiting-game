/// <reference path="IApartmentView.ts" />
/// <reference path="IClientView.ts" />

class ApartmentView implements IApartmentView, IClientView
{
	// IApartmentView implementation

	GoToQueue : () => void;
	GoToStore : () => void;

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
		e.text("Apartment");

		var button = $("<button id='goQueue' type='button' />");
		button.text("в очередь");
		button.click(() => { this.GoToQueue(); });
		e.append(button);

		var button = $("<button id='goStore' type='button' />");
		button.text("в магазин");
		button.click(() => { this.GoToStore(); });
		e.append(button);
	}
}
