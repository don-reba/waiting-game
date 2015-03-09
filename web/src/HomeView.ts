/// <reference path="IHomeView.ts"   />
/// <reference path="IClientView.ts" />
/// <reference path="Util.ts"        />

class HomeView implements IHomeView, IClientView
{
	private selectedActivity : Activity;
	private selectedInvite   : ICharacter;
	private selectedGuest    : ICharacter;
	private selectedReply    : string;

	// IHomeView implementation

	ActivityClicked      = new Signal();
	ActivitiesClicked    = new Signal();
	InviteClicked        = new Signal();
	GoToQueue            = new Signal();
	GoToStore            = new Signal();
	GuestClicked         = new Signal();
	InvitesButtonClicked = new Signal();
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

	GetSelectedActivity() : Activity
	{
		return this.selectedActivity;
	}

	GetSelectedInvite() : ICharacter
	{
		return this.selectedInvite;
	}

	GetSelectedGuest() : ICharacter
	{
		return this.selectedGuest;
	}

	GetSelectedReply() : string
	{
		return this.selectedReply;
	}

	HideActivitiesButton() : void
	{
		$("#toggle-activities").hide();
	}

	HideActivitiesMenu() : void
	{
		$("#home-activities").hide();
	}

	HideInvitesMenu() : void
	{
		$("#home-invites").hide();
	}

	HideInvitesButton() : void
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
			var replacement = c.character
				? "<span id='character-" + c.character.id + "'>\\o/</span>"
				: "<span class='player'>\\o/</span>";
			html = html.replace(new RegExp("." + i + "."), replacement);
		}
		view.html(html);

		for (var i = 0; i != canvas.characters.length; ++i)
		{
			var c = canvas.characters[i];
			if (c.character && c.isClickable)
			{
				var span = $("#character-" + c.character.id);
				span.addClass("character");
				span.click(c.character, OnClickCharacter.bind(this));

				var name = $("<span>");
				name.attr("id", "character-name-" + c.character.id);
				name.addClass("character-name");
				name.addClass("base-font");
				name.text(c.character.name);
				span.append(name);
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

		var speakerElement = $("#home-dialog .dialog-speaker");
		var textElement    = $("#home-dialog .dialog-text");
		var repliesElement = $("#home-dialog .dialog-replies");

		if (!dialog)
		{
			$("#home-dialog").hide();
			return;
		}

		speakerElement.text(speaker.name);

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

		$("#home-dialog").show();
	}

	SetInviteStatus(enabled : boolean) : void
	{
		$("#invite").prop("disabled", !enabled);
	}

	SetInviteState(character : ICharacter, checked : boolean) : void
	{
		var label = $("#home-invites ." + character.id);
		if (checked)
			label.addClass("checked");
		else
			label.removeClass("checked");
	}

	ShowActivitiesButton() : void
	{
		$("#toggle-activities").show();
	}

	ShowActivitiesMenu(activities : Activity[]) : void
	{
		var OnClick = function(e)
		{
			this.selectedActivity = e.data;
			this.ActivityClicked.Call();
		}

		var menu = $("#home-activities");
		menu.empty();

		for (var i = 0; i != activities.length; ++i)
		{
			var a = activities[i];

			var label = $("<label>");
			label.text(Activity.GetName(a));
			label.addClass("fg-clickable");
			label.addClass("a" + a);
			label.click(a, OnClick.bind(this));

			menu.append(label);
		}

		Util.AlignUnderneath($("#toggle-activities"), menu);

		menu.show();
	}

	ShowInvitesButton() : void
	{
		$("#toggle-invites").show();
	}

	ShowInvitesMenu(characters : ICharacter[]) : void
	{
		var OnClick = function(e)
		{
			this.selectedInvite = e.data;
			this.InviteClicked.Call();
		}

		var menu = $("#home-invites");
		menu.empty();

		for (var i = 0; i != characters.length; ++i)
		{
			var c = characters[i];

			var label = $("<label>");
			label.text(c.name);
			label.addClass("fg-clickable");
			label.addClass(c.id);
			label.click(c, OnClick.bind(this));

			menu.append(label);
		}

		var button = $("<button id='invite'>пригласить в гости</button>");
		button.click(() => { this.InvitesButtonClicked.Call() });
		menu.append(button);

		Util.AlignUnderneath($("#toggle-invites"), menu);

		menu.show();
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
		e.html("<div id='home-dialog' class='dialog fg-color'><div class='dialog-speaker'></div><p class='dialog-text'></p><ol class='dialog-replies'></ol></div><div id='home-view'></div>");

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

		var toggleActivities = $("<button id='toggle-activities'>");
		toggleActivities.text("занятия…");
		toggleActivities.click(() => { this.ActivitiesClicked.Call() });

		var activities = $("<div id='home-activities' class='menu fg-color'>");
		activities.hide();

		var invites = $("<div id='home-invites' class='menu fg-color'>");
		invites.hide();

		$("#buttons")
			.append(goQueue)
			.append(goStore)
			.append(toggleInvites)
			.append(toggleActivities)
			.append(activities)
			.append(invites);

		this.Shown.Call();
	}
}
