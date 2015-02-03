/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />

class QueueView implements IQueueView, IClientView
{
	// IQueueView implementation

	GoToApartment = new Signal();
	Shown         = new Signal();

	ClearCurrentTicket() : void
	{
		$("#clientArea #current").text("");
	}

	ClearPlayerTicket() : void
	{
		$("#clientArea #player").text("");
	}

	SetCurrentTicket(ticket : string) : void
	{
		$("#clientArea #current").text("текущий номер: " + ticket);
	}

	SetPlayerTicket(ticket : string) : void
	{
		$("#clientArea #player").text("ваш номер: " + ticket);
	}

	SetPeopleNames(names : string[]) : void
	{
		var people = $("#clientArea #people");
		people.empty();

		for (var i = 0; i != names.length; ++i)
		{
			var btn = $("<button>");
			btn.text(names[i]);
			people.append(btn);
		}
	}

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

		e.append($("<p id='player' />"));
		e.append($("<p id='current' />"));
		e.append($("<div id='people' />"));

		this.Shown.Call();
	}
}
