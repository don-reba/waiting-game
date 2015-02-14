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
		$("#queue #current").text("");
	}

	ClearPlayerTicket() : void
	{
		$("#queue #player").text("");
	}

	GetSelectedReply() : number
	{
		return this.selectedReply;
	}

	GetSpeaker() : string
	{
		return this.selectedPerson;
	}

	SetCurrentTicket(ticket : string) : void
	{
		$("#queue #current").text("текущий номер: " + ticket);
	}

	SetDialog(speaker : string, dialog : IDialog) : void
	{
		var div = $("#queue #dialog");
		div.empty();

		if (!dialog)
			return;

		div.append($("<p><strong>" + speaker + "</strong>: " + dialog.text + "</p>"));

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
		$("#queue #player").text("ваш номер: " + ticket);
	}

	SetPeopleNames(names : string[]) : void
	{
		var people = $("#queue #people");
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
		e.append("<table id='queue'><tr><td><button id='goApartment'>вернуться домой</button></td></tr><tr><td id='player' /></tr><tr><td id='current' /></tr><tr><td id='people' /></tr><tr><td id='body'><div id='dialog' /></td></tr></table>");

		$("#goApartment").click(() => { this.GoToApartment.Call(); });

		this.Shown.Call();
	}
}
