import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_ALL_LISTS = gql`
  query Lists {
    lists {
      name
      totalItems
      id
      items {
        id
        completed
        item {
          id
          name
        }
      }
    }
  }
`;

const GET_LIST = gql`
  query List($listId: ID!, $limit: Int, $offset: Int, $search: String) {
    list(id: $listId) {
      id
      name
      totalItems
      items(limit: $limit, offset: $offset, search: $search) {
        id
        completed
        item {
          id
          name
        }
      }
    }
  }
`;

const UPDATE_LIST_ITEM = gql`
  mutation UpdateListItem($updateListItemInput: UpdateListItemInput!) {
    updateListItem(updateListItemInput: $updateListItemInput) {
      completed
      quantity
      id
      item {
        id
        name
        listItems {
          id
          list {
            id
            name
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor(private apollo: Apollo) {}

  getLists(limit: number = 10, offset: number = 0, search: string = '') {
    return this.apollo.watchQuery({
      query: GET_ALL_LISTS,
      //variables: { limit, offset, search },
      fetchPolicy: 'network-only', // Always fetch from the server
    }).valueChanges;
  }

  getList(listId: string, limit: number, offset: number, search: string = '') {
    return this.apollo.watchQuery({
      query: GET_LIST,
      variables: { listId, limit, offset, search },
      fetchPolicy: 'network-only', // Always fetch from the server
    }).valueChanges;
  }

  updateListItem(
    listId: string,
    listItemId: string,
    itemId: string,
    completed: boolean
  ) {
    return this.apollo.mutate({
      mutation: UPDATE_LIST_ITEM,
      variables: {
        updateListItemInput: {
          listId,
          itemId: itemId,
          id: listItemId,
          completed,
        },
      },
    });
  }
}
