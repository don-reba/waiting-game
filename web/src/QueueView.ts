/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />

class QueueView implements IQueueView, IClientView
{
	// IQueueView implementation

	GoToApartment : () => void;

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
		e.text("Queue");

		var button = $("<button id='goApartment' type='button' />");
		button.text("вернуться домой");
		button.click(() => { this.GoToApartment(); });
		e.append(button);
	}
}
