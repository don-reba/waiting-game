/// <reference path="HomeModel.ts"       />
/// <reference path="HomePresenter.ts"   />
/// <reference path="HomeView.ts"        />
/// <reference path="DialogManager.ts"   />
/// <reference path="MainModel.ts"       />
/// <reference path="MainPresenter.ts"   />
/// <reference path="MainView.ts"        />
/// <reference path="PersistentState.ts" />
/// <reference path="Player.ts"          />
/// <reference path="QueueModel.ts"      />
/// <reference path="QueuePresenter.ts"  />
/// <reference path="QueueView.ts"       />
/// <reference path="SaveModel.ts"       />
/// <reference path="SavePresenter.ts"   />
/// <reference path="SaveView.ts"        />
/// <reference path="StoreModel.ts"      />
/// <reference path="StorePresenter.ts"  />
/// <reference path="StoreView.ts"       />
/// <reference path="Timer.ts"           />

function Main(dialogs : IDialog[])
{
	var dialogManager = new DialogManager(dialogs);

	var timer = new Timer();

	var player = new Player(timer);

	var homeModel  = new HomeModel();
	var mainModel  = new MainModel(player);
	var queueModel = new QueueModel(timer, 8);
	var saveModel  = new SaveModel();
	var storeModel = new StoreModel(player);

	var homeView  = new HomeView();
	var queueView = new QueueView();
	var saveView  = new SaveView();
	var storeView = new StoreView();

	var mainView = new MainView([ homeView, queueView, storeView ]);

	var homePresenter  = new HomePresenter(homeModel,  mainModel,  homeView);
	var mainPresenter  = new MainPresenter(mainModel,  mainView);
	var queuePresenter = new QueuePresenter(mainModel, queueModel, queueView,  dialogManager);
	var savePrsenter   = new SavePresenter(saveModel,  saveView);
	var storePresenter = new StorePresenter(mainModel, storeModel, storeView);

	var persistentItems = <[string, IPersistent][]>
		[ [ "main",   mainModel  ]
		, [ "queue",  queueModel ]
		, [ "player", player     ]
		, [ "timer",  timer      ]
		];
	var persistentState = new PersistentState(persistentItems, timer);

	persistentState.Load();

	mainPresenter.LightsCameraAction();
	timer.Start(100);
}

$.getJSON("js/dialogs.json", function(dialogs : IDialog[], textStatus: string, jqXHR: JQueryXHR)
{
	Main(dialogs);
})
