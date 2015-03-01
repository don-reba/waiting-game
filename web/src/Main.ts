/// <reference path="CharacterManager.ts" />
/// <reference path="HomeModel.ts"        />
/// <reference path="HomePresenter.ts"    />
/// <reference path="HomeView.ts"         />
/// <reference path="DialogManager.ts"    />
/// <reference path="Flags.ts"            />
/// <reference path="MainModel.ts"        />
/// <reference path="MainPresenter.ts"    />
/// <reference path="MainView.ts"         />
/// <reference path="PersistentState.ts"  />
/// <reference path="Player.ts"           />
/// <reference path="QueueModel.ts"       />
/// <reference path="QueuePresenter.ts"   />
/// <reference path="QueueView.ts"        />
/// <reference path="SaveModel.ts"        />
/// <reference path="SavePresenter.ts"    />
/// <reference path="SaveView.ts"         />
/// <reference path="StoreModel.ts"       />
/// <reference path="StorePresenter.ts"   />
/// <reference path="StoreView.ts"        />
/// <reference path="Timer.ts"            />

function MapCharacterNameIntroFlags
	( flags            : Flags
	, player           : Player
	, characterManager : CharacterManager
	)
{
	var characters = characterManager.GetAllCharacters();
	for (var i = 0; i != characters.length; ++i)
	{
		var c = characters[i]
		var f = c.id + "Intro";
		flags.SetCheck(f, player.HasNotMet.bind(player, c));
	}
}

function Main(dialogs : IDialog[], characters : ICharacter[])
{
	var flags = new Flags();

	var dialogManager    = new DialogManager(dialogs, flags);
	var characterManager = new CharacterManager(characters, flags);

	var timer = new Timer();

	var player = new Player(timer);

	var homeModel  = new HomeModel(timer, characterManager, dialogManager);
	var mainModel  = new MainModel(player);
	var queueModel = new QueueModel(timer, characterManager, dialogManager, player);
	var saveModel  = new SaveModel();
	var storeModel = new StoreModel(player);

	var homeView  = new HomeView();
	var queueView = new QueueView();
	var saveView  = new SaveView();
	var storeView = new StoreView();

	var mainView = new MainView([ homeView, queueView, storeView ]);

	var homePresenter  = new HomePresenter(homeModel,  mainModel, queueModel,  homeView);
	var mainPresenter  = new MainPresenter(mainModel,  mainView);
	var queuePresenter = new QueuePresenter(mainModel, queueModel, queueView);
	var savePresenter  = new SavePresenter(saveModel,  saveView);
	var storePresenter = new StorePresenter(mainModel, storeModel, storeView);

	var persistentItems = <[string, IPersistent][]>
		[ [ "main",   mainModel  ]
		, [ "home",   homeModel  ]
		, [ "queue",  queueModel ]
		, [ "player", player     ]
		, [ "timer",  timer      ]
		, [ "flags",  flags      ]
		];
	var persistentState = new PersistentState(persistentItems, timer);

	MapCharacterNameIntroFlags(flags, player, characterManager);

	persistentState.Load();
	savePresenter.Load();

	mainPresenter.LightsCameraAction();
	timer.Start(100);
}

$.getJSON("js/dialogs.json", function(dialogs : IDialog[])
{
	$.getJSON("js/characters.json", function(characters : ICharacter[])
	{
		Main(dialogs, characters);
	})
})
