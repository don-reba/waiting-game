/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />

class QueueView implements IQueueView, IClientView
{
	selectedPerson : string = null;
	selectedReply  : number = -1;

	// IQueueView implementation

	GoToApartment = new Signal();
	PersonClicked = new Signal();
	ReplyClicked  = new Signal();
	Shown         = new Signal();

	ClearCurrentTicket() : void
	{
		$("#clientArea #current").text("");
	}

	ClearPlayerTicket() : void
	{
		$("#clientArea #player").text("");
	}

	GetSelectedReply() : number
	{
		return this.selectedReply;
	}

	SetCurrentTicket(ticket : string) : void
	{
		$("#clientArea #current").text("текущий номер: " + ticket);
	}

	SetDialog(dialog : IDialog) : void
	{
		var div = $("#clientArea #dialog");
		div.empty();

		if (!dialog)
			return;

		div.append($("<p><strong>" + this.selectedPerson + "</strong>: " + dialog.text + "</p>"));

		var ol = $("<ol>");
		for (var i = 0; i != dialog.replies.length; ++i)
		{
			var OnClick = function(e)
			{
				this.selectedReply = e.data;
				this.ReplyClicked.Call();
			}
			var li = $("<li>");
			li.text(dialog.replies[i].text);
			li.click(i, OnClick.bind(this));
			ol.append(li);
		}
		div.append(ol);
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
			var OnClick = function(e)
			{
				this.selectedPerson = e.data;
				this.PersonClicked.Call();
			}
			var button = $("<button>");
			button.text(names[i]);
			button.click(names[i], OnClick.bind(this));
			people.append(button);
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
		e.append($("<div id='dialog' />"));

		this.Shown.Call();
	}
}
