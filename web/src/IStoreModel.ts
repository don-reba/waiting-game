interface IStoreModel
{
	Purchased : Signal;

	GetItems() : Item[];

	Purchase(item : Item) : void;
}
