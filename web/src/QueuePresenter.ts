/// <reference path="DialogManager.ts" />
/// <reference path="IMainModel.ts"    />
/// <reference path="IQueueModel.ts"   />
/// <reference path="IQueueView.ts"    />

class QueuePresenter
{
	constructor
		( private mainModel     : IMainModel
		, private queueModel    : IQueueModel
		, private queueView     : IQueueView
		)
	{
		queueModel.CurrentTicketChanged.Add(this.OnCurrentTicketChanged.bind(this));
		queueModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
		queueModel.PeopleChanged.Add(this.OnPeopleChanged.bind(this));
		queueModel.PlayerTicketChanged.Add(this.OnPlayerTicketChanged.bind(this));

		queueView.GoToHome.Add(this.OnGoToHome.bind(this));
		queueView.Hidden.Add(this.OnHidden.bind(this));
		queueView.PersonClicked.Add(this.OnPersonClicked.bind(this));
		queueView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
		queueView.Shown.Add(this.OnQueueShown.bind(this));
	}

	private OnCurrentTicketChanged() : void
	{
		var ticket = this.queueModel.GetCurrentTicket();
		if (ticket == null)
			this.queueView.ClearCurrentTicket();
		else
			this.queueView.SetCurrentTicket(ticket);
	}

	private OnDialogChanged() : void
	{
		this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.queueModel.GetDialog());
	}

	private OnGoToHome() : void
	{
		this.mainModel.SetView(ClientViewType.Home);
	}

	private OnHidden() : void
	{
		this.queueModel.EndDialog();
	}

	private OnPeopleChanged() : void
	{
		this.queueView.SetCharacters(this.queueModel.GetCharacters());
	}

	private OnPersonClicked() : void
	{
		this.queueModel.StartDialog(this.queueView.GetSpeaker());
	}

	private OnPlayerTicketChanged() : void
	{
		var ticket = this.queueModel.GetPlayerTicket();
		if (ticket == null)
			this.queueView.ClearPlayerTicket();
		else
			this.queueView.SetPlayerTicket(ticket);
	}

	private OnQueueShown() : void
	{
		this.queueModel.EnterQueue();

		this.queueView.SetPlayerTicket(this.queueModel.GetPlayerTicket());
		this.queueView.SetCurrentTicket(this.queueModel.GetCurrentTicket());
		this.queueView.SetCharacters(this.queueModel.GetCharacters());
		this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.queueModel.GetDialog());
	}

	private OnReplyClicked() : void
	{
		this.queueModel.AdvanceDialog(this.queueView.GetSelectedReply());
	}
}
