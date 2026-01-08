import { User } from './User';

export interface List {
  id: string;
  name: string;
  totalItems: number;
  user?: User;
  items?: Items[];
}

export interface Items {
  id: string;
  item: Item;
  completed: boolean;
}

export interface Item {
  id: string;
  name: string;
  quantityUnits: string;
}
