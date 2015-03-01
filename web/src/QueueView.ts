/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />

class QueueView implements IQueueView, IClientView
{
	private selectedCharacter : ICharacter;
	private selectedReply     : string;

	// IQueueView implementation

	GoToHome      = new Signal();
	PersonClicked = new Signal();
	ReplyClicked  = new Signal();
	Hidden        = new Signal();
	Shown         = new Signal();

	ClearCurrentTicket() : void
	{
		$("#current-ticket").hide();
	}

	ClearPlayerTicket() : void
	{
		$("#my-ticket").hide();
	}

	GetSelectedReply() : string
	{
		return this.selectedReply;
	}

	GetSpeaker() : ICharacter
	{
		return this.selectedCharacter;
	}

	SetCharacters(characters : ICharacter[]) : void
	{
		var OnClick = function(e)
		{
			this.selectedCharacter = e.data;
			this.PersonClicked.Call();
		}

		var people = $("#queue-people");
		people.empty();

		for (var i = 0; i != characters.length; ++i)
		{
			// goes up to 1.0 in increments of 0.1
			var scale = (5 + i) / 10;

			var character = characters[i];

			var button = $("<div class='queue-person'>");
			button.css("transform", "scale(" + String(scale) + ")");
			button.css("margin-top", String(2 * scale) + "em");

			if (character)
			{
				button.addClass("fg-clickable");
				button.css("box-shadow", "0 0 0.3em " + character.color);
				button.text(characters[i].name);
				button.click(characters[i], OnClick.bind(this));
			}
			else
			{
				button.html("&nbsp;\\o/&nbsp;");
				button.css("border", "1px solid black");
			}

			people.append(button);
		}
	}

	SetCurrentTicket(ticket : string) : void
	{
		$("#current-ticket .number").text(ticket);
	}

	SetDialog(speaker : ICharacter, dialog : IDialog) : void
	{
		var OnClick = function(e)
		{
			this.selectedReply = e.data;
			this.ReplyClicked.Call();
		}

		var div = $("#queue-dialog");
		div.empty();

		if (!dialog)
			return;

		div.append($("<p><strong>" + speaker.name + "</strong>: " + dialog.text + "</p>"));

		var ol = $("<ol>");
		for (var i = 0; i != dialog.replies.length; ++i)
		{
			var reply = dialog.replies[i];

			var li = $("<li class='fg-clickable'>");
			li.html(reply.text);
			li.click(reply.ref, OnClick.bind(this));
			ol.append(li);
		}
		div.append(ol);
	}

	SetPlayerTicket(ticket : string) : void
	{
		$("#my-ticket .number").text(ticket);
	}

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Queue;
	}

	Hide() : void
	{
		$("#current-ticket").remove();
		$("#my-ticket").remove();
		this.Hidden.Call();
	}

	Show(e : JQuery) : void
	{
		e.append("<div id='queue-people' class='queue-people'>");
		e.append("<div class='queue-spacer bg-color'>");
		e.append("<div id='queue-body' class='queue-body'><div id='queue-dialog' class='queue-dialog' /></div>");

		var goHome = $("<div id='go-home'>");
		goHome.text("вернуться домой");
		goHome.click(() => { this.GoToHome.Call() });

		$("#buttons").append(goHome);

		var gameDiv = $("#game");
		gameDiv.append("<div id='my-ticket' class='queue-ticket my-ticket'><p class='info-font'>ваш<br>номер</p><div class='number' /></div>");
		gameDiv.append("<div id='current-ticket' class='queue-ticket current-ticket'><p class='info-font'>текущий<br>номер</p><div class='number' /></div>");

		this.Shown.Call();
	}
}
