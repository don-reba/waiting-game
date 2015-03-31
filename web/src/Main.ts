/// <reference path="ActivitiesMenuModel.ts" />
/// <reference path="CharacterManager.ts"    />
/// <reference path="InvitesMenuModel.ts"    />
/// <reference path="HomeModel.ts"           />
/// <reference path="HomePresenter.ts"       />
/// <reference path="HomeView.ts"            />
/// <reference path="DialogManager.ts"       />
/// <reference path="Flags.ts"               />
/// <reference path="MainModel.ts"           />
/// <reference path="MainPresenter.ts"       />
/// <reference path="MainView.ts"            />
/// <reference path="PersistentState.ts"     />
/// <reference path="Player.ts"              />
/// <reference path="QueueModel.ts"          />
/// <reference path="QueuePresenter.ts"      />
/// <reference path="QueueView.ts"           />
/// <reference path="SaveModel.ts"           />
/// <reference path="SavePresenter.ts"       />
/// <reference path="SaveView.ts"            />
/// <reference path="StoreModel.ts"          />
/// <reference path="StorePresenter.ts"      />
/// <reference path="StoreView.ts"           />
/// <reference path="Timer.ts"               />

function MapCharacterNameFlags
	( flags            : Flags
	, player           : Player
	, characterManager : CharacterManager
	, homeModel        : HomeModel
	, queueModel       : QueueModel
	) : void
{
	var characters = characterManager.GetAllCharacters();
	for (var i = 0; i != characters.length; ++i)
	{
		var c = characters[i]

		flags.SetCheck(c.id + "Intro",      player.HasNotMet.bind(player, c));
		flags.SetCheck(c.id + "Friendship", player.IsFriendsWith.bind(player, c));

		flags.SetControl(c.id + "Friendship", player.Befriend.bind(player, c));
		flags.SetControl(c.id + "ExitQueue",  queueModel.Remove.bind(queueModel, c));
		flags.SetControl(c.id + "ExitHome",   homeModel.Remove.bind(homeModel, c));
	}
}

function MapPlayerFlags(flags : Flags, player : Player) : void
{
	flags.SetCheck("MoustacheEquipped", () => { return player.GetMoustache() >= 0 });
	flags.SetCheck("MoustacheAbsent",   () => { return player.GetMoustache() <  0 });
	flags.SetCheck("HatEquipped",       () => { return player.GetHat() != Hat.None });

	flags.SetControl("ReceiveFakeMoustache", player.SetMoustache.bind(player, 1, true));
	flags.SetControl("DestroyCiv", player.RemoveItem.bind(player, Item.Civ));
}

function MapActivityFlags(flags : Flags, homeModel : HomeModel)
{
	flags.SetCheck("ActivityWatchingTv",        () => { return homeModel.GetActivity() == Activity.TV        });
	flags.SetCheck("ActivityWatchingCommunity", () => { return homeModel.GetActivity() == Activity.Community });
	flags.SetCheck("ActivityPlayingMonopoly",   () => { return homeModel.GetActivity() == Activity.Monopoly  });
	flags.SetCheck("ActivityPlayingCiv",        () => { return homeModel.GetActivity() == Activity.Civ       });
	flags.SetCheck("ActivityCooking",           () => { return homeModel.GetActivity() == Activity.Cooking   });
}

function Main(dialogs : IDialog[], characters : ICharacter[])
{
	var flags = new Flags();

	var dialogManager    = new DialogManager(dialogs, flags);
	var characterManager = new CharacterManager(characters, flags);

	var timer = new Timer();

	var player = new Player(timer);

	var activitiesModel = new ActivitiesMenuModel(player);
	var invitesModel    = new InvitesMenuModel(characterManager, player);
	var homeModel       = new HomeModel(timer, characterManager, dialogManager, player);
	var mainModel       = new MainModel(player);
	var queueModel      = new QueueModel(timer, characterManager, dialogManager, player);
	var saveModel       = new SaveModel();
	var storeModel      = new StoreModel(player);

	var homeView  = new HomeView();
	var queueView = new QueueView();
	var saveView  = new SaveView();
	var storeView = new StoreView();

	var mainView = new MainView([ homeView, queueView, storeView ]);

	var homePresenter  = new HomePresenter(homeModel, activitiesModel, invitesModel, mainModel, queueModel,  homeView);
	var mainPresenter  = new MainPresenter(mainModel,  mainView);
	var queuePresenter = new QueuePresenter(mainModel, queueModel, queueView);
	var savePresenter  = new SavePresenter(saveModel,  saveView);
	var storePresenter = new StorePresenter(mainModel, storeModel, storeView);

	var persistentItems = <[string, IPersistent][]>
		[ [ "activitiesMenu", activitiesModel ]
		, [ "invitesMenu",    invitesModel    ]
		, [ "home",           homeModel       ]
		, [ "main",           mainModel       ]
		, [ "player",         player          ]
		, [ "queue",          queueModel      ]
		, [ "store",          storeModel      ]
		, [ "timer",          timer           ]
		, [ "flags",          flags           ]
		];
	var persistentState = new PersistentState(persistentItems, timer);

	MapCharacterNameFlags(flags, player, characterManager, homeModel, queueModel);
	MapPlayerFlags(flags, player);
	MapActivityFlags(flags, homeModel);

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
