/// <reference path="IHomeView.ts" />
/// <reference path="IClientView.ts" />

class HomeView implements IHomeView, IClientView
{
	private selectedFriend       : ICharacter;
	private selectedFriendStatus : boolean;
	private selectedReply        : number;

	// IHomeView implementation

	CloseInvites   = new Signal();
	FriendSelected = new Signal();
	GoToQueue      = new Signal();
	GoToStore      = new Signal();
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

	GetSelectedReply() : number
	{
		return this.selectedReply;
	}

	HideFriends() : void
	{
		$("#home-invites").hide();
	}

	HideFriendsButton() : void
	{
		$("button#toggle-invites").hide();
	}

	HideTravelButtons() : void
	{
		$("button#go-queue").hide();
		$("button#go-store").hide();
	}

	SetCanvas(canvas : HomeCanvas) : void
	{
		var view = $("#home-view");
		var html = canvas.rows.join("<br>");

		for (var i = 0; i != canvas.characters.length; ++i)
		{
			var c = canvas.characters[i];
			var replacement = c
				? "<span id='character-" + c.name + "' class='character' style='background-color:" + c.color + "'>\\o/</span>"
				: "<span class='player'>\\o/</span>";
			html = html.replace(" " + i + " ", replacement);
		}
		view.html(html);
	}

	SetDialog(speaker : ICharacter, dialog : IDialog) : void
	{
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
		div.show();
	}

	SetInviteStatus(status : boolean) : void
	{
		$("button#invite-friends").prop("disabled", !status);
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

		this.AlignToBottom($("#toggle-invites"), invites);

		invites.show();

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
		e.html("<table id='home'><tr><td id='home-header'><button id='go-queue'>в очередь</button><button id='go-store'>в магазин</button><button id='toggle-invites'>друзья</button><div id='home-invites' /></td></tr><tr><td id='home-body'><div id='home-dialog' /><div id='home-view' /></td></tr></table>");
		$("#home-invites").hide();
		$("#home-dialog").hide();

		$("#go-queue").click(() => { this.GoToQueue.Call() });

		$("#go-store").click(() => { this.GoToStore.Call() });

		$("#toggle-invites").click(() => { if ($("#home-invites").is(":visible")) this.CloseInvites.Call(); else this.OpenInvites.Call() });

		this.Shown.Call();
	}

	// private implementation

	private AlignToBottom(anchor : JQuery, element : JQuery) : void
	{
		var p = anchor.position();
		var h = anchor.outerHeight(false);
		element.css({ left : p.left + "px", top : (p.top + h) + "px" });
	}
}
