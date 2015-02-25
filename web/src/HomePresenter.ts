/// <reference path="IHomeModel.ts" />
/// <reference path="IHomeView.ts"  />
/// <reference path="IMainModel.ts" />

class HomePresenter
{
	constructor
		( private homeModel : IHomeModel
		, private mainModel : IMainModel
		, private homeView  : IHomeView
		)
	{
		homeModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
		homeModel.FriendsArriving.Add(this.OnFriendsArriving.bind(this));
		homeModel.GuestsChanged.Add(this.OnGuestsChanged.bind(this));

		homeView.FriendSelected.Add(this.OnFriendSelected.bind(this));
		homeView.CloseInvites.Add(this.OnCloseInvites.bind(this));
		homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
		homeView.GoToStore.Add(this.OnGoToStore.bind(this));
		homeView.InviteFriends.Add(this.OnInviteFriends.bind(this));
		homeView.OpenInvites.Add(this.OnOpenInvites.bind(this));
		homeView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
		homeView.Shown.Add(this.OnShown.bind(this));
	}

	private OnCloseInvites() : void
	{
		this.homeView.HideFriends();
	}

	private OnDialogChanged() : void
	{
		var speaker = this.homeModel.GetSpeaker();
		var dialog  = this.homeModel.GetDialog()
		this.homeView.SetDialog(speaker, dialog);
		if (!dialog && this.homeModel.IsGuestAtTheDoor())
			this.homeModel.LetTheGuestIn();
	}

	private OnFriendSelected() : void
	{
		this.homeModel.SetFriendStatus(this.homeView.GetSelectedFriend(), this.homeView.GetSelectedFriendStatus());

		if (this.homeModel.IsFriendLimitReached())
			this.homeView.DisableUnselectedFriends();
		else
			this.homeView.EnableAllFriends();

		this.homeView.SetInviteStatus(this.homeModel.IsInviteEnabled());
	}

	private OnFriendsArriving() : void
	{
		this.homeView.HideFriendsButton();
		//this.homeView.HideTravelButtons();
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
	}

	private OnGoToQueue() : void
	{
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

	private OnInviteFriends() : void
	{
		this.homeView.HideFriends();
		this.homeModel.InviteFriends();
	}

	private OnOpenInvites() : void
	{
		this.homeModel.ClearFriendSelection();
		this.homeView.ShowFriends(this.homeModel.GetFriends());
		this.homeView.SetInviteStatus(this.homeModel.IsInviteEnabled());
	}

	private OnReplyClicked() : void
	{
		this.homeModel.AdvanceDialog(this.homeView.GetSelectedReply());
	}

	private OnShown() : void
	{
		this.homeModel.ClearFriendSelection();
		this.homeView.SetCanvas(this.homeModel.GetCanvas());
		if (this.homeModel.AreGuestsIn())
		{
			this.homeView.HideFriendsButton();
			//this.homeView.HideTravelButtons();
		}
	}
}
