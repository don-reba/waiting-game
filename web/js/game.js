/// <reference path="IApartmentModel.ts" />
var ApartmentModel = (function () {
    function ApartmentModel() {
    }
    return ApartmentModel;
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
/// <reference path="IApartmentModel.ts" />
/// <reference path="IApartmentView.ts"  />
/// <reference path="IMainModel.ts"      />
var ApartmentPresenter = (function () {
    function ApartmentPresenter(apartmentModel, mainModel, apartmentView) {
        this.apartmentModel = apartmentModel;
        this.mainModel = mainModel;
        this.apartmentView = apartmentView;
        apartmentView.GoToQueue.Add(this.OnGoToQueue.bind(this));
        apartmentView.GoToStore.Add(this.OnGoToStore.bind(this));
    }
    ApartmentPresenter.prototype.OnGoToQueue = function () {
        this.mainModel.SetView(1 /* Queue */);
    };
    ApartmentPresenter.prototype.OnGoToStore = function () {
        this.mainModel.SetView(2 /* Store */);
    };
    return ApartmentPresenter;
})();
/// <reference path="../dts/jquery.d.ts" />
var ClientViewType;
(function (ClientViewType) {
    ClientViewType[ClientViewType["Apartment"] = 0] = "Apartment";
    ClientViewType[ClientViewType["Queue"] = 1] = "Queue";
    ClientViewType[ClientViewType["Store"] = 2] = "Store";
})(ClientViewType || (ClientViewType = {}));
/// <reference path="IApartmentView.ts" />
/// <reference path="IClientView.ts" />
var ApartmentView = (function () {
    function ApartmentView() {
        // IApartmentView implementation
        this.GoToQueue = new Signal();
        this.GoToStore = new Signal();
    }
    // IClientView implementation
    ApartmentView.prototype.GetType = function () {
        return 0 /* Apartment */;
    };
    ApartmentView.prototype.Hide = function () {
    };
    ApartmentView.prototype.Show = function (e) {
        var _this = this;
        e.append("<table id='apartment'><tr><td id='apartment-header'><button id='goQueue'>в очередь</button><button id='goStore'>в магазин</button></td></tr><tr><td id='apartment-view'>Вы у себя дома…</td></tr></table>");
        $("#goQueue").click(function () {
            _this.GoToQueue.Call();
        });
        $("#goStore").click(function () {
            _this.GoToStore.Call();
        });
    };
    return ApartmentView;
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
        this.dialogs = dialogs;
    }
    DialogManager.prototype.GetDialog = function (dialogID) {
        if (dialogID >= 0)
            return this.dialogs[dialogID];
        return null;
    };
    DialogManager.prototype.GetRefDialogID = function (dialogID, option) {
        if (dialogID >= 0 && option >= 0)
            return this.dialogs[dialogID].replies[option].ref;
        return null;
    };
    return DialogManager;
})();
/// <reference path="IClientView.ts" />
/// <reference path="Signal.ts" />
/// <reference path="IMainModel.ts"  />
/// <reference path="IPersistent.ts" />
var MainModelState = (function () {
    function MainModelState(money, view) {
        this.money = money;
        this.view = view;
    }
    return MainModelState;
})();
var MainModel = (function () {
    function MainModel(timer) {
        this.timer = timer;
        // IMainModel implementation
        this.MoneyChanged = new Signal();
        this.ResetActivated = new Signal();
        this.ViewChanged = new Signal();
        timer.AddEvent(this.OnPay.bind(this), 20);
        this.Reset();
    }
    MainModel.prototype.GetView = function () {
        return this.view;
    };
    MainModel.prototype.GetMoney = function () {
        return this.money;
    };
    MainModel.prototype.Reset = function () {
        this.money = 0;
        this.view = 0 /* Apartment */;
        this.ResetActivated.Call();
        this.MoneyChanged.Call();
        this.ViewChanged.Call();
    };
    MainModel.prototype.SetView = function (view) {
        this.view = view;
        this.ViewChanged.Call();
    };
    // IPersistent implementation
    MainModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.money = state.money;
        this.view = state.view;
        this.ViewChanged.Call();
        this.MoneyChanged.Call();
    };
    MainModel.prototype.ToPersistentString = function () {
        var state = new MainModelState(this.money, this.view);
        return JSON.stringify(state);
    };
    // private implementation
    MainModel.prototype.OnPay = function () {
        ++this.money;
        this.MoneyChanged.Call();
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
        mainModel.ViewChanged.Add(this.OnViewChanged.bind(this));
        mainView.ResetRequested.Add(this.OnResetRequested.bind(this));
    }
    MainPresenter.prototype.Start = function () {
        this.mainModel.Reset();
    };
    MainPresenter.prototype.OnMoneyChanged = function () {
        this.mainView.SetMoney(this.mainModel.GetMoney());
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
        this.version = "1";
        timer.AddEvent(this.Save.bind(this), 50);
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
/// <reference path="IQueueModel.ts" />
/// <reference path="IPersistent.ts" />
var Character = (function () {
    function Character(name) {
        this.name = name;
    }
    return Character;
})();
var QueuePosition = (function () {
    function QueuePosition(character, remaining, ticket) {
        this.character = character;
        this.remaining = remaining;
        this.ticket = ticket;
    }
    return QueuePosition;
})();
var QueueModelState = (function () {
    function QueueModelState(queue, stock, player, ticket, dialogID, speaker) {
        this.queue = queue;
        this.stock = stock;
        this.player = player;
        this.ticket = ticket;
        this.dialogID = dialogID;
        this.speaker = speaker;
    }
    return QueueModelState;
})();
var QueueModel = (function () {
    function QueueModel(timer, maxLength) {
        this.timer = timer;
        this.maxLength = maxLength;
        // IQueueModel implementation
        this.CurrentTicketChanged = new Signal();
        this.DialogChanged = new Signal();
        this.PeopleChanged = new Signal();
        this.PlayerTicketChanged = new Signal();
        timer.AddEvent(this.OnAdvance.bind(this), 20);
        timer.AddEvent(this.OnKnock.bind(this), 19);
        this.Reset();
    }
    QueueModel.prototype.EnterQueue = function () {
        if (this.queue.every(function (p) {
            return p.character != null;
        }))
            this.AddPlayerPosition();
    };
    QueueModel.prototype.GetDialogID = function () {
        return this.dialogID;
    };
    QueueModel.prototype.GetPlayerTicket = function () {
        for (var i = 0; i != this.queue.length; ++i) {
            if (!this.queue[i].character)
                return this.queue[i].ticket;
        }
        return null;
    };
    QueueModel.prototype.GetCurrentTicket = function () {
        if (this.queue.length > 0)
            return this.queue[0].ticket;
        return null;
    };
    QueueModel.prototype.GetPeopleNames = function () {
        return this.queue.filter(function (p) {
            return p.character != null;
        }).map(function (p) {
            return p.character.name;
        });
    };
    QueueModel.prototype.GetSpeaker = function () {
        return this.speaker;
    };
    QueueModel.prototype.Reset = function () {
        this.stock = [new Character("Аня"), new Character("Борис"), new Character("Вера"), new Character("Григорий"), new Character("Даша"), new Character("Елена"), new Character("Жора"), new Character("Зоя"), new Character("Инна"), new Character("Костик"), new Character("Лёша"), new Character("Маша"), new Character("Настя"), new Character("Оля"), new Character("Пётр"), new Character("Родриг"), new Character("Света"), new Character("Тамара"), new Character("Усач"), new Character("Фёдор"), new Character("Хосе"), new Character("Цезарь"), new Character("Чарли"), new Character("Шарик"), new Character("Элла"), new Character("Юра"), new Character("Яна")];
        this.ticket = 0;
        this.queue = [];
        for (var i = 0; i != this.maxLength; ++i)
            this.AddStockPosition();
    };
    QueueModel.prototype.SetDialog = function (speaker, dialogID) {
        this.speaker = speaker;
        this.dialogID = dialogID;
        this.DialogChanged.Call();
    };
    // IPersistent implementation
    QueueModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.queue = state.queue;
        this.stock = state.stock;
        this.player = state.player;
        this.ticket = state.ticket;
        this.dialogID = state.dialogID;
        this.speaker = state.speaker;
        this.PlayerTicketChanged.Call();
        this.CurrentTicketChanged.Call();
        this.PeopleChanged.Call();
        this.DialogChanged.Call();
    };
    QueueModel.prototype.ToPersistentString = function () {
        var state = new QueueModelState(this.queue, this.stock, this.player, this.ticket, this.dialogID, this.speaker);
        return JSON.stringify(state);
    };
    // private implementation
    QueueModel.prototype.AddStockPosition = function () {
        var i = Math.floor(Math.random() * this.stock.length);
        var delay = Math.floor(2 + Math.random() * 8);
        var ticket = String(this.ticket++);
        var p = new QueuePosition(this.stock[i], delay, ticket);
        this.stock.splice(i, 1);
        this.queue.push(p);
    };
    QueueModel.prototype.AddPlayerPosition = function () {
        var delay = Math.floor(2 + Math.random() * 8);
        var ticket = String(this.ticket++);
        var p = new QueuePosition(null, delay, ticket);
        this.queue.push(p);
    };
    QueueModel.prototype.OnAdvance = function () {
        if (this.queue.length == 0)
            return;
        var p = this.queue[0];
        --p.remaining;
        if (p.remaining <= 0) {
            this.queue.shift();
            if (p.character) {
                this.stock.push(p.character);
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
    function QueuePresenter(mainModel, queueModel, queueView, dialogManager) {
        this.mainModel = mainModel;
        this.queueModel = queueModel;
        this.queueView = queueView;
        this.dialogManager = dialogManager;
        queueModel.CurrentTicketChanged.Add(this.OnCurrentTicketChanged.bind(this));
        queueModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
        queueModel.PeopleChanged.Add(this.OnPeopleChanged.bind(this));
        queueModel.PlayerTicketChanged.Add(this.OnPlayerTicketChanged.bind(this));
        queueView.GoToApartment.Add(this.OnGoToApartment.bind(this));
        queueView.PersonClicked.Add(this.OnPersonClicked.bind(this));
        queueView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
        queueView.Shown.Add(this.OnQueueShown.bind(this));
        mainModel.ResetActivated.Add(this.OnResetActivated.bind(this));
    }
    QueuePresenter.prototype.OnCurrentTicketChanged = function () {
        var ticket = this.queueModel.GetCurrentTicket();
        if (ticket == null)
            this.queueView.ClearCurrentTicket();
        else
            this.queueView.SetCurrentTicket(ticket);
    };
    QueuePresenter.prototype.OnDialogChanged = function () {
        this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.dialogManager.GetDialog(this.queueModel.GetDialogID()));
    };
    QueuePresenter.prototype.OnGoToApartment = function () {
        this.mainModel.SetView(0 /* Apartment */);
    };
    QueuePresenter.prototype.OnPeopleChanged = function () {
        this.queueView.SetPeopleNames(this.queueModel.GetPeopleNames());
    };
    QueuePresenter.prototype.OnPersonClicked = function () {
        this.queueModel.SetDialog(this.queueView.GetSpeaker(), 0);
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
        this.queueView.SetPeopleNames(this.queueModel.GetPeopleNames());
        this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.dialogManager.GetDialog(this.queueModel.GetDialogID()));
    };
    QueuePresenter.prototype.OnReplyClicked = function () {
        var reply = this.queueView.GetSelectedReply();
        var dialogID = this.dialogManager.GetRefDialogID(this.queueModel.GetDialogID(), reply);
        this.queueModel.SetDialog(this.queueView.GetSpeaker(), dialogID);
    };
    QueuePresenter.prototype.OnResetActivated = function () {
        this.queueModel.Reset();
    };
    return QueuePresenter;
})();
/// <reference path="IQueueView.ts" />
/// <reference path="IClientView.ts" />
var QueueView = (function () {
    function QueueView() {
        this.selectedPerson = null;
        this.selectedReply = -1;
        // IQueueView implementation
        this.GoToApartment = new Signal();
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
        return this.selectedPerson;
    };
    QueueView.prototype.SetCurrentTicket = function (ticket) {
        $("#queue #current").text("текущий номер: " + ticket);
    };
    QueueView.prototype.SetDialog = function (speaker, dialog) {
        var div = $("#queue #dialog");
        div.empty();
        if (!dialog)
            return;
        div.append($("<p><strong>" + speaker + "</strong>: " + dialog.text + "</p>"));
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
    QueueView.prototype.SetPeopleNames = function (names) {
        var people = $("#queue #people");
        people.empty();
        for (var i = 0; i != names.length; ++i) {
            var OnClick = function (e) {
                this.selectedPerson = e.data;
                this.PersonClicked.Call();
            };
            var button = $("<button>");
            button.text(names[i]);
            button.click(names[i], OnClick.bind(this));
            people.append(button);
        }
    };
    // IClientView implementation
    QueueView.prototype.GetType = function () {
        return 1 /* Queue */;
    };
    QueueView.prototype.Hide = function () {
    };
    QueueView.prototype.Show = function (e) {
        var _this = this;
        e.append("<table id='queue'><tr><td><button id='goApartment'>вернуться домой</button></td></tr><tr><td id='player' /></tr><tr><td id='current' /></tr><tr><td id='people' /></tr><tr><td id='body'><div id='dialog' /></td></tr></table>");
        $("#goApartment").click(function () {
            _this.GoToApartment.Call();
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
var StoreModel = (function () {
    function StoreModel() {
    }
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
        storeView.GoToApartment.Add(this.OnGoToApartment.bind(this));
    }
    StorePresenter.prototype.OnGoToApartment = function () {
        this.mainModel.SetView(0 /* Apartment */);
    };
    return StorePresenter;
})();
/// <reference path="IStoreView.ts" />
/// <reference path="IClientView.ts" />
var StoreView = (function () {
    function StoreView() {
        // IStoreView implementation
        this.GoToApartment = new Signal();
    }
    // IClientView implementation
    StoreView.prototype.GetType = function () {
        return 2 /* Store */;
    };
    StoreView.prototype.Hide = function () {
    };
    StoreView.prototype.Show = function (e) {
        var _this = this;
        e.append("<table id='store'><tr><td id='store-header'><button id='goApartment'>вернуться домой</button></td></tr><tr><td id='store-view'>Что вы здесь делаете? Кризис на дворе!</td></tr></table>");
        $("#store #goApartment").click(function () {
            _this.GoToApartment.Call();
        });
    };
    return StoreView;
})();
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
function Main(dialogs) {
    var dialogManager = new DialogManager(dialogs);
    var timer = new Timer();
    var apartmentModel = new ApartmentModel();
    var mainModel = new MainModel(timer);
    var queueModel = new QueueModel(timer, 8);
    var saveModel = new SaveModel();
    var storeModel = new StoreModel();
    var apartmentView = new ApartmentView();
    var queueView = new QueueView();
    var saveView = new SaveView();
    var storeView = new StoreView();
    var mainView = new MainView([apartmentView, queueView, storeView]);
    var apartmentPresenter = new ApartmentPresenter(apartmentModel, mainModel, apartmentView);
    var mainPresenter = new MainPresenter(mainModel, mainView);
    var queuePresenter = new QueuePresenter(mainModel, queueModel, queueView, dialogManager);
    var savePrsenter = new SavePresenter(saveModel, saveView);
    var storePresenter = new StorePresenter(mainModel, storeModel, storeView);
    var persistentItems = [["main", mainModel], ["queue", queueModel], ["timer", timer]];
    var persistentState = new PersistentState(persistentItems, timer);
    mainPresenter.Start();
    timer.Start(100);
    persistentState.Load();
}
$.getJSON("js/dialogs.json", function (dialogs, textStatus, jqXHR) {
    Main(dialogs);
});
