/// <reference path="IInvitesMenuModel.ts" />
/// <reference path="IPersistent.ts"       />

interface InvitesMenuModelState
{
	isVisible : boolean;
	selected  : string[];
}

class InvitesMenuModel implements IInvitesMenuModel, IPersistent
{
	private isVisible : boolean  = false;
	private selected  : string[] = [];

	private selection : ICharacter;

	private maxFriends = 3;  // has to be single-digit

	Cleared  = new Signal();
	Disabled = new Signal();
	Emptied  = new Signal();
	Enabled  = new Signal();
	Filled   = new Signal();
	Hidden   = new Signal();
	Selected = new Signal();
	Shown    = new Signal();

	constructor(private characterManager : CharacterManager)
	{
	}

	// IInvitesMenuModel implementation

	GetFriends() : ICharacter[]
	{
		return this.characterManager.GetAllCharacters();
	}

	GetSelectedFriends() : ICharacter[]
	{
		return this.selected.map(id => { return this.characterManager.GetCharacter(id) });
	}

	GetSelection() : ICharacter
	{
		return this.selection;
	}

	IsEmpty() : boolean
	{
		return this.selected.length == 0;
	}

	IsEnabled() : boolean
	{
		return this.selected.length < this.maxFriends;
	}

	IsVisible() : boolean
	{
		return this.isVisible;
	}

	Reset() : void
	{
		this.selected = [];
	}

	ToggleSelection(character : ICharacter) : void
	{
		var i = this.selected.indexOf(character.id);
		if (i < 0)
		{
			if (this.selected.length < this.maxFriends)
			{
				this.selection = character;
				this.selected.push(character.id);
				this.Selected.Call();

				if (this.selected.length == this.maxFriends)
					this.Disabled.Call();

				if (this.selected.length == 1)
					this.Filled.Call();
			}
		}
		else
		{
			if (this.selected.length == this.maxFriends)
				this.Enabled.Call();

			this.selection = this.characterManager.GetCharacter(this.selected[i]);
			this.selected.splice(i, 1);
			this.Cleared.Call();

			if (this.selected.length == 0)
				this.Emptied.Call();
		}
	}

	ToggleVisibility() : void
	{
		this.isVisible = !this.isVisible;
		if (this.isVisible)
			this.Shown.Call();
		else
			this.Hidden.Call();
	}

	// IPersistent implementation

	FromPersistentString(str : string) : void
	{
		var state = <InvitesMenuModelState>JSON.parse(str);
		this.isVisible = state.isVisible;
		this.selected  = state.selected;
	}

	ToPersistentString() : string
	{
		var state : InvitesMenuModelState =
			{ isVisible : this.isVisible
			, selected  : this.selected
			};
		return JSON.stringify(state);
	}
}
