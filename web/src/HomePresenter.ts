/// <reference path="IActivitiesMenuModel.ts" />
/// <reference path="IInvitesMenuModel.ts"    />
/// <reference path="IHomeModel.ts"           />
/// <reference path="IHomeView.ts"            />
/// <reference path="IMainModel.ts"           />
/// <reference path="IQueueModel.ts"          />

class HomePresenter
{
	constructor
		( private homeModel       : IHomeModel
		, private activitiesModel : IActivitiesMenuModel
		, private invitesModel    : IInvitesMenuModel
		, private mainModel       : IMainModel
		, private queueModel      : IQueueModel
		, private homeView        : IHomeView
		)
	{
		homeModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
		homeModel.GuestsChanged.Add(this.OnGuestsChanged.bind(this));
		homeModel.StateChanged.Add(this.OnStateChanged.bind(this));

		activitiesModel.Hidden.Add(this.OnActivitiesMenuHidden.bind(this));
		activitiesModel.Shown.Add(this.OnActivitiesMenuShown.bind(this));

		invitesModel.Cleared.Add(this.OnInvitesMenuCleared.bind(this));
		invitesModel.Disabled.Add(this.OnInvitesMenuDisabled.bind(this));
		invitesModel.Emptied.Add(this.OnInvitesMenuEmptied.bind(this));
		invitesModel.Enabled.Add(this.OnInvitesMenuEnabled.bind(this));
		invitesModel.Filled.Add(this.OnInvitesMenuFilled.bind(this));
		invitesModel.Hidden.Add(this.OnInvitesMenuHidden.bind(this));
		invitesModel.Selected.Add(this.OnInvitesMenuSelected.bind(this));
		invitesModel.Shown.Add(this.OnInvitesMenuShown.bind(this));

		homeView.ActivitiesClicked.Add(this.OnActivitiesClicked.bind(this));
		homeView.ActivityClicked.Add(this.OnActivityClicked.bind(this));
		homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		homeView.GoToStore.Add(this.OnGoToStore.bind(this));
		homeView.GuestClicked.Add(this.OnGuestClicked.bind(this));
		homeView.InvitesButtonClicked.Add(this.OnInvitesButtonClicked.bind(this));
		homeView.InviteClicked.Add(this.OnInviteClicked.bind(this));
		homeView.InvitesClicked.Add(this.OnInvitesClicked.bind(this));
		homeView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
		homeView.Shown.Add(this.OnShown.bind(this));
	}

	private OnActivityClicked() : void
	{
		this.homeModel.SetActivity(this.homeView.GetSelectedActivity());
		this.homeView.HideActivitiesMenu();
		this.homeView.HideActivitiesButton();
	}

	private OnActivitiesClicked() : void
	{
		this.activitiesModel.ToggleVisibility();
	}

	private OnActivitiesMenuHidden() : void
	{
		this.homeView.HideActivitiesMenu();
	}

	private OnActivitiesMenuShown() : void
	{
		this.ShowActivitiesMenu();
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

	private OnInviteClicked() : void
	{
		this.invitesModel.ToggleSelection(this.homeView.GetSelectedInvite());
	}

	private OnInvitesButtonClicked() : void
	{
		this.invitesModel.ToggleVisibility();
		this.homeView.HideInvitesMenu();
		this.homeModel.InviteFriends(this.invitesModel.GetSelectedFriends());
		this.invitesModel.Reset();
	}

	private OnInvitesMenuCleared() : void
	{
		this.homeView.SetInviteState(this.invitesModel.GetSelection(), false);
	}

	private OnInvitesMenuDisabled() : void
	{
		this.homeView.DisableUnselectedFriends();
	}

	private OnInvitesMenuEmptied() : void
	{
		this.homeView.SetInviteStatus(false);
	}

	private OnInvitesMenuEnabled() : void
	{
		this.homeView.EnableAllFriends();
	}

	private OnInvitesMenuFilled() : void
	{
		this.homeView.SetInviteStatus(true);
	}

	private OnInvitesMenuSelected() : void
	{
		this.homeView.SetInviteState(this.invitesModel.GetSelection(), true);
	}

	private OnInvitesMenuShown() : void
	{
		this.ShowInvitesMenu();
	}

	private OnInvitesMenuChanged() : void
	{
		this.homeView.ShowInvitesMenu(this.invitesModel.GetFriends());
	}

	private OnInvitesMenuHidden() : void
	{
		this.homeView.HideInvitesMenu();
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

	private OnReplyClicked() : void
	{
		this.homeModel.AdvanceDialog(this.homeView.GetSelectedReply());
	}

	private OnShown() : void
	{
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
		this.homeView.SetDialog(this.homeModel.GetSpeaker(), this.homeModel.GetDialog());
		this.UpdateButtonStates();
		this.ShowActivitiesMenu();
		this.ShowInvitesMenu();
	}

	private OnStateChanged() : void
	{
		this.UpdateButtonStates();
	}

	// private implementation

	private ShowActivitiesMenu()
	{
		if (!this.activitiesModel.IsVisibile())
			return;

		this.homeView.ShowActivitiesMenu(this.activitiesModel.GetActivities());
	}

	private ShowInvitesMenu() : void
	{
		if (!this.invitesModel.IsVisible())
			return;

		this.homeView.ShowInvitesMenu(this.invitesModel.GetFriends());

		this.homeView.SetInviteStatus(!this.invitesModel.IsEmpty());

		var selected = this.invitesModel.GetSelectedFriends();
		for (var i = 0; i != selected.length; ++i)
			this.homeView.SetInviteState(selected[i], true);

		if (this.invitesModel.IsEnabled())
			this.homeView.EnableAllFriends();
		else
			this.homeView.DisableUnselectedFriends();
	}

	private UpdateButtonStates() : void
	{
		if (this.homeModel.AreGuestsArriving())
		{
			this.homeView.HideInvitesButton();
			this.homeView.HideTravelButtons();
			this.homeView.HideActivitiesButton();
		}
		else if (this.homeModel.AreGuestsIn())
		{
			this.homeView.HideInvitesButton();
			this.homeView.HideTravelButtons();
			this.homeView.ShowActivitiesButton();
		}
		else
		{
			this.homeView.ShowInvitesButton();
			this.homeView.ShowTravelButtons();
			this.homeView.HideActivitiesButton();
		}
	}
}
