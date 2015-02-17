/// <reference path="ICharacter.ts" />
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Escape"] = 0] = "Escape";
    DialogType[DialogType["Greeting"] = 1] = "Greeting";
})(DialogType || (DialogType = {}));
var CharacterManager = (function () {
    function CharacterManager(characters) {
        this.characters = characters;
        this.map = {};
        for (var i = 0; i != characters.length; ++i)
            this.map[characters[i].id] = characters[i];
    }
    CharacterManager.prototype.GetCharacter = function (id) {
        if (id)
            return this.map[id];
    };
    CharacterManager.prototype.GetDialogID = function (characterID, dialogType) {
        var character = this.map[characterID];
        switch (dialogType) {
            case 0 /* Escape */:
                if (character.queueEscapeDialogs)
                    return character.queueGreetingDialogs[0];
                return "StdQueueEscape";
            case 1 /* Greeting */:
                if (character.queueGreetingDialogs)
                    return character.queueGreetingDialogs[0];
                return "StdQueueGreeting";
        }
    };
    CharacterManager.prototype.GetRandomCharacter = function () {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    };
    return CharacterManager;
})();
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)
var CompactJson;
(function (CompactJson) {
    function Stringify(obj, options) {
        if (options === void 0) { options = { indent: "  ", maxLength: 80 }; }
        var indent = options.indent;
        var maxLength = options.maxLength;
        return (function _stringify(obj, currentIndent, reserved) {
            if (obj && typeof obj.toJSON === "function") {
                obj = obj.toJSON();
            }
            var string = JSON.stringify(obj);
            if (string === undefined) {
                return string;
            }
            var length = maxLength - currentIndent.length - reserved;
            if (string.length <= length) {
                var prettified = prettify(string);
                if (prettified.length <= length) {
                    return prettified;
                }
            }
            if (typeof obj === "object" && obj !== null) {
                var nextIndent = currentIndent + indent;
                var items = [];
                var delimiters;
                var comma = function (array, index) {
                    return (index === array.length - 1 ? 0 : 1);
                };
                if (Array.isArray(obj)) {
                    for (var index = 0; index < obj.length; index++) {
                        items.push(_stringify(obj[index], nextIndent, comma(obj, index)) || "null");
                    }
                    delimiters = "[]";
                }
                else {
                    Object.keys(obj).forEach(function (key, index, array) {
                        var keyPart = JSON.stringify(key) + ": ";
                        var value = _stringify(obj[key], nextIndent, keyPart.length + comma(array, index));
                        if (value !== undefined) {
                            items.push(keyPart + value);
                        }
                    });
                    delimiters = "{}";
                }
                if (items.length > 0) {
                    return [
                        delimiters[0],
                        indent + items.join(",\n" + nextIndent),
                        delimiters[1]
                    ].join("\n" + currentIndent);
                }
            }
            return string;
        }(obj, "", 0));
    }
    CompactJson.Stringify = Stringify;
    // Note: This regex matches even invalid JSON strings, but since we’re
    // working on the output of `JSON.stringify` we know that only valid strings
    // are present (unless the user supplied a weird `options.indent` but in
    // that case we don’t care since the output would be invalid anyway).
    var stringOrChar = /("(?:[^"]|\\.)*")|[:,]/g;
    function prettify(string) {
        return string.replace(stringOrChar, function (match, string) {
            if (string) {
                return match;
            }
            return match + " ";
        });
    }
})(CompactJson || (CompactJson = {}));
var Reply = (function () {
    function Reply() {
    }
    return Reply;
})();
/// <reference path="IDialog.ts" />
var DialogManager = (function () {
    function DialogManager(dialogs) {
        this.dialogs = {};
        for (var i = 0; i != dialogs.length; ++i)
            this.dialogs[dialogs[i].id] = dialogs[i];
    }
    DialogManager.prototype.GetDialog = function (dialogID) {
        if (dialogID)
            return this.dialogs[dialogID];
        return null;
    };
    DialogManager.prototype.GetRefDialogID = function (dialogID, option) {
        if (dialogID)
            return this.dialogs[dialogID].replies[option].ref;
        return null;
    };
    return DialogManager;
})();
/// <reference path="IHomeModel.ts" />
var HomeModel = (function () {
    function HomeModel() {
    }
    return HomeModel;
})();
var Signal = (function () {
    function Signal() {
        this.listeners = [];
    }
    Signal.prototype.Add = function (listener) {
        this.listeners.push(listener);
    };
    Signal.prototype.Call = function () {
        for (var i = 0, length = this.listeners.length; i != length; ++i)
            this.listeners[i]();
    };
    return Signal;
})();
/// <reference path="Signal.ts" />
/// <reference path="IHomeModel.ts" />
/// <reference path="IHomeView.ts"  />
/// <reference path="IMainModel.ts"      />
var HomePresenter = (function () {
    function HomePresenter(homeModel, mainModel, homeView) {
        this.homeModel = homeModel;
        this.mainModel = mainModel;
        this.homeView = homeView;
        homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
        homeView.GoToStore.Add(this.OnGoToStore.bind(this));
    }
    HomePresenter.prototype.OnGoToQueue = function () {
        this.mainModel.SetView(1 /* Queue */);
    };
    HomePresenter.prototype.OnGoToStore = function () {
        this.mainModel.SetView(2 /* Store */);
    };
    return HomePresenter;
})();
/// <reference path="../dts/jquery.d.ts" />
var ClientViewType;
(function (ClientViewType) {
    ClientViewType[ClientViewType["Home"] = 0] = "Home";
    ClientViewType[ClientViewType["Queue"] = 1] = "Queue";
    ClientViewType[ClientViewType["Store"] = 2] = "Store";
})(ClientViewType || (ClientViewType = {}));
/// <reference path="IHomeView.ts" />
/// <reference path="IClientView.ts" />
var HomeView = (function () {
    function HomeView() {
        // IHomeView implementation
        this.GoToQueue = new Signal();
        this.GoToStore = new Signal();
    }
    // IClientView implementation
    HomeView.prototype.GetType = function () {
        return 0 /* Home */;
    };
    HomeView.prototype.Hide = function () {
    };
    HomeView.prototype.Show = function (e) {
        var _this = this;
        e.html("<table id='home'><tr><td id='home-header'><button id='goQueue'>в очередь</button><button id='goStore'>в магазин</button></td></tr><tr><td id='home-view'>Вы у себя дома…</td></tr></table>");
        $("#goQueue").click(function () {
            _this.GoToQueue.Call();
        });
        $("#goStore").click(function () {
            _this.GoToStore.Call();
        });
    };
    return HomeView;
})();
/// <reference path="IClientView.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />
/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />
/// <reference path="Signal.ts" />
var Item;
(function (Item) {
    Item[Item["PencilMoustache"] = 0] = "PencilMoustache";
})(Item || (Item = {}));
var ItemInfo = (function () {
    function ItemInfo() {
    }
    return ItemInfo;
})();
var Item;
(function (Item) {
    var items = [
        { name: "Усы «Карандаш»", description: "Мужественность со скидкой.", price: 1000 }
    ];
    function GetInfo(item) {
        return items[item];
    }
    Item.GetInfo = GetInfo;
})(Item || (Item = {}));
/// <reference path="Item.ts" />
/// <reference path="Item.ts" />
/// <reference path="IMainModel.ts"  />
/// <reference path="IPersistent.ts" />
var MainModelState = (function () {
    function MainModelState() {
    }
    return MainModelState;
})();
var MainModel = (function () {
    function MainModel(player) {
        this.player = player;
        this.view = 0 /* Home */;
        // IMainModel implementation
        this.MoneyChanged = new Signal();
        this.MoustacheChanged = new Signal();
        this.ViewChanged = new Signal();
        player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
        player.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
    }
    MainModel.prototype.GetView = function () {
        return this.view;
    };
    MainModel.prototype.GetMoney = function () {
        return this.player.GetMoney();
    };
    MainModel.prototype.GetMoustache = function () {
        return this.player.GetMoustache();
    };
    MainModel.prototype.Reset = function () {
        localStorage.clear();
        location.reload();
    };
    MainModel.prototype.SetView = function (view) {
        this.view = view;
        this.ViewChanged.Call();
    };
    // IPersistent implementation
    MainModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.view = state.view;
    };
    MainModel.prototype.ToPersistentString = function () {
        return JSON.stringify({ view: this.view });
    };
    // private implementation
    MainModel.prototype.OnMoneyChanged = function () {
        this.MoneyChanged.Call();
    };
    MainModel.prototype.OnMoustacheChanged = function () {
        this.MoustacheChanged.Call();
    };
    return MainModel;
})();
/// <reference path="IMainModel.ts" />
/// <reference path="IMainView.ts"  />
var MainPresenter = (function () {
    function MainPresenter(mainModel, mainView) {
        this.mainModel = mainModel;
        this.mainView = mainView;
        mainModel.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
        mainModel.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
        mainModel.ViewChanged.Add(this.OnViewChanged.bind(this));
        mainView.ResetRequested.Add(this.OnResetRequested.bind(this));
    }
    MainPresenter.prototype.LightsCameraAction = function () {
        this.mainView.SetMoney(this.mainModel.GetMoney());
        this.mainView.SetMoustache(this.mainModel.GetMoustache());
        this.mainView.SetClientView(this.mainModel.GetView());
    };
    MainPresenter.prototype.OnMoneyChanged = function () {
        this.mainView.SetMoney(this.mainModel.GetMoney());
    };
    MainPresenter.prototype.OnMoustacheChanged = function () {
        this.mainView.SetMoustache(this.mainModel.GetMoustache());
    };
    MainPresenter.prototype.OnResetRequested = function () {
        this.mainModel.Reset();
    };
    MainPresenter.prototype.OnViewChanged = function () {
        this.mainView.SetClientView(this.mainModel.GetView());
    };
    return MainPresenter;
})();
/// <reference path="IMainView.ts" />
var MainView = (function () {
    function MainView(clientViews) {
        var _this = this;
        this.clientViews = clientViews;
        // IMainView implementation
        this.ResetRequested = new Signal();
        var button = $("#reset-game");
        button.click(function () {
            _this.ResetRequested.Call();
        });
    }
    MainView.prototype.SetClientView = function (viewType) {
        var i = this.clientViews.map(function (v) {
            return v.GetType();
        }).indexOf(viewType);
        if (i < 0)
            return;
        var newActiveView = this.clientViews[i];
        if (this.activeView === newActiveView)
            return;
        if (this.activeView)
            this.activeView.Hide();
        var loc = $("#location");
        loc.empty();
        loc.removeClass();
        newActiveView.Show(loc);
        this.activeView = newActiveView;
    };
    MainView.prototype.SetMoney = function (money) {
        $("#money-total").text(Math.floor(money) + " ₽");
    };
    MainView.prototype.SetMoustache = function (moustache) {
        var text = "";
        switch (moustache) {
            case 1 /* Pencil */:
                text = "u";
                break;
            case 2 /* French */:
                text = "r";
                break;
            case 3 /* Handlebar */:
                text = "a";
                break;
        }
        $("#moustache").text(text);
    };
    return MainView;
})();
/// <reference path="IPersistent.ts" />
var TimerState = (function () {
    function TimerState(ticks) {
        this.ticks = ticks;
    }
    return TimerState;
})();
var TimerEvent = (function () {
    function TimerEvent(handler, delay) {
        this.handler = handler;
        this.delay = delay;
    }
    return TimerEvent;
})();
var Timer = (function () {
    function Timer() {
        this.events = [];
        // if we started at 0, all the events would go off at start
        this.ticks = 1;
    }
    // public interface
    Timer.prototype.Start = function (tickMilliseconds) {
        setInterval(this.OnTick.bind(this), tickMilliseconds);
    };
    Timer.prototype.AddEvent = function (e, delay) {
        this.events.push(new TimerEvent(e, delay));
    };
    // IPersistent implementation
    Timer.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.ticks = state.ticks;
    };
    Timer.prototype.ToPersistentString = function () {
        return JSON.stringify(new TimerState(this.ticks));
    };
    // private implementation
    Timer.prototype.OnTick = function () {
        for (var i = 0; i != this.events.length; ++i) {
            var e = this.events[i];
            if (this.ticks % e.delay == 0)
                e.handler();
        }
        ++this.ticks;
    };
    return Timer;
})();
/// <reference path="IPersistent.ts" />
/// <reference path="Signal.ts"      />
/// <reference path="Timer.ts"       />
var PersistentState = (function () {
    function PersistentState(items, timer) {
        this.items = items;
        this.version = "4";
        timer.AddEvent(this.Save.bind(this), 20);
    }
    // get the state string from each item and store it in local storage
    PersistentState.prototype.Save = function () {
        if (!this.LocalStoreAvailable())
            return;
        localStorage.setItem("version", this.version);
        for (var i = 0; i != this.items.length; ++i) {
            var item = this.items[i];
            localStorage.setItem(item[0], item[1].ToPersistentString());
        }
    };
    // get the string corresponding to every item from local storage and
    // ask it to restore its state from it
    PersistentState.prototype.Load = function () {
        if (!this.LocalStoreAvailable())
            return;
        if (localStorage.getItem("version") != this.version)
            return;
        try {
            for (var i = 0; i != this.items.length; ++i) {
                var item = this.items[i];
                item[1].FromPersistentString(localStorage.getItem(item[0]));
            }
        }
        catch (e) {
        }
    };
    PersistentState.prototype.LocalStoreAvailable = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch (e) {
            return false;
        }
    };
    return PersistentState;
})();
var Moustache;
(function (Moustache) {
    Moustache[Moustache["None"] = 0] = "None";
    Moustache[Moustache["Pencil"] = 1] = "Pencil";
    Moustache[Moustache["French"] = 2] = "French";
    Moustache[Moustache["Handlebar"] = 3] = "Handlebar";
})(Moustache || (Moustache = {}));
/// <reference path="IPersistent.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Signal.ts"      />
var PlayerState = (function () {
    function PlayerState() {
    }
    return PlayerState;
})();
var Player = (function () {
    function Player(timer) {
        this.moustache = 0 /* None */;
        this.money = 0;
        this.rate = 1;
        this.MoustacheChanged = new Signal();
        this.MoneyChanged = new Signal();
        this.RateChanged = new Signal();
        timer.AddEvent(this.OnPay.bind(this), 20);
    }
    Player.prototype.GetMoney = function () {
        return this.money;
    };
    Player.prototype.GetMoustache = function () {
        return this.moustache;
    };
    Player.prototype.SetMoney = function (money) {
        this.money = money;
        this.MoneyChanged.Call();
    };
    Player.prototype.SetMoustache = function (moustache) {
        this.moustache = moustache;
        this.MoustacheChanged.Call();
    };
    // IPersistent implementation
    Player.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.moustache = state.moustache;
        this.money = state.money;
        this.rate = state.rate;
    };
    Player.prototype.ToPersistentString = function () {
        var state = { moustache: this.moustache, money: this.money, rate: this.rate };
        return JSON.stringify(state);
    };
    // private implementation
    Player.prototype.OnPay = function () {
        this.money += this.rate;
        this.MoneyChanged.Call();
    };
    return Player;
})();
/// <reference path="CharacterManager.ts" />
/// <reference path="DialogManager.ts"    />
/// <reference path="IQueueModel.ts"      />
/// <reference path="IPersistent.ts"      />
var QueuePosition = (function () {
    function QueuePosition() {
    }
    return QueuePosition;
})();
var QueueModelState = (function () {
    function QueueModelState() {
    }
    return QueueModelState;
})();
var QueueModel = (function () {
    function QueueModel(timer, characterManager, dialogManager, maxLength) {
        this.timer = timer;
        this.characterManager = characterManager;
        this.dialogManager = dialogManager;
        this.maxLength = maxLength;
        // IQueueModel implementation
        this.CurrentTicketChanged = new Signal();
        this.DialogChanged = new Signal();
        this.PeopleChanged = new Signal();
        this.PlayerTicketChanged = new Signal();
        timer.AddEvent(this.OnAdvance.bind(this), 20);
        timer.AddEvent(this.OnKnock.bind(this), 19);
        this.ticket = 0;
        this.queue = [];
        for (var i = 0; i != this.maxLength; ++i)
            this.AddStockPosition();
    }
    QueueModel.prototype.AdvanceDialog = function (reply) {
        this.dialogID = this.dialogManager.GetRefDialogID(this.dialogID, reply);
        if (this.dialogID == null)
            this.speakerID = null;
        this.DialogChanged.Call();
    };
    QueueModel.prototype.EnterQueue = function () {
        if (this.queue.every(function (p) {
            return p.characterID != null;
        }))
            this.AddPlayerPosition();
    };
    QueueModel.prototype.GetCharacters = function () {
        var _this = this;
        return this.queue.map(function (p) {
            return _this.characterManager.GetCharacter(p.characterID);
        });
    };
    QueueModel.prototype.GetDialog = function () {
        return this.dialogManager.GetDialog(this.dialogID);
    };
    QueueModel.prototype.GetPlayerTicket = function () {
        for (var i = 0; i != this.queue.length; ++i) {
            if (!this.queue[i].characterID)
                return this.queue[i].ticket;
        }
        return null;
    };
    QueueModel.prototype.GetCurrentTicket = function () {
        if (this.queue.length > 0)
            return this.queue[0].ticket;
        return null;
    };
    QueueModel.prototype.GetSpeaker = function () {
        return this.characterManager.GetCharacter(this.speakerID);
    };
    QueueModel.prototype.StartDialog = function (speaker) {
        this.speakerID = speaker.id;
        this.dialogID = this.characterManager.GetDialogID(speaker.id, 1 /* Greeting */);
        this.DialogChanged.Call();
    };
    // IPersistent implementation
    QueueModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.queue = state.queue;
        this.player = state.player;
        this.ticket = state.ticket;
        this.dialogID = state.dialogID;
        this.speakerID = state.speakerID;
    };
    QueueModel.prototype.ToPersistentString = function () {
        var state = { queue: this.queue, player: this.player, ticket: this.ticket, dialogID: this.dialogID, speakerID: this.speakerID };
        return JSON.stringify(state);
    };
    // private implementation
    QueueModel.prototype.AddStockPosition = function () {
        var character;
        do {
            character = this.characterManager.GetRandomCharacter();
        } while (this.InQueue(character));
        var remaining = Math.floor(2 + Math.random() * 8);
        var ticket = String(this.ticket++);
        var p = { characterID: character.id, remaining: remaining, ticket: ticket };
        this.queue.push(p);
    };
    QueueModel.prototype.AddPlayerPosition = function () {
        var remaining = Math.floor(2 + Math.random() * 8);
        var ticket = String(this.ticket++);
        var p = { characterID: null, remaining: remaining, ticket: ticket };
        this.queue.push(p);
    };
    QueueModel.prototype.InQueue = function (c) {
        return this.queue.some(function (p) {
            return p.characterID && p.characterID === c.id;
        });
    };
    QueueModel.prototype.ProcessNextCharacter = function () {
        if (this.queue.length == 0)
            return;
        if (this.speakerID && this.queue[0].characterID == this.speakerID) {
            this.dialogID = this.characterManager.GetDialogID(this.speakerID, 0 /* Escape */);
            this.DialogChanged.Call();
        }
    };
    // event handlers
    QueueModel.prototype.OnAdvance = function () {
        if (this.queue.length == 0)
            return;
        var p = this.queue[0];
        --p.remaining;
        if (p.remaining <= 0) {
            this.queue.shift();
            if (p.characterID) {
                this.ProcessNextCharacter();
                this.PeopleChanged.Call();
            }
            else {
                this.PlayerTicketChanged.Call();
            }
            this.CurrentTicketChanged.Call();
        }
    };
    QueueModel.prototype.OnKnock = function () {
        if (this.queue.length < this.maxLength && Math.random() < 0.3) {
            this.AddStockPosition();
            this.PeopleChanged.Call();
        }
    };
    return QueueModel;
})();
/// <reference path="DialogManager.ts" />
/// <reference path="IMainModel.ts"    />
/// <reference path="IQueueModel.ts"   />
/// <reference path="IQueueView.ts"    />
var QueuePresenter = (function () {
    function QueuePresenter(mainModel, queueModel, queueView) {
        this.mainModel = mainModel;
        this.queueModel = queueModel;
        this.queueView = queueView;
        queueModel.CurrentTicketChanged.Add(this.OnCurrentTicketChanged.bind(this));
        queueModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
        queueModel.PeopleChanged.Add(this.OnPeopleChanged.bind(this));
        queueModel.PlayerTicketChanged.Add(this.OnPlayerTicketChanged.bind(this));
        queueView.GoToHome.Add(this.OnGoToHome.bind(this));
        queueView.PersonClicked.Add(this.OnPersonClicked.bind(this));
        queueView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
        queueView.Shown.Add(this.OnQueueShown.bind(this));
    }
    QueuePresenter.prototype.OnCurrentTicketChanged = function () {
        var ticket = this.queueModel.GetCurrentTicket();
        if (ticket == null)
            this.queueView.ClearCurrentTicket();
        else
            this.queueView.SetCurrentTicket(ticket);
    };
    QueuePresenter.prototype.OnDialogChanged = function () {
        this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.queueModel.GetDialog());
    };
    QueuePresenter.prototype.OnGoToHome = function () {
        this.mainModel.SetView(0 /* Home */);
    };
    QueuePresenter.prototype.OnPeopleChanged = function () {
        this.queueView.SetCharacters(this.queueModel.GetCharacters());
    };
    QueuePresenter.prototype.OnPersonClicked = function () {
        this.queueModel.StartDialog(this.queueView.GetSpeaker());
    };
    QueuePresenter.prototype.OnPlayerTicketChanged = function () {
        var ticket = this.queueModel.GetPlayerTicket();
        if (ticket == null)
            this.queueView.ClearPlayerTicket();
        else
            this.queueView.SetPlayerTicket(ticket);
    };
    QueuePresenter.prototype.OnQueueShown = function () {
        this.queueModel.EnterQueue();
        this.queueView.SetPlayerTicket(this.queueModel.GetPlayerTicket());
        this.queueView.SetCurrentTicket(this.queueModel.GetCurrentTicket());
        this.queueView.SetCharacters(this.queueModel.GetCharacters());
        this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.queueModel.GetDialog());
    };
    QueuePresenter.prototype.OnReplyClicked = function () {
        this.queueModel.AdvanceDialog(this.queueView.GetSelectedReply());
    };
    return QueuePresenter;
})();
/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />
var QueueView = (function () {
    function QueueView() {
        this.selectedCharacter = null;
        this.selectedReply = -1;
        // IQueueView implementation
        this.GoToHome = new Signal();
        this.PersonClicked = new Signal();
        this.ReplyClicked = new Signal();
        this.Shown = new Signal();
    }
    QueueView.prototype.ClearCurrentTicket = function () {
        $("#queue #current").text("");
    };
    QueueView.prototype.ClearPlayerTicket = function () {
        $("#queue #player").text("");
    };
    QueueView.prototype.GetSelectedReply = function () {
        return this.selectedReply;
    };
    QueueView.prototype.GetSpeaker = function () {
        return this.selectedCharacter;
    };
    QueueView.prototype.SetCharacters = function (characters) {
        var people = $("#queue #people");
        people.empty();
        for (var i = 0; i != characters.length; ++i) {
            var OnClick = function (e) {
                this.selectedCharacter = e.data;
                this.PersonClicked.Call();
            };
            var character = characters[i];
            if (!character)
                continue;
            var button = $("<button>");
            button.css("background-color", character.color);
            button.text(characters[i].name);
            button.click(characters[i], OnClick.bind(this));
            if (i == 0)
                button.prop("disabled", true);
            people.append(button);
        }
    };
    QueueView.prototype.SetCurrentTicket = function (ticket) {
        $("#queue #current").text("текущий номер: " + ticket);
    };
    QueueView.prototype.SetDialog = function (speaker, dialog) {
        var div = $("#queue #dialog");
        div.empty();
        if (!dialog)
            return;
        div.append($("<p><strong>" + speaker.name + "</strong>: " + dialog.text + "</p>"));
        var ol = $("<ol>");
        for (var i = 0; i != dialog.replies.length; ++i) {
            var OnClick = function (e) {
                this.selectedReply = e.data;
                this.ReplyClicked.Call();
            };
            var li = $("<li>");
            li.text(dialog.replies[i].text);
            li.click(i, OnClick.bind(this));
            ol.append(li);
        }
        div.append(ol);
    };
    QueueView.prototype.SetPlayerTicket = function (ticket) {
        $("#queue #player").text("ваш номер: " + ticket);
    };
    // IClientView implementation
    QueueView.prototype.GetType = function () {
        return 1 /* Queue */;
    };
    QueueView.prototype.Hide = function () {
    };
    QueueView.prototype.Show = function (e) {
        var _this = this;
        e.html("<table id='queue'><tr><td><button id='goHome'>вернуться домой</button></td></tr><tr><td id='player' /></tr><tr><td id='current' /></tr><tr><td id='people' /></tr><tr><td id='body'><div id='dialog' /></td></tr></table>");
        $("#goHome").click(function () {
            _this.GoToHome.Call();
        });
        this.Shown.Call();
    };
    return QueueView;
})();
/// <reference path="ISaveModel.ts" />
var SaveModel = (function () {
    function SaveModel() {
    }
    // ISaveModel implementation
    SaveModel.prototype.ClearSaveData = function () {
        localStorage.clear();
    };
    SaveModel.prototype.GetSaveData = function () {
        var data = [];
        for (var i = 0; i != localStorage.length; ++i) {
            var key = localStorage.key(i);
            var val = localStorage[key];
            data.push([key, val]);
        }
        return data;
    };
    SaveModel.prototype.SetSaveData = function (data) {
        for (var i = 0; i != data.length; ++i)
            localStorage[data[i][0]] = data[i][1];
        location.reload();
    };
    return SaveModel;
})();
/// <reference path="ISaveModel.ts" />
/// <reference path="ISaveView.ts"  />
var SavePresenter = (function () {
    function SavePresenter(saveModel, saveView) {
        this.saveModel = saveModel;
        this.saveView = saveView;
        this.saveView.Clear.Add(this.OnClear.bind(this));
        this.saveView.Load.Add(this.OnLoad.bind(this));
        this.saveView.Save.Add(this.OnSave.bind(this));
    }
    SavePresenter.prototype.OnClear = function () {
        this.saveModel.ClearSaveData();
        this.saveView.SetSaveData(this.saveModel.GetSaveData());
    };
    SavePresenter.prototype.OnLoad = function () {
        this.saveView.SetSaveData(this.saveModel.GetSaveData());
    };
    SavePresenter.prototype.OnSave = function () {
        this.saveModel.SetSaveData(this.saveView.GetSaveData());
    };
    return SavePresenter;
})();
/// <reference path="CompactJson.ts" />
/// <reference path="ISaveView.ts"   />
var SaveView = (function () {
    function SaveView() {
        var _this = this;
        // ISaveView implementation
        this.Clear = new Signal();
        this.Load = new Signal();
        this.Save = new Signal();
        $("#save-clear").click(function () {
            _this.Clear.Call();
        });
        $("#save-load").click(function () {
            _this.Load.Call();
        });
        $("#save-save").click(function () {
            _this.Save.Call();
        });
    }
    SaveView.prototype.GetSaveData = function () {
        var data = [];
        var rows = $("#dev-contents tr");
        for (var i = 0; i != rows.length; ++i) {
            var key = $(rows[i]).find("td.key").text();
            var value = $(rows[i]).find("td.value").text();
            data.push([key, value]);
        }
        return data;
    };
    SaveView.prototype.SetSaveData = function (data) {
        var rows = [];
        for (var i = 0; i != data.length; ++i) {
            var item = data[i];
            var key = item[0];
            var value = CompactJson.Stringify(JSON.parse(item[1]));
            rows.push("<tr><td class='key'>" + key + "</td><td class='value' contenteditable>" + value + "</td></tr>");
        }
        $("#dev-contents").html("<table>" + rows.join("") + "</table>");
    };
    return SaveView;
})();
/// <reference path="IStoreModel.ts" />
/// <reference path="Moustache.ts"   />
/// <reference path="Player.ts"      />
var StoreModel = (function () {
    function StoreModel(player) {
        this.player = player;
        // IStoreModel implementation
        this.Purchased = new Signal();
        player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
    }
    StoreModel.prototype.GetItems = function () {
        var money = this.player.GetMoney();
        var items = [];
        var moustache = this.player.GetMoustache();
        if (moustache < 1 /* Pencil */) {
            var item = 0 /* PencilMoustache */;
            var price = Item.GetInfo(item).price;
            var enabled = price <= money;
            items.push([item, enabled]);
        }
        return items;
    };
    StoreModel.prototype.Purchase = function (item) {
        var price = Item.GetInfo(item).price;
        var money = this.player.GetMoney();
        if (money < price)
            return;
        this.player.SetMoney(money - price);
        this.ApplyItem(item);
        this.Purchased.Call();
    };
    StoreModel.prototype.UpdateStock = function () {
    };
    // private implementation
    StoreModel.prototype.ApplyItem = function (item) {
        switch (item) {
            case 0 /* PencilMoustache */:
                this.player.SetMoustache(1 /* Pencil */);
        }
    };
    StoreModel.prototype.OnMoneyChanged = function () {
    };
    return StoreModel;
})();
/// <reference path="IMainModel.ts"  />
/// <reference path="IStoreModel.ts" />
/// <reference path="IStoreView.ts"  />
var StorePresenter = (function () {
    function StorePresenter(mainModel, storeModel, storeView) {
        this.mainModel = mainModel;
        this.storeModel = storeModel;
        this.storeView = storeView;
        storeModel.Purchased.Add(this.OnPurchased.bind(this));
        storeView.GoToHome.Add(this.OnGoToHome.bind(this));
        storeView.ItemSelected.Add(this.OnItemSelected.bind(this));
        storeView.Shown.Add(this.OnShown.bind(this));
    }
    StorePresenter.prototype.OnGoToHome = function () {
        this.mainModel.SetView(0 /* Home */);
    };
    StorePresenter.prototype.OnItemSelected = function () {
        this.storeModel.Purchase(this.storeView.GetSelectedItem());
    };
    StorePresenter.prototype.OnPurchased = function () {
        this.storeView.SetItems(this.storeModel.GetItems());
    };
    StorePresenter.prototype.OnShown = function () {
        this.storeModel.UpdateStock();
        this.storeView.SetItems(this.storeModel.GetItems());
    };
    return StorePresenter;
})();
/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />
var StoreView = (function () {
    function StoreView() {
        // IStoreView implementation
        this.GoToHome = new Signal();
        this.ItemSelected = new Signal();
        this.Shown = new Signal();
    }
    // IClientView implementation
    StoreView.prototype.GetSelectedItem = function () {
        return this.selectedItem;
    };
    StoreView.prototype.GetType = function () {
        return 2 /* Store */;
    };
    StoreView.prototype.Hide = function () {
    };
    StoreView.prototype.Show = function (e) {
        var _this = this;
        var header = "<tr><td id='store-header'><button id='goHome'>вернуться домой</button></td></tr>";
        var body = "<tr><td id='store-body'><div><table id='store-items'></table></div></td></tr>";
        e.html("<table id='store'>" + header + body + "</table>");
        $("#store #goHome").click(function () {
            _this.GoToHome.Call();
        });
        this.Shown.Call();
    };
    StoreView.prototype.SetItems = function (items) {
        var buttons = [];
        for (var i = 0; i != items.length; ++i) {
            var OnClick = function (e) {
                this.selectedItem = e.data;
                this.ItemSelected.Call();
            };
            var info = Item.GetInfo(items[i][0]);
            var enabled = items[i][1];
            var button = $("<td>" + info.name + "<br/>" + info.description + "<br/>" + info.price + " ₽</td>");
            if (enabled) {
                button.click(items[i][0], OnClick.bind(this));
                button.addClass("enabled");
            }
            else {
                button.addClass("disabled");
            }
            buttons.push(button);
        }
        var row = $("<tr>");
        for (var i = 0; i != buttons.length; ++i)
            row.append(buttons[i]);
        $("#store-items").empty().append(row);
    };
    return StoreView;
})();
/// <reference path="CharacterManager.ts" />
/// <reference path="HomeModel.ts"        />
/// <reference path="HomePresenter.ts"    />
/// <reference path="HomeView.ts"         />
/// <reference path="DialogManager.ts"    />
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
function Main(dialogs, characters) {
    var dialogManager = new DialogManager(dialogs);
    var characterManager = new CharacterManager(characters);
    var timer = new Timer();
    var player = new Player(timer);
    var homeModel = new HomeModel();
    var mainModel = new MainModel(player);
    var queueModel = new QueueModel(timer, characterManager, dialogManager, 8);
    var saveModel = new SaveModel();
    var storeModel = new StoreModel(player);
    var homeView = new HomeView();
    var queueView = new QueueView();
    var saveView = new SaveView();
    var storeView = new StoreView();
    var mainView = new MainView([homeView, queueView, storeView]);
    var homePresenter = new HomePresenter(homeModel, mainModel, homeView);
    var mainPresenter = new MainPresenter(mainModel, mainView);
    var queuePresenter = new QueuePresenter(mainModel, queueModel, queueView);
    var savePrsenter = new SavePresenter(saveModel, saveView);
    var storePresenter = new StorePresenter(mainModel, storeModel, storeView);
    var persistentItems = [["main", mainModel], ["queue", queueModel], ["player", player], ["timer", timer]];
    var persistentState = new PersistentState(persistentItems, timer);
    persistentState.Load();
    mainPresenter.LightsCameraAction();
    timer.Start(100);
}
$.getJSON("js/dialogs.json", function (dialogs) {
    $.getJSON("js/characters.json", function (characters) {
        Main(dialogs, characters);
    });
});
