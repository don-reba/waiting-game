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
		, private dialogManager : DialogManager
		)
	{
		queueModel.PlayerTicketChanged.Add(this.OnPlayerTicketChanged.bind(this));
		queueModel.CurrentTicketChanged.Add(this.OnCurrentTicketChanged.bind(this));
		queueModel.PeopleChanged.Add(this.OnPeopleChanged.bind(this));

		queueView.GoToApartment.Add(this.OnGoToApartment.bind(this));
		queueView.PersonClicked.Add(this.OnPersonClicked.bind(this));
		queueView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
		queueView.Shown.Add(this.OnQueueShown.bind(this));

		mainModel.ResetActivated.Add(this.OnResetActivated.bind(this));
	}

	private OnCurrentTicketChanged() : void
	{
		var ticket = this.queueModel.GetCurrentTicket();
		if (ticket == null)
			this.queueView.ClearCurrentTicket();
		else
			this.queueView.SetCurrentTicket(ticket);
	}

	private OnGoToApartment() : void
	{
		this.mainModel.SetView(ClientViewType.Apartment);
	}

	private OnPeopleChanged() : void
	{
		this.queueView.SetPeopleNames(this.queueModel.GetPeopleNames());
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
		this.queueView.SetPeopleNames(this.queueModel.GetPeopleNames());
		this.queueView.SetDialog(this.dialogManager.GetDialog(0));
	}

	private OnPersonClicked() : void
	{
		this.queueView.SetDialog(this.dialogManager.GetDialog(0));
	}

	private OnReplyClicked() : void
	{
		var reply  = this.queueView.GetSelectedReply();
		var dialog = this.dialogManager.GetRefDialog(0, reply);
		this.queueView.SetDialog(dialog);
	}

	private OnResetActivated() : void
	{
		this.queueModel.Reset();
	}
}
