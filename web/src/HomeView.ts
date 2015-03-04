/// <reference path="IHomeView.ts"   />
/// <reference path="IClientView.ts" />
/// <reference path="Util.ts"        />

class HomeView implements IHomeView, IClientView
{
	private menuSelection : ICharacter;
	private selectedGuest : ICharacter;
	private selectedReply : string;

	// IHomeView implementation

	FriendClicked        = new Signal();
	FriendsClicked       = new Signal();
	GoToQueue            = new Signal();
	GoToStore            = new Signal();
	GuestClicked         = new Signal();
	InviteFriendsClicked = new Signal();
	InvitesClicked       = new Signal();
	ReplyClicked         = new Signal();
	Shown                = new Signal();

	DisableUnselectedFriends() : void
	{
		var labels = $("#home-invites label");
		for (var i = 0; i != labels.length; ++i)
		{
			var label : JQuery = $(labels[i]);
			if (!label.hasClass("checked"))
			{
				label.addClass("disabled");
				label.removeClass("fg-clickable");
			}
		}
	}

	EnableAllFriends() : void
	{
		var labels = $("#home-invites label");
		for (var i = 0; i != labels.length; ++i)
		{
			var label = $(labels[i]);
			label.removeClass("disabled");
			label.addClass("fg-clickable");
		}
	}

	GetInvitesVisibility() : boolean
	{
		return $("#home-invites").is(":visible");
	}

	GetMenuSelection() : ICharacter
	{
		return this.menuSelection;
	}

	GetSelectedGuest() : ICharacter
	{
		return this.selectedGuest;
	}

	GetSelectedReply() : string
	{
		return this.selectedReply;
	}

	HideFriends() : void
	{
		$("#home-invites").hide();
	}

	HideFriendsButton() : void
	{
		$("#toggle-invites").hide();
	}

	HideTravelButtons() : void
	{
		$("#go-queue").hide();
		$("#go-store").hide();
	}

	SetCanvas(canvas : HomeCanvas) : void
	{
		var OnClickCharacter = function(e)
		{
			this.selectedGuest = e.data;
			this.GuestClicked.Call();
		}

		var view = $("#home-view");
		var html = canvas.rows.join("<br>");

		for (var i = 0; i != canvas.characters.length; ++i)
		{
			var c = canvas.characters[i];
			var replacement = c
				? "<span id='character-" + c.id + "' class='character'>\\o/</span>"
				: "<span class='player'>\\o/</span>";
			html = html.replace(" " + i + " ", replacement);
		}
		view.html(html);

		for (var i = 0; i != canvas.characters.length; ++i)
		{
			var c = canvas.characters[i];
			if (c)
			{
				var span = $("#character-" + c.id);
				span.click(c, OnClickCharacter.bind(this));
			}
		}
	}

	SetDialog(speaker : ICharacter, dialog : IDialog) : void
	{
		var OnClick = function(e)
		{
			this.selectedReply = e.data;
			this.ReplyClicked.Call();
		}

		var div = $("#home-dialog");
		if (!dialog)
		{
			div.hide();
			return;
		}
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
		div.show();
	}

	SetInviteStatus(enabled : boolean) : void
	{
		$("#invite").prop("disabled", !enabled);
	}

	SetMenuFriendState(character : ICharacter, checked : boolean) : void
	{
		var label = $("#home-invites ." + character.id);
		if (checked)
			label.addClass("checked");
		else
			label.removeClass("checked");
	}

	ShowFriends(characters : ICharacter[]) : void
	{
		var OnClick = function(e)
		{
			this.menuSelection = e.data;
			this.FriendClicked.Call();
		}

		var invites = $("#home-invites");
		invites.empty();

		for (var i = 0; i != characters.length; ++i)
		{
			var c = characters[i];

			var label = $("<label>");
			label.text(c.name);
			label.addClass("fg-clickable");
			label.addClass(c.id);
			label.click(c, OnClick.bind(this));

			invites.append(label);
		}

		var button = $("<button id='invite'>пригласить в гости</button>");
		button.click(() => { this.InviteFriendsClicked.Call() });
		invites.append(button);

		Util.AlignUnderneath($("#toggle-invites"), invites);

		invites.show();
	}

	ShowFriendsButton() : void
	{
		$("#toggle-invites").show();
	}

	ShowTravelButtons() : void
	{
		$("#go-queue").show();
		$("#go-store").show();
	}

	// IClientView implementation

	GetType() : ClientViewType
	{
		return ClientViewType.Home;
	}

	Hide() : void
	{
	}

	Show(e : JQuery) : void
	{
		e.html("<div id='home-dialog'></div><div id='home-view'></div>");

		$("#home-dialog").hide();

		var goQueue = $("<button id='go-queue'>");
		goQueue.text("в очередь");
		goQueue.hide();
		goQueue.click(() => { this.GoToQueue.Call() });

		var goStore = $("<button id='go-store'>");
		goStore.text("в магазин");
		goStore.hide();
		goStore.click(() => { this.GoToStore.Call() });

		var toggleInvites = $("<button id='toggle-invites'>");
		toggleInvites.text("друзья…");
		toggleInvites.click(() => { this.InvitesClicked.Call() });

		var invites = $("<div id='home-invites' class='menu fg-color'>");
		invites.hide();

		$("#buttons")
			.append(goQueue)
			.append(goStore)
			.append(toggleInvites)
			.append(invites);

		this.Shown.Call();
	}
}
