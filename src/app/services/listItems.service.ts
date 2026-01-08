import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_LIST_ITEMS = gql`
  query GetListItems($listItemId: String!) {
    listItem(id: $listItemId) {
      completed
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ListItemsService {
  constructor(private apollo: Apollo) {}

  getListItems(listItemId: string) {
    return this.apollo.watchQuery({
      query: GET_LIST_ITEMS,
      variables: { listItemId },
    }).valueChanges;
  }
}
