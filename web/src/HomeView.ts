/// <reference path="IHomeView.ts"   />
/// <reference path="IClientView.ts" />
/// <reference path="Util.ts"        />

class HomeView implements IHomeView, IClientView
{
	private selectedFriend       : ICharacter;
	private selectedFriendStatus : boolean;
	private selectedGuest        : ICharacter;
	private selectedReply        : string;

	// IHomeView implementation

	CloseInvites   = new Signal();
	FriendSelected = new Signal();
	GoToQueue      = new Signal();
	GoToStore      = new Signal();
	GuestClicked   = new Signal();
	InviteFriends  = new Signal();
	OpenInvites    = new Signal();
	ReplyClicked   = new Signal();
	Shown          = new Signal();

	DisableUnselectedFriends() : void
	{
		var checkboxes = $("#home-invites input[type='checkbox']");
		for (var i = 0; i != checkboxes.length; ++i)
		{
			var check : JQuery = $(checkboxes[i]);
			check.prop("disabled", !check.prop("checked"));
		}
	}

	EnableAllFriends() : void
	{
		var checkboxes = $("#home-invites input[type='checkbox']");
		for (var i = 0; i != checkboxes.length; ++i)
			$(checkboxes[i]).prop("disabled", false);
	}

	GetSelectedFriend() : ICharacter
	{
		return this.selectedFriend;
	}

	GetSelectedFriendStatus() : boolean
	{
		return this.selectedFriendStatus;
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

	SetInviteStatus(status : boolean) : void
	{
		$("#invite-friends").prop("disabled", !status);
	}

	ShowFriends(characters : ICharacter[]) : void
	{
		var OnLabelClick = function(e)
		{
			var check : JQuery = e.data;
			if (check.prop("disabled"))
				return;
			check.prop("checked", !check.prop("checked"));
			check.change();
		}
		var OnCheckboxChange = function(e)
		{
			var check : JQuery = e.data;
			this.selectedFriend       = check.data("character");
			this.selectedFriendStatus = check.prop("checked");
			this.FriendSelected.Call();
		}

		var invites = $("#home-invites")
		invites.empty();

		for (var i = 0; i != characters.length; ++i)
		{
			var c = characters[i];

			var checkbox = $("<input type='checkbox'>");
			var label    = $("<label>" + c.name + "</label>");
			label.click(checkbox, OnLabelClick);
			checkbox.data("character", c);
			checkbox.change(checkbox, OnCheckboxChange.bind(this));
			invites.append(checkbox).append(label).append("<br>");
		}

		var button = $("<button id='invite-friends'>пригласить в гости</button>");
		button.click(() => { this.InviteFriends.Call() });
		invites.append(button);

		Util.AlignToBottom($("#toggle-invites"), invites);

		invites.height();

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

		$("#home-invites").hide();
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
		toggleInvites.click(() => { if ($("#home-invites").is(":visible")) this.CloseInvites.Call(); else this.OpenInvites.Call() });

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
