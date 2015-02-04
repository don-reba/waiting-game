/// <reference path="IMainModel.ts"  />
/// <reference path="IQueueModel.ts" />
/// <reference path="IQueueView.ts"  />

class QueuePresenter
{
	constructor
		( private mainModel  : IMainModel
		, private queueModel : IQueueModel
		, private queueView  : IQueueView
		)
	{
		queueModel.PlayerTicketChanged.Add(this.OnPlayerTicketChanged.bind(this));
		queueModel.CurrentTicketChanged.Add(this.OnCurrentTicketChanged.bind(this));
		queueModel.PeopleChanged.Add(this.OnPeopleChanged.bind(this));

		queueView.GoToApartment.Add(this.OnGoToApartment.bind(this));
		queueView.Shown.Add(this.OnQueueShown.bind(this));

		mainModel.ResetActivated.Add(this.OnResetActivated.bind(this));
	}

	private OnGoToApartment() : void
	{
		this.mainModel.SetView(ClientViewType.Apartment);
	}

	private OnQueueShown() : void
	{
		this.queueModel.EnterQueue();

		this.queueView.SetPlayerTicket(this.queueModel.GetPlayerTicket());
		this.queueView.SetCurrentTicket(this.queueModel.GetCurrentTicket());
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

	private OnCurrentTicketChanged() : void
	{
		var ticket = this.queueModel.GetCurrentTicket();
		if (ticket == null)
			this.queueView.ClearCurrentTicket();
		else
			this.queueView.SetCurrentTicket(ticket);
	}

	private OnPeopleChanged() : void
	{
		this.queueView.SetPeopleNames(this.queueModel.GetPeopleNames());
	}

	private OnResetActivated() : void
	{
		this.queueModel.Reset();
	}
}
