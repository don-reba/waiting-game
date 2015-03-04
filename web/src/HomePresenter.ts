/// <reference path="IFriendsMenuModel.ts" />
/// <reference path="IHomeModel.ts"        />
/// <reference path="IHomeView.ts"         />
/// <reference path="IMainModel.ts"        />
/// <reference path="IQueueModel.ts"       />

class HomePresenter
{
	constructor
		( private homeModel    : IHomeModel
		, private invitesModel : IFriendsMenuModel
		, private mainModel    : IMainModel
		, private queueModel   : IQueueModel
		, private homeView     : IHomeView
		)
	{
		homeModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
		homeModel.FriendsArriving.Add(this.OnFriendsArriving.bind(this));
		homeModel.GuestsChanged.Add(this.OnGuestsChanged.bind(this));

		invitesModel.Cleared.Add(this.OnFriendsMenuCleared.bind(this));
		invitesModel.Disabled.Add(this.OnFriendsMenuDisabled.bind(this));
		invitesModel.Emptied.Add(this.OnFriendsMenuEmptied.bind(this));
		invitesModel.Enabled.Add(this.OnFriendsMenuEnabled.bind(this));
		invitesModel.Filled.Add(this.OnFriendsMenuFilled.bind(this));
		invitesModel.Hidden.Add(this.OnFriendsMenuHidden.bind(this));
		invitesModel.Selected.Add(this.OnFriendsMenuSelected.bind(this));
		invitesModel.Shown.Add(this.OnFriendsMenuShown.bind(this));

		homeView.FriendClicked.Add(this.OnFriendClicked.bind(this));
		homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		homeView.GoToStore.Add(this.OnGoToStore.bind(this));
		homeView.GuestClicked.Add(this.OnGuestClicked.bind(this));
		homeView.InviteFriendsClicked.Add(this.OnInviteFriendsClicked.bind(this));
		homeView.InvitesClicked.Add(this.OnInvitesClicked.bind(this));
		homeView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
		homeView.Shown.Add(this.OnShown.bind(this));
	}

	private OnDialogChanged() : void
	{
		var speaker = this.homeModel.GetSpeaker();
		var dialog  = this.homeModel.GetDialog();
		this.homeView.SetDialog(speaker, dialog);
		if (!dialog && this.homeModel.IsGuestAtTheDoor())
			this.homeModel.LetTheGuestIn();
	}

	private OnInvitesClicked() : void
	{
		this.invitesModel.ToggleVisibility();
	}

	private OnFriendClicked() : void
	{
		this.invitesModel.ToggleSelection(this.homeView.GetMenuSelection());
	}

	private OnFriendsMenuCleared() : void
	{
		this.homeView.SetMenuFriendState(this.invitesModel.GetSelection(), false);
	}

	private OnFriendsMenuDisabled() : void
	{
		this.homeView.DisableUnselectedFriends();
	}

	private OnFriendsMenuEmptied() : void
	{
		this.homeView.SetInviteStatus(false);
	}

	private OnFriendsMenuEnabled() : void
	{
		this.homeView.EnableAllFriends();
	}

	private OnFriendsMenuFilled() : void
	{
		this.homeView.SetInviteStatus(true);
	}

	private OnFriendsMenuSelected() : void
	{
		this.homeView.SetMenuFriendState(this.invitesModel.GetSelection(), true);
	}

	private OnFriendsMenuShown() : void
	{
		this.ShowFriendsMenu();
	}

	private OnFriendsMenuChanged() : void
	{
		this.homeView.ShowFriends(this.invitesModel.GetFriends());
	}

	private OnFriendsMenuHidden() : void
	{
		this.homeView.HideFriends();
	}

	private OnFriendsArriving() : void
	{
		this.UpdateButtonStates();
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
	}

	private OnGuestClicked() : void
	{
		this.homeModel.StartDialog(this.homeView.GetSelectedGuest());
	}

	private OnGoToQueue() : void
	{
		this.queueModel.EnterQueue();
		this.mainModel.SetView(ClientViewType.Queue);
	}

	private OnGoToStore() : void
	{
		this.mainModel.SetView(ClientViewType.Store);
	}

	private OnGuestsChanged() : void
	{
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
	}

	private OnInviteFriendsClicked() : void
	{
		this.homeView.HideFriends();
		this.homeModel.InviteFriends(this.invitesModel.GetSelectedFriends());
	}

	private OnReplyClicked() : void
	{
		this.homeModel.AdvanceDialog(this.homeView.GetSelectedReply());
	}

	private OnShown() : void
	{
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
		this.homeView.SetDialog(this.homeModel.GetSpeaker(), this.homeModel.GetDialog());
		this.UpdateButtonStates();
		this.ShowFriendsMenu();
	}

	// private implementation

	private ShowFriendsMenu() : void
	{
		if (!this.invitesModel.IsVisible())
			return;

		this.homeView.ShowFriends(this.invitesModel.GetFriends());

		this.homeView.SetInviteStatus(!this.invitesModel.IsEmpty());

		var selected = this.invitesModel.GetSelectedFriends();
		for (var i = 0; i != selected.length; ++i)
			this.homeView.SetMenuFriendState(selected[i], true);

		if (this.invitesModel.IsEnabled())
			this.homeView.EnableAllFriends();
		else
			this.homeView.DisableUnselectedFriends();
	}

	private UpdateButtonStates() : void
	{
		if (this.homeModel.AreGuestsIn())
		{
			this.homeView.HideFriendsButton();
			this.homeView.HideTravelButtons();
		}
		else
		{
			this.homeView.ShowFriendsButton();
			this.homeView.ShowTravelButtons();
		}
	}
}
