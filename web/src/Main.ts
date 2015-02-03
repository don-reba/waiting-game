/// <reference path="ApartmentModel.ts"     />
/// <reference path="ApartmentPresenter.ts" />
/// <reference path="ApartmentView.ts"      />
/// <reference path="MainModel.ts"          />
/// <reference path="MainPresenter.ts"      />
/// <reference path="MainView.ts"           />
/// <reference path="QueueModel.ts"         />
/// <reference path="QueuePresenter.ts"     />
/// <reference path="QueueView.ts"          />
/// <reference path="StoreModel.ts"         />
/// <reference path="StorePresenter.ts"     />
/// <reference path="StoreView.ts"          />
/// <reference path="Timer.ts"              />

function main()
{
	var timer = new Timer();

	var apartmentModel = new ApartmentModel();
	var mainModel      = new MainModel(timer);
	var queueModel     = new QueueModel(timer, 8);
	var storeModel     = new StoreModel();

	var apartmentView = new ApartmentView();
	var queueView     = new QueueView();
	var storeView     = new StoreView();

	var mainView = new MainView([ apartmentView, queueView, storeView ]);

	var apartmentPresenter = new ApartmentPresenter(apartmentModel, apartmentView, mainView);
	var mainPresenter      = new MainPresenter(mainModel, mainView);
	var queuePresenter     = new QueuePresenter(queueModel, queueView, mainView);
	var storePresenter     = new StorePresenter(storeModel, storeView, mainView);

	mainPresenter.Start();
	timer.Start(100);
}

main();
