/// <reference path="ApartmentModel.ts"     />
/// <reference path="ApartmentPresenter.ts" />
/// <reference path="ApartmentView.ts"      />
/// <reference path="DialogManager.ts"      />
/// <reference path="MainModel.ts"          />
/// <reference path="MainPresenter.ts"      />
/// <reference path="MainView.ts"           />
/// <reference path="PersistentState.ts"    />
/// <reference path="QueueModel.ts"         />
/// <reference path="QueuePresenter.ts"     />
/// <reference path="QueueView.ts"          />
/// <reference path="SaveModel.ts"         />
/// <reference path="SavePresenter.ts"     />
/// <reference path="SaveView.ts"          />
/// <reference path="StoreModel.ts"         />
/// <reference path="StorePresenter.ts"     />
/// <reference path="StoreView.ts"          />
/// <reference path="Timer.ts"              />

function Main(dialogs : IDialog[])
{
	var dialogManager = new DialogManager(dialogs);

	var timer = new Timer();

	var apartmentModel = new ApartmentModel();
	var mainModel      = new MainModel(timer);
	var queueModel     = new QueueModel(timer, 8);
	var saveModel      = new SaveModel();
	var storeModel     = new StoreModel();

	var apartmentView = new ApartmentView();
	var queueView     = new QueueView();
	var saveView      = new SaveView();
	var storeView     = new StoreView();

	var mainView = new MainView([ apartmentView, queueView, storeView ]);

	var apartmentPresenter = new ApartmentPresenter(apartmentModel, mainModel, apartmentView);
	var mainPresenter      = new MainPresenter(mainModel, mainView);
	var queuePresenter     = new QueuePresenter(mainModel, queueModel, queueView, dialogManager);
	var savePrsenter       = new SavePresenter(saveModel, saveView);
	var storePresenter     = new StorePresenter(mainModel, storeModel, storeView);

	var persistentItems = <[string, IPersistent][]>
		[ [ "main",  mainModel  ]
		, [ "queue", queueModel ]
		, [ "timer", timer      ]
		];
	var persistentState = new PersistentState(persistentItems, timer);

	mainPresenter.Start();
	timer.Start(100);

	persistentState.Load();
}

$.getJSON("js/dialogs.json", function(dialogs : IDialog[], textStatus: string, jqXHR: JQueryXHR)
{
	Main(dialogs);
})
