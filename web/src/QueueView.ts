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
			button.css("margin-top", String(1.5 * scale) + "em");

			if (character)
			{
				button.text(character.name);
				var name = $("<p>");
				button.addClass("queue-character");
				button.click(character, OnClick.bind(this));
			}
			else
			{
				button.text("\\o/");
				button.addClass("queue-player");
			}

			people.append(button);
		}
	}

	SetCurrentTicket(ticket : string) : void
	{
		if (ticket)
		{
			$("#current-ticket .number").text(ticket);
			$("#current-ticket").show();
		}
		else
		{
			$("#current-ticket").hide();
		}
	}

	SetDialog(speaker : ICharacter, dialog : IDialog) : void
	{
		var OnClick = function(e)
		{
			this.selectedReply = e.data;
			this.ReplyClicked.Call();
		}

		var speakerElement = $("#queue-dialog .dialog-speaker");
		var textElement    = $("#queue-dialog .dialog-text");
		var repliesElement = $("#queue-dialog .dialog-replies");

		if (!dialog)
		{
			speakerElement.hide();
			textElement.hide();
			repliesElement.hide();
			return;
		}

		speakerElement.show();
		textElement.show();
		repliesElement.show();

		speakerElement.text(speaker ? speaker.name : "");

		textElement.html(dialog.text);

		repliesElement.empty();
		for (var i = 0; i != dialog.replies.length; ++i)
		{
			var reply = dialog.replies[i];

			var li = $("<li class='fg-clickable'>");
			li.html(reply.text);
			li.click(reply.ref, OnClick.bind(this));
			repliesElement.append(li);
		}
	}

	SetPlayerTicket(ticket : string) : void
	{
		if (ticket)
		{
			$("#my-ticket .number").text(ticket);
			$("#my-ticket").show();
		}
		else
		{
			$("#my-ticket").hide();
		}
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
		e.append("<div class='queue-spacer'>");
		e.append("<div id='queue-body' class='queue-body'><div id='queue-dialog' class='dialog'><div class='dialog-speaker'></div><p class='dialog-text'></p><ol class='dialog-replies'></ol></div></div>");

		var goHome = $("<button id='go-home'>");
		goHome.text("вернуться домой");
		goHome.click(() => { this.GoToHome.Call() });

		$("#buttons").append(goHome);

		var gameDiv = $("#game");
		gameDiv.append("<div id='my-ticket' class='queue-ticket my-ticket'><p class='info-font'>ваш<br>номер</p><div class='number' /></div>");
		gameDiv.append("<div id='current-ticket' class='queue-ticket current-ticket'><p class='info-font'>текущий<br>номер</p><div class='number' /></div>");

		this.Shown.Call();
	}
}
