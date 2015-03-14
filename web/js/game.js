var Activity;
(function (Activity) {
    Activity[Activity["None"] = 0] = "None";
    Activity[Activity["Stop"] = 1] = "Stop";
    Activity[Activity["Community"] = 2] = "Community";
    Activity[Activity["Monopoly"] = 3] = "Monopoly";
})(Activity || (Activity = {}));
var Activity;
(function (Activity) {
    var names = ["Убивать время", "Разойтись по домам", "Смотреть комьюнити", "Играть в Монополию"];
    function GetName(activity) {
        return names[activity];
    }
    Activity.GetName = GetName;
})(Activity || (Activity = {}));
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
/// <reference path="Activity.ts" />
/// <reference path="Signal.ts"   />
var ItemInfo = (function () {
    function ItemInfo() {
    }
    return ItemInfo;
})();
var Item;
(function (Item) {
    Item[Item["PencilMoustache"] = 0] = "PencilMoustache";
    Item[Item["Tophat"] = 1] = "Tophat";
    Item[Item["TV"] = 2] = "TV";
    Item[Item["Table"] = 3] = "Table";
    Item[Item["Community"] = 4] = "Community";
    Item[Item["Monopoly"] = 5] = "Monopoly";
})(Item || (Item = {}));
var Item;
(function (Item) {
    var items = [
        { name: "Усы «Карандаш»", description: "Мужественность со скидкой.", price: 1000 },
        { name: "Шляпа «Цилиндр»", description: "Выбор успешного человека.", price: 10000 },
        { name: "Телевизор", description: "С тёплым ламповым звуком.", price: 100000 },
        { name: "Кофейный столик", description: "Для приёма гостей.", price: 50000 },
        { name: "«Комьюнити»", description: "Испанский 101.", price: 20000 },
        { name: "«Монополия»", description: "Отличный способ разрушить дружбу.", price: 20000 },
    ];
    function GetInfo(item) {
        return items[item];
    }
    Item.GetInfo = GetInfo;
})(Item || (Item = {}));
var Moustache;
(function (Moustache) {
    Moustache[Moustache["None"] = 0] = "None";
    Moustache[Moustache["Pencil"] = 1] = "Pencil";
    Moustache[Moustache["French"] = 2] = "French";
    Moustache[Moustache["Handlebar"] = 3] = "Handlebar";
})(Moustache || (Moustache = {}));
/// <reference path="Item.ts"        />
/// <reference path="ICharacter.ts"  />
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
        this.hat = 0 /* None */;
        this.moustache = 0 /* None */;
        this.money = 0;
        this.rate = 0.5;
        this.composure = 0;
        this.hasMet = [];
        this.friends = [];
        this.items = [];
        this.Awkward = new Signal();
        this.HatChanged = new Signal();
        this.MoustacheChanged = new Signal();
        this.MoneyChanged = new Signal();
        this.RateChanged = new Signal();
        timer.AddEvent(this.OnSecond.bind(this), 10);
    }
    Player.prototype.AddItem = function (item) {
        if (this.items.indexOf(item) < 0)
            this.items.push(item);
    };
    Player.prototype.Befriend = function (character) {
        if (this.friends.indexOf(character.id) < 0)
            this.friends.push(character.id);
    };
    Player.prototype.ClearComposure = function () {
        this.composure = 0;
    };
    Player.prototype.GetFriendIDs = function () {
        return this.friends;
    };
    Player.prototype.GetHat = function () {
        return this.hat;
    };
    Player.prototype.GetItems = function () {
        return this.items;
    };
    Player.prototype.GetMoney = function () {
        return this.money;
    };
    Player.prototype.GetMoustache = function () {
        return this.moustache;
    };
    Player.prototype.GetRate = function () {
        return this.rate;
    };
    Player.prototype.HasItem = function (item) {
        return this.items.indexOf(item) >= 0;
    };
    // complexity: linear
    Player.prototype.HasNotMet = function (character) {
        return this.hasMet.indexOf(character.id) < 0;
    };
    // complexity: linear
    Player.prototype.IntroduceTo = function (character) {
        if (this.hasMet.indexOf(character.id) < 0)
            this.hasMet.push(character.id);
    };
    Player.prototype.IsFriendsWith = function (character) {
        return this.friends.indexOf(character.id) >= 0;
    };
    Player.prototype.ResetComposure = function () {
        this.composure = 30;
    };
    Player.prototype.SetHat = function (hat) {
        this.hat = hat;
        this.HatChanged.Call();
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
        this.hat = state.hat;
        this.moustache = state.moustache;
        this.money = state.money;
        this.rate = state.rate;
        this.composure = state.composure;
        this.hasMet = state.hasMet;
        this.friends = state.friends;
        this.items = state.items;
    };
    Player.prototype.ToPersistentString = function () {
        var state = { hat: this.hat, moustache: this.moustache, money: this.money, rate: this.rate, composure: this.composure, hasMet: this.hasMet, friends: this.friends, items: this.items };
        return JSON.stringify(state);
    };
    // private implementation
    Player.prototype.OnSecond = function () {
        this.money += this.rate;
        this.MoneyChanged.Call();
        if (this.composure > 0) {
            --this.composure;
            if (this.composure == 0)
                this.Awkward.Call();
        }
    };
    return Player;
})();
/// <reference path="IActivitiesMenuModel.ts" />
/// <reference path="IPersistent.ts"          />
/// <reference path="Player.ts"               />
var ActivitiesMenuModel = (function () {
    function ActivitiesMenuModel(player) {
        this.player = player;
        this.isVisible = false;
        this.VisibilityChanged = new Signal();
    }
    // IActivitiesMenuModel implementation
    ActivitiesMenuModel.prototype.GetActivities = function () {
        var activities = [];
        if (this.player.HasItem(4 /* Community */))
            activities.push(2 /* Community */);
        if (this.player.HasItem(5 /* Monopoly */))
            activities.push(3 /* Monopoly */);
        activities.push(1 /* Stop */);
        return activities;
    };
    ActivitiesMenuModel.prototype.HasActivities = function () {
        if (this.player.HasItem(4 /* Community */))
            return true;
        if (this.player.HasItem(5 /* Monopoly */))
            return true;
        return false;
    };
    ActivitiesMenuModel.prototype.IsVisible = function () {
        return this.isVisible;
    };
    ActivitiesMenuModel.prototype.SetVisibility = function (visibility) {
        this.isVisible = visibility;
        this.VisibilityChanged.Call();
    };
    // IPersistent implementation
    ActivitiesMenuModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.isVisible = state.isVisible;
    };
    ActivitiesMenuModel.prototype.ToPersistentString = function () {
        var state = { isVisible: this.isVisible };
        return JSON.stringify(state);
    };
    return ActivitiesMenuModel;
})();
/// <reference path="IPersistent.ts" />
var Flags = (function () {
    function Flags() {
        this.flags = [];
        this.checks = {};
        this.controls = {};
    }
    // public interface
    Flags.prototype.Clear = function (flag) {
        var i = this.flags.indexOf(flag);
        if (i >= 0)
            this.flags.splice(i, 1);
    };
    Flags.prototype.IsSet = function (flag) {
        var Check = this.checks[flag];
        if (Check)
            return Check();
        return this.flags.indexOf(flag) >= 0;
    };
    Flags.prototype.Set = function (flag) {
        var Control = this.controls[flag];
        if (Control)
            Control();
        else if (this.flags.indexOf(flag) < 0)
            this.flags.push(flag);
    };
    Flags.prototype.SetCheck = function (flag, Check) {
        this.checks[flag] = Check;
    };
    Flags.prototype.SetControl = function (flag, Control) {
        this.controls[flag] = Control;
    };
    // IPersistent implementation
    Flags.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.flags = state.flags;
    };
    Flags.prototype.ToPersistentString = function () {
        var state = { flags: this.flags };
        return JSON.stringify(state);
    };
    return Flags;
})();
var Util;
(function (Util) {
    function AlignUnderneath(anchor, element) {
        var p = anchor.position();
        var h = anchor.outerHeight(false);
        var x = p.left;
        var y = p.top + h;
        element.css({ left: x + "px", top: y + "px" });
    }
    Util.AlignUnderneath = AlignUnderneath;
    function Random(n) {
        return Math.floor(Math.random() * n);
    }
    Util.Random = Random;
})(Util || (Util = {}));
Array.prototype.find = function (f) {
    for (var i = 0; i != this.length; ++i) {
        if (f(this[i]))
            return this[i];
    }
};
Array.prototype.sample = function () {
    if (this.length > 0)
        return this[Math.floor(Math.random() * this.length)];
};
/// <reference path="ICharacter.ts" />
/// <reference path="Flags.ts"      />
/// <reference path="Util.ts"       />
var DialogType;
(function (DialogType) {
    DialogType[DialogType["QueueEscape"] = 0] = "QueueEscape";
    DialogType[DialogType["QueueConversation"] = 1] = "QueueConversation";
    DialogType[DialogType["HomeArrival"] = 2] = "HomeArrival";
    DialogType[DialogType["HomeConversation"] = 3] = "HomeConversation";
})(DialogType || (DialogType = {}));
var CharacterManager = (function () {
    // public interface
    function CharacterManager(characters, flags) {
        this.characters = characters;
        this.flags = flags;
        this.map = {};
        for (var i = 0; i != characters.length; ++i) {
            this.map[characters[i].id] = characters[i];
        }
    }
    CharacterManager.prototype.GetAllCharacters = function () {
        return this.characters;
    };
    CharacterManager.prototype.GetCharacter = function (id) {
        if (id)
            return this.map[id];
        return null;
    };
    CharacterManager.prototype.GetDialogID = function (characterID, dialogType) {
        var conversations;
        var defaultID;
        var character = this.map[characterID];
        switch (dialogType) {
            case 0 /* QueueEscape */:
                conversations = character.queueEscape;
                defaultID = "StdQueueEscape";
                break;
            case 1 /* QueueConversation */:
                conversations = character.queueConversation;
                defaultID = "StdQueueConversation";
                break;
            case 2 /* HomeArrival */:
                conversations = character.homeArrival;
                defaultID = "StdHomeArrival";
                break;
            case 3 /* HomeConversation */:
                conversations = character.homeConversation;
                defaultID = "StdHomeConversation";
                break;
        }
        if (conversations) {
            var conversation = this.ChooseConversation(conversations);
            if (conversation)
                return conversation.dialog;
        }
        return defaultID;
    };
    CharacterManager.prototype.GetRandomCharacter = function () {
        return this.characters.sample();
    };
    // private implementation
    CharacterManager.prototype.ChooseConversation = function (conversations) {
        for (var i = 0; i != conversations.length; ++i) {
            var c = conversations[i];
            if (!c.requires || c.requires.every(this.flags.IsSet.bind(this.flags)))
                return c;
        }
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
/// <reference path="Flags.ts"   />
/// <reference path="IDialog.ts" />
var DialogManager = (function () {
    function DialogManager(dialogs, flags) {
        this.dialogs = dialogs;
        this.flags = flags;
        this.map = {};
        for (var i = 0; i != dialogs.length; ++i)
            this.map[dialogs[i].id] = dialogs[i];
    }
    DialogManager.prototype.ActivateDialog = function (dialogID) {
        if (!dialogID)
            return;
        var dialog = this.map[dialogID];
        if (dialog.sets) {
            for (var i = 0; i != dialog.sets.length; ++i)
                this.flags.Set(dialog.sets[i]);
        }
        if (dialog.clears) {
            for (var i = 0; i != dialog.clears.length; ++i)
                this.flags.Clear(dialog.clears[i]);
        }
    };
    DialogManager.prototype.GetDialog = function (dialogID) {
        var IsActive = function (reply) {
            if (reply.requires)
                return reply.requires.every(this.flags.IsSet.bind(this.flags));
            return true;
        };
        if (!dialogID)
            return null;
        var dialog = this.map[dialogID];
        if (dialog.replies.some(function (r) {
            return r.requires != null;
        })) {
            return { id: dialog.id, text: dialog.text, replies: dialog.replies.filter(IsActive.bind(this)) };
        }
        return dialog;
    };
    return DialogManager;
})();
var Hat;
(function (Hat) {
    Hat[Hat["None"] = 0] = "None";
    Hat[Hat["Tophat"] = 1] = "Tophat";
})(Hat || (Hat = {}));
/// <reference path="ICharacter.ts" />
var HomeItemInfo = (function () {
    function HomeItemInfo() {
    }
    return HomeItemInfo;
})();
var HomeItem;
(function (HomeItem) {
    HomeItem[HomeItem["TV"] = 0] = "TV";
    HomeItem[HomeItem["Table"] = 1] = "Table";
})(HomeItem || (HomeItem = {}));
var HomeItem;
(function (HomeItem) {
    var info = [
        { graphic: ["  _________  ", "═════════════", "             ", "             ", "             ", "             ", "%   %   %   %"], x: 32, y: 0 },
        { graphic: ["         %         ", "   ┌───────────┐   ", "   │  ╔═════╗  │   ", " % │  ║     ║  │ % ", "   │  ╚═════╝  │   ", "   └───────────┘   ", "         %         "], x: 29, y: 12 }
    ];
    function GetInfo(item) {
        return info[item];
    }
    HomeItem.GetInfo = GetInfo;
})(HomeItem || (HomeItem = {}));
/// <reference path="Activity.ts"   />
/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />
/// <reference path="HomeItem.ts"    />
/// <reference path="IHomeModel.ts"  />
/// <reference path="IPersistent.ts" />
/// <reference path="Player.ts"      />
/// <reference path="Util.ts"        />
var HomeModel = (function () {
    function HomeModel(timer, characterManager, dialogManager, player) {
        this.timer = timer;
        this.characterManager = characterManager;
        this.dialogManager = dialogManager;
        this.player = player;
        this.waitingGuests = [];
        this.guests = [];
        this.targets = [];
        this.positions = [];
        this.atEntrance = false;
        this.activity = 0 /* None */;
        this.nx = 78;
        this.ny = 23;
        this.speed = 3;
        // IHomeModel implementation
        this.DialogChanged = new Signal();
        this.GuestsChanged = new Signal();
        this.StateChanged = new Signal();
        timer.AddEvent(this.OnAnimate.bind(this), 2);
        timer.AddEvent(this.OnKnock.bind(this), 25);
        this.canvas = [];
        for (var y = 0; y != this.ny; ++y)
            this.canvas.push(new Array(this.nx));
    }
    HomeModel.prototype.AdvanceDialog = function (ref) {
        this.dialogID = ref;
        if (!this.dialogID)
            this.speakerID = null;
        this.DialogChanged.Call();
    };
    HomeModel.prototype.AreGuestsArriving = function () {
        return this.waitingGuests.length > 0;
    };
    HomeModel.prototype.AreGuestsIn = function () {
        return this.guests.length > 0;
    };
    HomeModel.prototype.GetActivity = function () {
        return this.activity;
    };
    HomeModel.prototype.GetCanvas = function () {
        this.Clear();
        var items = this.GetHomeItems();
        for (var i = 0; i != items.length; ++i)
            this.RenderItem(items[i]);
        var characters = [];
        for (var i = 0; i != this.guests.length; ++i) {
            var guest = this.guests[i];
            var x = Math.round(guest.x);
            var y = Math.round(guest.y);
            this.RenderGuest(i);
            var isPlayer = guest.id == null;
            var isAtEntrance = isAtEntrance && i == this.guests.length - 1;
            var character = { character: this.characterManager.GetCharacter(guest.id), isClickable: !isPlayer && !isAtEntrance };
            characters.push(character);
        }
        return { rows: this.MergeLines(this.canvas), characters: characters };
    };
    HomeModel.prototype.GetDialog = function () {
        return this.dialogManager.GetDialog(this.dialogID);
    };
    HomeModel.prototype.GetSpeaker = function () {
        return this.characterManager.GetCharacter(this.speakerID);
    };
    HomeModel.prototype.InviteGuests = function (guests) {
        for (var i = 0; i != guests.length; ++i)
            this.waitingGuests.push(guests[i].id);
        var player = { id: null, x: this.positions[0].x, y: this.positions[0].y };
        this.guests = [player];
        this.positions.shift();
        this.GuestsChanged.Call();
        this.StateChanged.Call();
    };
    HomeModel.prototype.IsGuestAtTheDoor = function () {
        return this.atEntrance;
    };
    HomeModel.prototype.LetTheGuestIn = function () {
        this.atEntrance = null;
        var target = { id: this.guests[this.guests.length - 1].id, x: this.positions[0].x, y: this.positions[0].y };
        this.targets.push(target);
        this.positions.shift();
        this.GuestsChanged.Call();
        if (this.waitingGuests.length == 0)
            this.StateChanged.Call();
    };
    HomeModel.prototype.SetActivity = function (activity) {
        switch (activity) {
            case 1 /* Stop */:
                this.guests = [];
                this.activity = 0 /* None */;
                this.GuestsChanged.Call();
                this.StateChanged.Call();
                break;
            default:
                this.activity = activity;
                this.UpdateActiveItem();
                this.targets = [];
                for (var i = 0; i != this.guests.length; ++i) {
                    var target = { id: this.guests[i].id, x: this.positions[i].x, y: this.positions[i].y };
                    this.targets.push(target);
                }
        }
    };
    HomeModel.prototype.StartDialog = function (speaker) {
        this.speakerID = speaker.id;
        this.dialogID = this.characterManager.GetDialogID(speaker.id, 3 /* HomeConversation */);
        this.DialogChanged.Call();
    };
    // event handlers
    HomeModel.prototype.OnAnimate = function () {
        if (this.targets.length == 0)
            return;
        for (var i = 0; i != this.targets.length; ++i) {
            var t = this.targets[i];
            var g = this.guests.find(function (g) {
                return g.id == t.id;
            });
            var dx = t.x - g.x;
            var dy = t.y - g.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d > this.speed) {
                // move towards destnation
                g.x += dx * this.speed / d;
                g.y += dy * this.speed / d;
            }
            else {
                // arrive at destination
                g.x = t.x;
                g.y = t.y;
                this.targets.splice(i, 1);
                --i;
            }
        }
        this.GuestsChanged.Call();
    };
    HomeModel.prototype.OnKnock = function () {
        if (this.atEntrance)
            return;
        if (this.waitingGuests.length == 0)
            return;
        if (Math.random() < 0.5)
            return;
        var i = Util.Random(this.waitingGuests.length);
        var id = this.waitingGuests[i];
        this.waitingGuests.splice(i, 1);
        this.guests.push({ id: id, x: 2, y: 12 });
        this.atEntrance = true;
        this.GuestsChanged.Call();
        this.speakerID = id;
        this.dialogID = this.characterManager.GetDialogID(id, 2 /* HomeArrival */);
        this.DialogChanged.Call();
    };
    // IPersistent implementation
    HomeModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.waitingGuests = state.waitingGuests;
        this.guests = state.guests;
        this.targets = state.targets;
        this.positions = state.positions;
        this.atEntrance = state.atEntrance;
        this.activity = state.activity;
        this.dialogID = state.dialogID;
        this.speakerID = state.speakerID;
    };
    HomeModel.prototype.ToPersistentString = function () {
        var state = { waitingGuests: this.waitingGuests, guests: this.guests, targets: this.targets, positions: this.positions, atEntrance: this.atEntrance, activity: this.activity, dialogID: this.dialogID, speakerID: this.speakerID };
        return JSON.stringify(state);
    };
    // private implementation
    HomeModel.prototype.Clear = function () {
        for (var y = 0; y != this.ny; ++y) {
            var line = this.canvas[y];
            for (var x = 0; x != this.nx; ++x)
                line[x] = " ";
        }
    };
    HomeModel.prototype.GetHomeItems = function () {
        var items = [];
        if (this.player.HasItem(2 /* TV */))
            items.push(0 /* TV */);
        if (this.player.HasItem(3 /* Table */))
            items.push(1 /* Table */);
        return items;
    };
    HomeModel.prototype.IsDigit = function (n) {
        return [true, true, true, true][n];
    };
    HomeModel.prototype.MergeLines = function (canvas) {
        var result = Array(canvas.length);
        for (var y = 0; y != canvas.length; ++y)
            result[y] = canvas[y].join("");
        return result;
    };
    HomeModel.prototype.RenderGuest = function (i) {
        var guest = this.guests[i];
        var x = Math.round(guest.x);
        var y = Math.round(guest.y);
        // check that we don't overlap another guest
        var row = this.canvas[y];
        if (this.IsDigit(row[x - 1]) || this.IsDigit(row[x]) || this.IsDigit(row[x + 1]))
            return;
        row[x - 1] = row[x] = row[x + 1] = String(i);
    };
    HomeModel.prototype.RenderItem = function (item) {
        var info = HomeItem.GetInfo(item);
        var gfx = info.graphic;
        for (var y = 0; y != gfx.length; ++y) {
            var src = gfx[y];
            var dst = this.canvas[info.y + y];
            for (var x = 0; x != src.length; ++x) {
                var c = src[x];
                dst[info.x + x] = (c === "%") ? ' ' : c;
            }
        }
    };
    HomeModel.prototype.UpdateActiveItem = function () {
        var item = null;
        switch (this.activity) {
            case 2 /* Community */:
                item = 0 /* TV */;
                break;
            case 3 /* Monopoly */:
                item = 1 /* Table */;
                break;
        }
        // get the free positions for this activity
        this.positions = [];
        if (item == null)
            return;
        var info = HomeItem.GetInfo(item);
        var gfx = info.graphic;
        for (var y = 0; y != gfx.length; ++y) {
            var line = gfx[y];
            for (var x = 0; x != line.length; ++x) {
                if (line[x] == "%")
                    this.positions.push({ x: info.x + x, y: info.y + y });
            }
        }
    };
    return HomeModel;
})();
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />
/// <reference path="Activity.ts"   />
/// <reference path="HomeCanvas.ts" />
/// <reference path="ICharacter.ts" />
/// <reference path="Signal.ts"     />
/// <reference path="Hat.ts"       />
/// <reference path="Moustache.ts" />
/// <reference path="Signal.ts"    />
/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />
/// <reference path="IActivitiesMenuModel.ts" />
/// <reference path="IInvitesMenuModel.ts"    />
/// <reference path="IHomeModel.ts"           />
/// <reference path="IHomeView.ts"            />
/// <reference path="IMainModel.ts"           />
/// <reference path="IQueueModel.ts"          />
var HomePresenter = (function () {
    function HomePresenter(homeModel, activitiesModel, invitesModel, mainModel, queueModel, homeView) {
        this.homeModel = homeModel;
        this.activitiesModel = activitiesModel;
        this.invitesModel = invitesModel;
        this.mainModel = mainModel;
        this.queueModel = queueModel;
        this.homeView = homeView;
        homeModel.DialogChanged.Add(this.OnDialogChanged.bind(this));
        homeModel.GuestsChanged.Add(this.OnGuestsChanged.bind(this));
        homeModel.StateChanged.Add(this.OnStateChanged.bind(this));
        activitiesModel.VisibilityChanged.Add(this.OnActivitiesMenuVisibilityChanged.bind(this));
        invitesModel.EmptiedStateChanged.Add(this.OnInvitesMenuEmptiedStateChanged.bind(this));
        invitesModel.EnabledStateChanged.Add(this.OnInvitesMenuEnabledStateChanged.bind(this));
        invitesModel.SelectionChanged.Add(this.OnInvitesMenuSelectionChanged.bind(this));
        invitesModel.VisibilityChanged.Add(this.OnInvitesMenuVisibilityChanged.bind(this));
        homeView.ActivitiesClicked.Add(this.OnActivitiesClicked.bind(this));
        homeView.ActivityClicked.Add(this.OnActivityClicked.bind(this));
        homeView.GoToQueue.Add(this.OnGoToQueue.bind(this));
        homeView.GoToStore.Add(this.OnGoToStore.bind(this));
        homeView.GuestClicked.Add(this.OnGuestClicked.bind(this));
        homeView.InvitesButtonClicked.Add(this.OnInvitesButtonClicked.bind(this));
        homeView.InviteClicked.Add(this.OnInviteClicked.bind(this));
        homeView.InvitesClicked.Add(this.OnInvitesClicked.bind(this));
        homeView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
        homeView.Shown.Add(this.OnShown.bind(this));
    }
    HomePresenter.prototype.OnActivityClicked = function () {
        this.homeModel.SetActivity(this.homeView.GetSelectedActivity());
        this.activitiesModel.SetVisibility(false);
    };
    HomePresenter.prototype.OnActivitiesClicked = function () {
        this.activitiesModel.SetVisibility(!this.activitiesModel.IsVisible());
    };
    HomePresenter.prototype.OnActivitiesMenuVisibilityChanged = function () {
        this.UpdateActivitiesMenuVisibility();
    };
    HomePresenter.prototype.OnDialogChanged = function () {
        var speaker = this.homeModel.GetSpeaker();
        var dialog = this.homeModel.GetDialog();
        this.homeView.SetDialog(speaker, dialog);
        if (!dialog && this.homeModel.IsGuestAtTheDoor())
            this.homeModel.LetTheGuestIn();
    };
    HomePresenter.prototype.OnInvitesClicked = function () {
        this.invitesModel.SetVisibility(!this.invitesModel.IsVisible());
    };
    HomePresenter.prototype.OnInviteClicked = function () {
        this.invitesModel.ToggleSelection(this.homeView.GetSelectedInvite());
    };
    HomePresenter.prototype.OnInvitesButtonClicked = function () {
        this.invitesModel.SetVisibility(false);
        this.homeView.HideInvitesMenu();
        this.homeModel.SetActivity(this.activitiesModel.GetActivities()[0]);
        this.homeModel.InviteGuests(this.invitesModel.GetSelectedFriends());
        this.invitesModel.Reset();
    };
    HomePresenter.prototype.OnInvitesMenuEmptiedStateChanged = function () {
        this.homeView.SetInviteStatus(!this.invitesModel.IsEmpty());
    };
    HomePresenter.prototype.OnInvitesMenuEnabledStateChanged = function () {
        this.UpdateInvitesMenuEnabledState();
    };
    HomePresenter.prototype.OnInvitesMenuSelectionChanged = function () {
        var selection = this.invitesModel.GetSelection();
        var isSelected = this.invitesModel.IsSelected(selection);
        this.homeView.SetInviteState(selection, isSelected);
    };
    HomePresenter.prototype.OnInvitesMenuVisibilityChanged = function () {
        this.UpdateInvitesMenuVisibility();
    };
    HomePresenter.prototype.OnInvitesMenuChanged = function () {
        this.homeView.ShowInvitesMenu(this.invitesModel.GetFriends());
    };
    HomePresenter.prototype.OnGuestClicked = function () {
        this.homeModel.StartDialog(this.homeView.GetSelectedGuest());
    };
    HomePresenter.prototype.OnGoToQueue = function () {
        this.queueModel.EnterQueue();
        this.mainModel.SetView(1 /* Queue */);
    };
    HomePresenter.prototype.OnGoToStore = function () {
        this.mainModel.SetView(2 /* Store */);
    };
    HomePresenter.prototype.OnGuestsChanged = function () {
        this.homeView.SetCanvas(this.homeModel.GetCanvas());
    };
    HomePresenter.prototype.OnReplyClicked = function () {
        this.homeModel.AdvanceDialog(this.homeView.GetSelectedReply());
    };
    HomePresenter.prototype.OnShown = function () {
        this.homeView.SetCanvas(this.homeModel.GetCanvas());
        this.homeView.SetDialog(this.homeModel.GetSpeaker(), this.homeModel.GetDialog());
        this.UpdateButtonStates();
        this.UpdateActivitiesMenuVisibility();
        this.UpdateInvitesMenuVisibility();
    };
    HomePresenter.prototype.OnStateChanged = function () {
        this.UpdateButtonStates();
    };
    // private implementation
    HomePresenter.prototype.UpdateActivitiesMenuVisibility = function () {
        if (this.activitiesModel.IsVisible()) {
            this.homeView.ShowActivitiesMenu(this.activitiesModel.GetActivities());
            this.homeView.SelectActivity(this.homeModel.GetActivity());
        }
        else {
            this.homeView.HideActivitiesMenu();
        }
    };
    HomePresenter.prototype.UpdateInvitesMenuVisibility = function () {
        if (!this.invitesModel.IsVisible()) {
            this.homeView.HideInvitesMenu();
            return;
        }
        this.homeView.ShowInvitesMenu(this.invitesModel.GetFriends());
        this.homeView.SetInviteStatus(!this.invitesModel.IsEmpty());
        var selected = this.invitesModel.GetSelectedFriends();
        for (var i = 0; i != selected.length; ++i)
            this.homeView.SetInviteState(selected[i], true);
        this.UpdateInvitesMenuEnabledState();
    };
    HomePresenter.prototype.UpdateInvitesMenuEnabledState = function () {
        if (this.invitesModel.IsEnabled())
            this.homeView.EnableAllFriends();
        else
            this.homeView.DisableUnselectedFriends();
    };
    HomePresenter.prototype.UpdateButtonStates = function () {
        if (this.homeModel.AreGuestsArriving()) {
            this.homeView.HideInvitesButton();
            this.homeView.HideTravelButtons();
            this.homeView.HideActivitiesButton();
        }
        else if (this.homeModel.AreGuestsIn()) {
            this.homeView.HideInvitesButton();
            this.homeView.HideTravelButtons();
            this.homeView.ShowActivitiesButton();
        }
        else {
            if (this.invitesModel.HasInvites() && this.activitiesModel.HasActivities())
                this.homeView.ShowInvitesButton();
            else
                this.homeView.HideInvitesButton();
            this.homeView.ShowTravelButtons();
            this.homeView.HideActivitiesButton();
        }
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
/// <reference path="IHomeView.ts"   />
/// <reference path="IClientView.ts" />
/// <reference path="Util.ts"        />
var HomeView = (function () {
    function HomeView() {
        // IHomeView implementation
        this.ActivityClicked = new Signal();
        this.ActivitiesClicked = new Signal();
        this.InviteClicked = new Signal();
        this.GoToQueue = new Signal();
        this.GoToStore = new Signal();
        this.GuestClicked = new Signal();
        this.InvitesButtonClicked = new Signal();
        this.InvitesClicked = new Signal();
        this.ReplyClicked = new Signal();
        this.Shown = new Signal();
    }
    HomeView.prototype.DisableUnselectedFriends = function () {
        var labels = $("#home-invites label");
        for (var i = 0; i != labels.length; ++i) {
            var label = $(labels[i]);
            if (!label.hasClass("checked")) {
                label.addClass("disabled");
                label.removeClass("fg-clickable");
            }
        }
    };
    HomeView.prototype.EnableAllFriends = function () {
        var labels = $("#home-invites label");
        for (var i = 0; i != labels.length; ++i) {
            var label = $(labels[i]);
            label.removeClass("disabled");
            label.addClass("fg-clickable");
        }
    };
    HomeView.prototype.GetInvitesVisibility = function () {
        return $("#home-invites").is(":visible");
    };
    HomeView.prototype.GetSelectedActivity = function () {
        return this.selectedActivity;
    };
    HomeView.prototype.GetSelectedInvite = function () {
        return this.selectedInvite;
    };
    HomeView.prototype.GetSelectedGuest = function () {
        return this.selectedGuest;
    };
    HomeView.prototype.GetSelectedReply = function () {
        return this.selectedReply;
    };
    HomeView.prototype.HideActivitiesButton = function () {
        $("#toggle-activities").hide();
    };
    HomeView.prototype.HideActivitiesMenu = function () {
        $("#home-activities").hide();
    };
    HomeView.prototype.HideInvitesMenu = function () {
        $("#home-invites").hide();
    };
    HomeView.prototype.HideInvitesButton = function () {
        $("#toggle-invites").hide();
    };
    HomeView.prototype.HideTravelButtons = function () {
        $("#go-queue").hide();
        $("#go-store").hide();
    };
    HomeView.prototype.SelectActivity = function (a) {
        $("#home-activities label").removeClass("checked");
        $("#home-activities label.a" + a).addClass("checked");
    };
    HomeView.prototype.SetCanvas = function (canvas) {
        var OnClickCharacter = function (e) {
            this.selectedGuest = e.data;
            this.GuestClicked.Call();
        };
        var view = $("#home-view");
        var html = canvas.rows.join("<br>");
        for (var i = 0; i != canvas.characters.length; ++i) {
            var c = canvas.characters[i];
            var replacement = c.character ? "<span id='character-" + c.character.id + "'>\\o/</span>" : "<span class='player'>\\o/</span>";
            var n = String(i);
            html = html.replace(n + n + n, replacement);
        }
        view.html(html);
        for (var i = 0; i != canvas.characters.length; ++i) {
            var c = canvas.characters[i];
            if (c.character && c.isClickable) {
                var span = $("#character-" + c.character.id);
                span.addClass("character");
                span.click(c.character, OnClickCharacter.bind(this));
                var name = $("<span>");
                name.attr("id", "character-name-" + c.character.id);
                name.addClass("character-name");
                name.addClass("base-font");
                name.text(c.character.name);
                span.append(name);
            }
        }
    };
    HomeView.prototype.SetDialog = function (speaker, dialog) {
        var OnClick = function (e) {
            this.selectedReply = e.data;
            this.ReplyClicked.Call();
        };
        var speakerElement = $("#home-dialog .dialog-speaker");
        var textElement = $("#home-dialog .dialog-text");
        var repliesElement = $("#home-dialog .dialog-replies");
        if (!dialog) {
            $("#home-dialog").hide();
            return;
        }
        speakerElement.text(speaker.name);
        textElement.html(dialog.text);
        repliesElement.empty();
        for (var i = 0; i != dialog.replies.length; ++i) {
            var reply = dialog.replies[i];
            var li = $("<li class='fg-clickable'>");
            li.html(reply.text);
            li.click(reply.ref, OnClick.bind(this));
            repliesElement.append(li);
        }
        $("#home-dialog").show();
    };
    HomeView.prototype.SetInviteStatus = function (enabled) {
        $("#invite").prop("disabled", !enabled);
    };
    HomeView.prototype.SetInviteState = function (character, checked) {
        var label = $("#home-invites ." + character.id);
        if (checked)
            label.addClass("checked");
        else
            label.removeClass("checked");
    };
    HomeView.prototype.ShowActivitiesButton = function () {
        $("#toggle-activities").show();
    };
    HomeView.prototype.ShowActivitiesMenu = function (activities) {
        var OnClick = function (e) {
            this.selectedActivity = e.data;
            this.ActivityClicked.Call();
        };
        var menu = $("#home-activities");
        menu.empty();
        for (var i = 0; i != activities.length; ++i) {
            var a = activities[i];
            var label = $("<label>");
            label.text(Activity.GetName(a));
            label.addClass("fg-clickable");
            label.addClass("a" + a);
            label.click(a, OnClick.bind(this));
            menu.append(label);
        }
        Util.AlignUnderneath($("#toggle-activities"), menu);
        menu.show();
    };
    HomeView.prototype.ShowInvitesButton = function () {
        $("#toggle-invites").show();
    };
    HomeView.prototype.ShowInvitesMenu = function (characters) {
        var _this = this;
        var OnClick = function (e) {
            this.selectedInvite = e.data;
            this.InviteClicked.Call();
        };
        var menu = $("#home-invites");
        menu.empty();
        for (var i = 0; i != characters.length; ++i) {
            var c = characters[i];
            var label = $("<label>");
            label.text(c.name);
            label.addClass("fg-clickable");
            label.addClass(c.id);
            label.click(c, OnClick.bind(this));
            menu.append(label);
        }
        var button = $("<button id='invite'>пригласить в гости</button>");
        button.click(function () {
            _this.InvitesButtonClicked.Call();
        });
        menu.append(button);
        Util.AlignUnderneath($("#toggle-invites"), menu);
        menu.show();
    };
    HomeView.prototype.ShowTravelButtons = function () {
        $("#go-queue").show();
        $("#go-store").show();
    };
    // IClientView implementation
    HomeView.prototype.GetType = function () {
        return 0 /* Home */;
    };
    HomeView.prototype.Hide = function () {
    };
    HomeView.prototype.Show = function (e) {
        var _this = this;
        e.html("<div id='home-dialog' class='dialog fg-color'><div class='dialog-speaker'></div><p class='dialog-text'></p><ol class='dialog-replies'></ol></div><div id='home-view'></div>");
        $("#home-dialog").hide();
        var goQueue = $("<button id='go-queue'>");
        goQueue.text("в очередь");
        goQueue.hide();
        goQueue.click(function () {
            _this.GoToQueue.Call();
        });
        var goStore = $("<button id='go-store'>");
        goStore.text("в магазин");
        goStore.hide();
        goStore.click(function () {
            _this.GoToStore.Call();
        });
        var toggleInvites = $("<button id='toggle-invites'>");
        toggleInvites.text("друзья…");
        toggleInvites.click(function () {
            _this.InvitesClicked.Call();
        });
        var toggleActivities = $("<button id='toggle-activities'>");
        toggleActivities.text("занятия…");
        toggleActivities.click(function () {
            _this.ActivitiesClicked.Call();
        });
        var activities = $("<div id='home-activities' class='menu fg-color'>");
        activities.hide();
        var invites = $("<div id='home-invites' class='menu fg-color'>");
        invites.hide();
        $("#buttons").append(goQueue).append(goStore).append(toggleInvites).append(toggleActivities).append(activities).append(invites);
        this.Shown.Call();
    };
    return HomeView;
})();
/// <reference path="Hat.ts"         />
/// <reference path="Moustache.ts"   />
/// <reference path="IClientView.ts" />
/// <reference path="IInvitesMenuModel.ts" />
/// <reference path="IPersistent.ts"       />
var InvitesMenuModel = (function () {
    function InvitesMenuModel(characterManager, player) {
        this.characterManager = characterManager;
        this.player = player;
        this.isVisible = false;
        this.selected = [];
        this.maxFriends = 3; // has to be single-digit
        this.EmptiedStateChanged = new Signal();
        this.EnabledStateChanged = new Signal();
        this.SelectionChanged = new Signal();
        this.VisibilityChanged = new Signal();
    }
    // IInvitesMenuModel implementation
    InvitesMenuModel.prototype.GetFriends = function () {
        var _this = this;
        return this.player.GetFriendIDs().map(function (id) {
            return _this.characterManager.GetCharacter(id);
        });
    };
    InvitesMenuModel.prototype.GetSelectedFriends = function () {
        var _this = this;
        return this.selected.map(function (id) {
            return _this.characterManager.GetCharacter(id);
        });
    };
    InvitesMenuModel.prototype.GetSelection = function () {
        return this.selection;
    };
    InvitesMenuModel.prototype.HasInvites = function () {
        return this.player.GetFriendIDs().length > 0;
    };
    InvitesMenuModel.prototype.IsEmpty = function () {
        return this.selected.length == 0;
    };
    InvitesMenuModel.prototype.IsEnabled = function () {
        return this.selected.length < this.maxFriends;
    };
    InvitesMenuModel.prototype.IsSelected = function (character) {
        return this.selected.indexOf(character.id) >= 0;
    };
    InvitesMenuModel.prototype.IsVisible = function () {
        return this.isVisible;
    };
    InvitesMenuModel.prototype.Reset = function () {
        this.selected = [];
    };
    InvitesMenuModel.prototype.ToggleSelection = function (character) {
        var i = this.selected.indexOf(character.id);
        if (i < 0) {
            if (this.selected.length < this.maxFriends) {
                this.selection = character;
                this.selected.push(character.id);
                this.SelectionChanged.Call();
                if (this.selected.length == this.maxFriends)
                    this.EnabledStateChanged.Call();
                if (this.selected.length == 1)
                    this.EmptiedStateChanged.Call();
            }
        }
        else {
            this.selection = this.characterManager.GetCharacter(this.selected[i]);
            this.selected.splice(i, 1);
            this.SelectionChanged.Call();
            if (this.selected.length == this.maxFriends - 1)
                this.EnabledStateChanged.Call();
            if (this.selected.length == 0)
                this.EmptiedStateChanged.Call();
        }
    };
    InvitesMenuModel.prototype.SetVisibility = function (visibility) {
        this.isVisible = visibility;
        ;
        this.VisibilityChanged.Call();
    };
    // IPersistent implementation
    InvitesMenuModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.isVisible = state.isVisible;
        this.selected = state.selected;
    };
    InvitesMenuModel.prototype.ToPersistentString = function () {
        var state = { isVisible: this.isVisible, selected: this.selected };
        return JSON.stringify(state);
    };
    return InvitesMenuModel;
})();
/// <reference path="ICharacter.ts" />
/// <reference path="IDialog.ts"    />
/// <reference path="Signal.ts" />
/// <reference path="Item.ts"   />
/// <reference path="Signal.ts" />
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
        this.HatChanged = new Signal();
        this.MoneyChanged = new Signal();
        this.MoustacheChanged = new Signal();
        this.ViewChanged = new Signal();
        player.HatChanged.Add(this.OnHatChanged.bind(this));
        player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
        player.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
    }
    MainModel.prototype.GetHat = function () {
        return this.player.GetHat();
    };
    MainModel.prototype.GetMoney = function () {
        var money = Math.floor(this.player.GetMoney());
        var rate = Math.round(this.player.GetRate() * 10) / 10;
        return money.toLocaleString() + " руб. (" + rate.toLocaleString() + " руб./с)";
    };
    MainModel.prototype.GetMoustache = function () {
        return this.player.GetMoustache();
    };
    MainModel.prototype.GetView = function () {
        return this.view;
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
    MainModel.prototype.OnHatChanged = function () {
        this.HatChanged.Call();
    };
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
        mainModel.HatChanged.Add(this.OnHatChanged.bind(this));
        mainModel.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
        mainModel.MoustacheChanged.Add(this.OnMoustacheChanged.bind(this));
        mainModel.ViewChanged.Add(this.OnViewChanged.bind(this));
        mainView.ResetRequested.Add(this.OnResetRequested.bind(this));
    }
    MainPresenter.prototype.LightsCameraAction = function () {
        this.mainView.SetHat(this.mainModel.GetHat());
        this.mainView.SetMoney(this.mainModel.GetMoney());
        this.mainView.SetMoustache(this.mainModel.GetMoustache());
        this.mainView.SetClientView(this.mainModel.GetView());
    };
    MainPresenter.prototype.OnHatChanged = function () {
        this.mainView.SetHat(this.mainModel.GetHat());
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
        $("#reset-game").click(function () {
            _this.ResetRequested.Call();
        });
        $("#about").click(function () {
            $("#about-menu").toggle();
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
        $("#buttons").empty();
        var loc = $("#location");
        loc.empty();
        newActiveView.Show(loc);
        this.activeView = newActiveView;
    };
    MainView.prototype.SetMoney = function (money) {
        $("#money-total").text(money);
    };
    MainView.prototype.SetHat = function (hat) {
        var src;
        switch (hat) {
            case 1 /* Tophat */:
                src = "svg/tophat.svg";
                break;
        }
        var e = $("#hat");
        if (src) {
            e.attr("src", src);
            e.show();
        }
        else {
            e.hide();
        }
    };
    MainView.prototype.SetMoustache = function (moustache) {
        var text;
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
        var e = $("#moustache");
        if (text) {
            e.text(text);
            e.show();
        }
        else {
            e.hide();
        }
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
    // event handlers
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
        this.version = "13";
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
/// <reference path="CharacterManager.ts" />
/// <reference path="DialogManager.ts"    />
/// <reference path="IQueueModel.ts"      />
/// <reference path="IPersistent.ts"      />
/// <reference path="Util.ts"             />
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
    function QueueModel(timer, characterManager, dialogManager, player) {
        this.timer = timer;
        this.characterManager = characterManager;
        this.dialogManager = dialogManager;
        this.player = player;
        this.maxLength = 6;
        // IQueueModel implementation
        this.CurrentTicketChanged = new Signal();
        this.DialogChanged = new Signal();
        this.PeopleChanged = new Signal();
        this.PlayerTicketChanged = new Signal();
        timer.AddEvent(this.OnAdvance.bind(this), 40);
        timer.AddEvent(this.OnKnock.bind(this), 37);
        player.Awkward.Add(this.OnAwkward.bind(this));
        this.ticket = 1;
        this.queue = [];
        this.head = this.MakeStockPosition();
        for (var i = 0; i != this.maxLength; ++i)
            this.queue.push(this.MakeStockPosition());
    }
    QueueModel.prototype.Remove = function (character) {
        for (var i = 0; i != this.queue.length; ++i) {
            if (this.queue[i].characterID != character.id)
                continue;
            this.queue.splice(i, 1);
            this.PeopleChanged.Call();
            return;
        }
    };
    QueueModel.prototype.AdvanceDialog = function (ref) {
        if (ref)
            this.player.ResetComposure();
        else
            this.player.ClearComposure();
        var finishedLastMansDialog = !ref && this.queue[0].characterID == this.speakerID;
        var waitingToAdvance = !this.head || this.head.remaining <= 0;
        if (finishedLastMansDialog && waitingToAdvance)
            this.AdvanceQueue();
        this.dialogID = ref;
        if (!ref)
            this.speakerID = null;
        this.DialogChanged.Call();
        this.dialogManager.ActivateDialog(this.dialogID);
    };
    QueueModel.prototype.EndDialog = function () {
        this.dialogID = null;
        this.speakerID = null;
        this.DialogChanged.Call();
    };
    QueueModel.prototype.EnterQueue = function () {
        if (this.queue.every(function (p) {
            return p.characterID != null;
        }))
            this.queue.push(this.MakePlayerPosition());
    };
    QueueModel.prototype.GetCharacters = function () {
        var characters = [];
        for (var i = 0; i != this.queue.length; ++i) {
            var c = this.characterManager.GetCharacter(this.queue[i].characterID);
            if (c && this.player.HasNotMet(c))
                characters.push({ id: c.id, name: "\\o/" });
            else if (!c)
                characters.push(null);
            else
                characters.push(c);
        }
        return characters;
    };
    QueueModel.prototype.GetCurrentTicket = function () {
        if (this.head)
            return this.head.ticket;
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
    QueueModel.prototype.GetSpeaker = function () {
        return this.characterManager.GetCharacter(this.speakerID);
    };
    QueueModel.prototype.StartDialog = function (speaker) {
        this.speakerID = speaker.id;
        this.dialogID = this.characterManager.GetDialogID(speaker.id, 1 /* QueueConversation */);
        this.DialogChanged.Call();
        var hasNotMet = this.player.HasNotMet(speaker);
        this.player.ResetComposure();
        this.player.IntroduceTo(speaker);
        this.dialogManager.ActivateDialog(this.dialogID);
        if (hasNotMet)
            this.PeopleChanged.Call();
    };
    // IPersistent implementation
    QueueModel.prototype.FromPersistentString = function (str) {
        var state = JSON.parse(str);
        this.queue = state.queue;
        this.head = state.head;
        this.ticket = state.ticket;
        this.dialogID = state.dialogID;
        this.speakerID = state.speakerID;
    };
    QueueModel.prototype.ToPersistentString = function () {
        var state = { queue: this.queue, head: this.head, ticket: this.ticket, dialogID: this.dialogID, speakerID: this.speakerID };
        return JSON.stringify(state);
    };
    // event handlers
    QueueModel.prototype.OnAdvance = function () {
        var head = this.head;
        if (head && head.remaining > 0)
            --head.remaining;
        if (!head || head.remaining <= 0) {
            if (this.speakerID && this.queue.length > 0 && this.queue[0].characterID == this.speakerID)
                this.HoldLast();
            else
                this.AdvanceQueue();
        }
    };
    QueueModel.prototype.OnAwkward = function () {
        if (!this.speakerID)
            return;
        this.speakerID = "";
        this.dialogID = "StdPterodactyl";
        this.DialogChanged.Call();
    };
    QueueModel.prototype.OnKnock = function () {
        if (this.queue.length < this.maxLength && Math.random() < 0.4) {
            this.queue.push(this.MakeStockPosition());
            this.PeopleChanged.Call();
        }
    };
    // private implementation
    QueueModel.prototype.AdvanceQueue = function () {
        if (this.queue.length > 0) {
            this.head = this.queue[0];
            this.queue.shift();
            this.CurrentTicketChanged.Call();
            this.PeopleChanged.Call();
            if (!this.head.characterID)
                this.PlayerTicketChanged.Call();
        }
        else {
            this.head = null;
        }
        this.CurrentTicketChanged.Call();
    };
    QueueModel.prototype.GenerateRemaining = function () {
        var min = 4;
        var max = 16;
        return min + Util.Random(max - min);
    };
    QueueModel.prototype.HoldLast = function () {
        var holdDialogID = this.characterManager.GetDialogID(this.speakerID, 0 /* QueueEscape */);
        if (this.dialogID != holdDialogID) {
            this.dialogID = holdDialogID;
            this.DialogChanged.Call();
        }
    };
    QueueModel.prototype.InQueue = function (c) {
        return this.queue.some(function (p) {
            return p.characterID && p.characterID === c.id;
        });
    };
    QueueModel.prototype.MakeStockPosition = function () {
        var character;
        do {
            character = this.characterManager.GetRandomCharacter();
        } while (this.InQueue(character));
        return { characterID: character.id, remaining: this.GenerateRemaining(), ticket: String(this.ticket++) };
    };
    QueueModel.prototype.MakePlayerPosition = function () {
        return { characterID: null, remaining: this.GenerateRemaining(), ticket: String(this.ticket++) };
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
        queueView.Hidden.Add(this.OnHidden.bind(this));
        queueView.PersonClicked.Add(this.OnPersonClicked.bind(this));
        queueView.ReplyClicked.Add(this.OnReplyClicked.bind(this));
        queueView.Shown.Add(this.OnShown.bind(this));
    }
    // event handlers
    QueuePresenter.prototype.OnCurrentTicketChanged = function () {
        this.queueView.SetCurrentTicket(this.queueModel.GetCurrentTicket());
    };
    QueuePresenter.prototype.OnDialogChanged = function () {
        this.queueView.SetDialog(this.queueModel.GetSpeaker(), this.queueModel.GetDialog());
    };
    QueuePresenter.prototype.OnGoToHome = function () {
        this.mainModel.SetView(0 /* Home */);
    };
    QueuePresenter.prototype.OnHidden = function () {
        this.queueModel.EndDialog();
    };
    QueuePresenter.prototype.OnPeopleChanged = function () {
        this.queueView.SetCharacters(this.queueModel.GetCharacters());
    };
    QueuePresenter.prototype.OnPersonClicked = function () {
        this.queueModel.StartDialog(this.queueView.GetSpeaker());
    };
    QueuePresenter.prototype.OnPlayerTicketChanged = function () {
        this.queueView.SetPlayerTicket(this.queueModel.GetPlayerTicket());
    };
    QueuePresenter.prototype.OnShown = function () {
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
        // IQueueView implementation
        this.GoToHome = new Signal();
        this.PersonClicked = new Signal();
        this.ReplyClicked = new Signal();
        this.Hidden = new Signal();
        this.Shown = new Signal();
    }
    QueueView.prototype.GetSelectedReply = function () {
        return this.selectedReply;
    };
    QueueView.prototype.GetSpeaker = function () {
        return this.selectedCharacter;
    };
    QueueView.prototype.SetCharacters = function (characters) {
        var OnClick = function (e) {
            this.selectedCharacter = e.data;
            this.PersonClicked.Call();
        };
        var people = $("#queue-people");
        people.empty();
        for (var i = 0; i != characters.length; ++i) {
            // goes up to 1.0 in increments of 0.1
            var scale = (5 + i) / 10;
            var character = characters[i];
            var button = $("<div class='queue-person'>");
            button.css("transform", "scale(" + String(scale) + ")");
            button.css("margin-top", String(1.5 * scale) + "em");
            if (character) {
                button.text(character.name);
                var name = $("<p>");
                button.addClass("queue-character");
                button.click(character, OnClick.bind(this));
            }
            else {
                button.text("\\o/");
                button.addClass("queue-player");
            }
            people.append(button);
        }
    };
    QueueView.prototype.SetCurrentTicket = function (ticket) {
        if (ticket) {
            $("#current-ticket .number").text(ticket);
            $("#current-ticket").show();
        }
        else {
            $("#current-ticket").hide();
        }
    };
    QueueView.prototype.SetDialog = function (speaker, dialog) {
        var OnClick = function (e) {
            this.selectedReply = e.data;
            this.ReplyClicked.Call();
        };
        var speakerElement = $("#queue-dialog .dialog-speaker");
        var textElement = $("#queue-dialog .dialog-text");
        var repliesElement = $("#queue-dialog .dialog-replies");
        if (!dialog) {
            speakerElement.hide();
            textElement.hide();
            repliesElement.hide();
            return;
        }
        speakerElement.show();
        textElement.show();
        repliesElement.show();
        speakerElement.text(speaker ? speaker.name : "");
        textElement.html(dialog.text);
        repliesElement.empty();
        for (var i = 0; i != dialog.replies.length; ++i) {
            var reply = dialog.replies[i];
            var li = $("<li class='fg-clickable'>");
            li.html(reply.text);
            li.click(reply.ref, OnClick.bind(this));
            repliesElement.append(li);
        }
    };
    QueueView.prototype.SetPlayerTicket = function (ticket) {
        if (ticket) {
            $("#my-ticket .number").text(ticket);
            $("#my-ticket").show();
        }
        else {
            $("#my-ticket").hide();
        }
    };
    // IClientView implementation
    QueueView.prototype.GetType = function () {
        return 1 /* Queue */;
    };
    QueueView.prototype.Hide = function () {
        $("#current-ticket").remove();
        $("#my-ticket").remove();
        this.Hidden.Call();
    };
    QueueView.prototype.Show = function (e) {
        var _this = this;
        e.append("<div id='queue-people' class='queue-people'>");
        e.append("<div class='queue-spacer'>");
        e.append("<div id='queue-body' class='queue-body'><div id='queue-dialog' class='dialog'><div class='dialog-speaker'></div><p class='dialog-text'></p><ol class='dialog-replies'></ol></div></div>");
        var goHome = $("<button id='go-home'>");
        goHome.text("вернуться домой");
        goHome.click(function () {
            _this.GoToHome.Call();
        });
        $("#buttons").append(goHome);
        var gameDiv = $("#game");
        gameDiv.append("<div id='my-ticket' class='queue-ticket my-ticket'><p class='info-font'>ваш<br>номер</p><div class='number' /></div>");
        gameDiv.append("<div id='current-ticket' class='queue-ticket current-ticket'><p class='info-font'>текущий<br>номер</p><div class='number' /></div>");
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
        location.reload();
    };
    SaveModel.prototype.GetSaveData = function () {
        var data = [];
        for (var i = 0; i != localStorage.length; ++i) {
            var key = localStorage.key(i);
            var val = localStorage[key];
            data.push([key, val]);
        }
        data.sort(this.Compare);
        return data;
    };
    SaveModel.prototype.SetSaveData = function (data) {
        for (var i = 0; i != data.length; ++i)
            localStorage[data[i][0]] = data[i][1];
        location.reload();
    };
    // private implementation
    SaveModel.prototype.Compare = function (a, b) {
        return a[0].localeCompare(b[0]);
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
    SavePresenter.prototype.Load = function () {
        this.saveView.SetSaveData(this.saveModel.GetSaveData());
    };
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
        this.ItemStatusChanged = new Signal();
        this.Purchased = new Signal();
        player.MoneyChanged.Add(this.OnMoneyChanged.bind(this));
    }
    StoreModel.prototype.Deactivate = function () {
        this.items = null;
    };
    StoreModel.prototype.GetChangedItem = function () {
        return this.changedItem;
    };
    StoreModel.prototype.GetItems = function () {
        var money = this.player.GetMoney();
        var items = [];
        if (!this.player.GetMoustache())
            items.push(this.GetSaleInfo(0 /* PencilMoustache */, money));
        if (!this.player.GetHat())
            items.push(this.GetSaleInfo(1 /* Tophat */, money));
        if (!this.player.HasItem(2 /* TV */)) {
            items.push(this.GetSaleInfo(2 /* TV */, money));
        }
        else {
            if (!this.player.HasItem(4 /* Community */))
                items.push(this.GetSaleInfo(4 /* Community */, money));
        }
        if (!this.player.HasItem(3 /* Table */)) {
            items.push(this.GetSaleInfo(3 /* Table */, money));
        }
        else {
            if (!this.player.HasItem(5 /* Monopoly */))
                items.push(this.GetSaleInfo(5 /* Monopoly */, money));
        }
        this.items = items;
        return items;
    };
    StoreModel.prototype.GetSaleInfo = function (item, money) {
        var price = Item.GetInfo(item).price;
        var enabled = price <= money;
        return [item, enabled];
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
    // private implementation
    StoreModel.prototype.ApplyItem = function (item) {
        switch (item) {
            case 0 /* PencilMoustache */:
                this.player.SetMoustache(1 /* Pencil */);
                break;
            case 1 /* Tophat */:
                this.player.SetHat(1 /* Tophat */);
                break;
            default:
                this.player.AddItem(item);
        }
    };
    StoreModel.prototype.OnMoneyChanged = function () {
        if (!this.items)
            return;
        for (var i = 0; i != this.items.length; ++i) {
            var item = this.items[i];
            var price = Item.GetInfo(item[0]).price;
            var money = this.player.GetMoney();
            var enabled = price <= money;
            if (enabled == item[1])
                continue;
            this.changedItem = [item[0], enabled];
            this.items[i] = this.changedItem;
            this.ItemStatusChanged.Call();
        }
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
        storeModel.ItemStatusChanged.Add(this.OnItemStatusChanged.bind(this));
        storeModel.Purchased.Add(this.OnPurchased.bind(this));
        storeView.GoToHome.Add(this.OnGoToHome.bind(this));
        storeView.Hidden.Add(this.OnHidden.bind(this));
        storeView.ItemSelected.Add(this.OnItemSelected.bind(this));
        storeView.Shown.Add(this.OnShown.bind(this));
    }
    StorePresenter.prototype.OnGoToHome = function () {
        this.mainModel.SetView(0 /* Home */);
    };
    StorePresenter.prototype.OnHidden = function () {
        this.storeModel.Deactivate();
    };
    StorePresenter.prototype.OnItemSelected = function () {
        this.storeModel.Purchase(this.storeView.GetSelectedItem());
    };
    StorePresenter.prototype.OnItemStatusChanged = function () {
        var item = this.storeModel.GetChangedItem();
        this.storeView.SetItemStatus(item[0], item[1]);
    };
    StorePresenter.prototype.OnPurchased = function () {
        this.storeView.SetItems(this.storeModel.GetItems());
    };
    StorePresenter.prototype.OnShown = function () {
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
        this.Hidden = new Signal();
        this.ItemSelected = new Signal();
        this.Shown = new Signal();
    }
    StoreView.prototype.GetSelectedItem = function () {
        return this.selectedItem;
    };
    StoreView.prototype.SetItems = function (items) {
        var buttons = [];
        for (var i = 0; i != items.length; ++i) {
            var OnClick = function (e) {
                this.selectedItem = e.data;
                this.ItemSelected.Call();
            };
            var item = items[i][0];
            var info = Item.GetInfo(item);
            var enabled = items[i][1];
            var button = $("<li>" + info.name + "<br/>" + info.description + "<br/>" + info.price.toLocaleString() + " руб.</li>");
            button.addClass(Item[item]);
            if (enabled) {
                button.click(item, OnClick.bind(this));
                button.addClass("fg-clickable");
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
    StoreView.prototype.SetItemStatus = function (item, isEnabled) {
        var button = $("#store-items ." + Item[item]);
        if (isEnabled)
            button.removeClass("disabled");
        else
            button.addClass("disabled");
    };
    // IClientView implementation
    StoreView.prototype.GetType = function () {
        return 2 /* Store */;
    };
    StoreView.prototype.Hide = function () {
        this.Hidden.Call();
    };
    StoreView.prototype.Show = function (e) {
        var _this = this;
        var goHome = $("<button id='go-home'>");
        goHome.text("вернуться домой");
        goHome.click(function () {
            _this.GoToHome.Call();
        });
        $("#buttons").append(goHome);
        e.html("<ul id='store-items'>");
        this.Shown.Call();
    };
    return StoreView;
})();
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
function MapCharacterNameFlags(flags, player, characterManager, queueModel) {
    var characters = characterManager.GetAllCharacters();
    for (var i = 0; i != characters.length; ++i) {
        var c = characters[i];
        flags.SetCheck(c.id + "Intro", player.HasNotMet.bind(player, c));
        flags.SetCheck(c.id + "Friendship", player.IsFriendsWith.bind(player, c));
        flags.SetControl(c.id + "Friendship", player.Befriend.bind(player, c));
        flags.SetControl(c.id + "ExitQueue", queueModel.Remove.bind(queueModel, c));
    }
}
function MapPlayerStateFlags(flags, player) {
    flags.SetCheck("MoustacheEquipped", function () {
        return player.GetMoustache() != 0 /* None */;
    });
    flags.SetCheck("MoustacheAbsent", function () {
        return player.GetMoustache() == 0 /* None */;
    });
    flags.SetCheck("HatEquipped", function () {
        return player.GetHat() != 0 /* None */;
    });
}
function Main(dialogs, characters) {
    var flags = new Flags();
    var dialogManager = new DialogManager(dialogs, flags);
    var characterManager = new CharacterManager(characters, flags);
    var timer = new Timer();
    var player = new Player(timer);
    var activitiesModel = new ActivitiesMenuModel(player);
    var invitesModel = new InvitesMenuModel(characterManager, player);
    var homeModel = new HomeModel(timer, characterManager, dialogManager, player);
    var mainModel = new MainModel(player);
    var queueModel = new QueueModel(timer, characterManager, dialogManager, player);
    var saveModel = new SaveModel();
    var storeModel = new StoreModel(player);
    var homeView = new HomeView();
    var queueView = new QueueView();
    var saveView = new SaveView();
    var storeView = new StoreView();
    var mainView = new MainView([homeView, queueView, storeView]);
    var homePresenter = new HomePresenter(homeModel, activitiesModel, invitesModel, mainModel, queueModel, homeView);
    var mainPresenter = new MainPresenter(mainModel, mainView);
    var queuePresenter = new QueuePresenter(mainModel, queueModel, queueView);
    var savePresenter = new SavePresenter(saveModel, saveView);
    var storePresenter = new StorePresenter(mainModel, storeModel, storeView);
    var persistentItems = [["activitiesMenu", activitiesModel], ["invitesMenu", invitesModel], ["main", mainModel], ["home", homeModel], ["queue", queueModel], ["player", player], ["timer", timer], ["flags", flags]];
    var persistentState = new PersistentState(persistentItems, timer);
    MapCharacterNameFlags(flags, player, characterManager, queueModel);
    MapPlayerStateFlags(flags, player);
    persistentState.Load();
    savePresenter.Load();
    mainPresenter.LightsCameraAction();
    timer.Start(100);
}
$.getJSON("js/dialogs.json", function (dialogs) {
    $.getJSON("js/characters.json", function (characters) {
        Main(dialogs, characters);
    });
});
