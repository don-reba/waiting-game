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

		activitiesModel.VisibilityChanged.Add(this.OnActivitiesMenuVisibilityChanged.bind(this));

		invitesModel.EmptiedStateChanged.Add(this.OnInvitesMenuEmptiedStateChanged.bind(this));
		invitesModel.EnabledStateChanged.Add(this.OnInvitesMenuEnabledStateChanged.bind(this));
		invitesModel.SelectionChanged.Add(this.OnInvitesMenuSelectionChanged.bind(this));
		invitesModel.VisibilityChanged.Add(this.OnInvitesMenuVisibilityChanged.bind(this));

		homeView.ActivitiesClicked.Add(this.OnActivitiesClicked.bind(this));
		homeView.ActivityClicked.Add(this.OnActivityClicked.bind(this));
		homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		homeView.GoToStore.Add(this.OnGoToStore.bind(this));
		homeView.GuestClicked.Add(this.OnGuestClicked.bind(this));
		homeView.Hidden.Add(this.OnHidden.bind(this));
		homeView.InvitesButtonClicked.Add(this.OnInvitesButtonClicked.bind(this));
		homeView.InviteClicked.Add(this.OnInviteClicked.bind(this));
		homeView.InvitesClicked.Add(this.OnInvitesClicked.bind(this));
		homeView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
		homeView.Shown.Add(this.OnShown.bind(this));
	}

	private OnActivityClicked() : void
	{
		this.homeModel.SetActivity(this.homeView.GetSelectedActivity());
		this.homeModel.SetDialog(null);
		this.activitiesModel.SetVisibility(false);
	}

	private OnActivitiesClicked() : void
	{
		this.activitiesModel.SetVisibility(!this.activitiesModel.IsVisible());
	}

	private OnActivitiesMenuVisibilityChanged()
	{
		this.UpdateActivitiesMenuVisibility();
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
		this.invitesModel.SetVisibility(!this.invitesModel.IsVisible());
	}

	private OnInviteClicked() : void
	{
		this.invitesModel.ToggleSelection(this.homeView.GetSelectedInvite());
	}

	private OnInvitesButtonClicked() : void
	{
		this.invitesModel.SetVisibility(false);
		this.homeView.HideInvitesMenu();
		this.homeModel.SetActivity(this.activitiesModel.GetActivities()[0]);
		this.homeModel.InviteGuests(this.invitesModel.GetSelectedFriends());
		this.invitesModel.Reset();
	}

	private OnInvitesMenuEmptiedStateChanged() : void
	{
		this.homeView.SetInviteStatus(!this.invitesModel.IsEmpty());
	}

	private OnInvitesMenuEnabledStateChanged() : void
	{
		this.UpdateInvitesMenuEnabledState();
	}

	private OnInvitesMenuSelectionChanged() : void
	{
		var selection = this.invitesModel.GetSelection();
		var isSelected = this.invitesModel.IsSelected(selection);
		this.homeView.SetInviteState(selection, isSelected);
	}

	private OnInvitesMenuVisibilityChanged() : void
	{
		this.UpdateInvitesMenuVisibility();
	}

	private OnInvitesMenuChanged() : void
	{
		this.homeView.ShowInvitesMenu(this.invitesModel.GetFriends());
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

	private OnHidden() : void
	{
		this.activitiesModel.SetVisibility(false);
		this.invitesModel.SetVisibility(false);
	}

	private OnReplyClicked() : void
	{
		this.homeModel.SetDialog(this.homeView.GetSelectedReply());
	}

	private OnShown() : void
	{
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
		this.homeView.SetDialog(this.homeModel.GetSpeaker(), this.homeModel.GetDialog());
		this.UpdateButtonStates();
		this.UpdateActivitiesMenuVisibility();
		this.UpdateInvitesMenuVisibility();
	}

	private OnStateChanged() : void
	{
		this.UpdateButtonStates();
	}

	// private implementation

	private UpdateActivitiesMenuVisibility()
	{
		if (this.activitiesModel.IsVisible())
		{
			this.homeView.ShowActivitiesMenu(this.activitiesModel.GetActivities());
			this.homeView.SelectActivity(this.homeModel.GetActivity());
		}
		else
		{
			this.homeView.HideActivitiesMenu();
		}
	}

	private UpdateInvitesMenuVisibility() : void
	{
		if (!this.invitesModel.IsVisible())
		{
			this.homeView.HideInvitesMenu();
			return;
		}

		this.homeView.ShowInvitesMenu(this.invitesModel.GetFriends());

		this.homeView.SetInviteStatus(!this.invitesModel.IsEmpty());

		var selected = this.invitesModel.GetSelectedFriends();
		for (var i = 0; i != selected.length; ++i)
			this.homeView.SetInviteState(selected[i], true);

		this.UpdateInvitesMenuEnabledState();
	}

	private UpdateInvitesMenuEnabledState()
	{
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
			if (this.invitesModel.HasInvites() && this.activitiesModel.HasActivities())
				this.homeView.ShowInvitesButton();
			else
				this.homeView.HideInvitesButton();
			this.homeView.ShowTravelButtons();
			this.homeView.HideActivitiesButton();
		}
	}
}
