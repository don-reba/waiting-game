/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />

class QueueView implements IQueueView, IClientView
{
	// IQueueView implementation

	GoToApartment = new Signal();

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Queue;
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
		text.text("Привет, очередь!");
		e.append(text);
	}
}
