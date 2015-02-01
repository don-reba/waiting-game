/// <reference path="IQueueModel.ts" />
/// <reference path="IQueueView.ts"  />
/// <reference path="IMainView.ts"  />

class QueuePresenter
{
	constructor
		( private queueModel : IQueueModel
		, private queueView  : IQueueView
		, private mainView   : IMainView
		)
	{
		queueView.GoToApartment.Add(this.OnGoToApartment.bind(this));
	}

	private OnGoToApartment() : void
	{
		this.mainView.SetClientView(ClientViewType.Apartment);
	}
}
