import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { Subject, takeUntil } from 'rxjs';
import { List } from 'src/app/models/List';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: false,
})
export class ListComponent implements OnInit, OnDestroy {
  constructor(private listService: ListService) {}

  private destroy$ = new Subject<void>();
  lists: List[] = [];
  loading: boolean = true;

  /*  */
  length = 50;
  pageSizes: number[] = []; // Array to store pageSize for each panel
  pageIndexes: number[] = []; // Array to store pageIndex for each panel
  pageSizeOptions = [5, 10, 25];
  expandedPanels: boolean[] = []; // Track the expanded state of each panel

  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;

  handlePageEvent(event: any, panelIndex: number): void {
    // Update pageSize and pageIndex for the specific panel
    this.pageSizes[panelIndex] = event.pageSize;
    this.pageIndexes[panelIndex] = event.pageIndex;
    this.expandedPanels[event.panelIndex] = true; // Ensure the panel is expanded when paginating
    this.getListById(
      this.lists[panelIndex].id,
      event.pageSize,
      event.pageIndex * 10
    );
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  ngOnInit() {
    this.listService
      .getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result && result.data) {
          this.lists = result?.data?.lists;
          this.pageSizes = this.lists.map(() => 10); // Default pageSize for each panel
          this.pageIndexes = this.lists.map(() => 0); // Default pageIndex for each panel
          this.loading = false;
        }
      });
  }

  getListById(listId: string, limit: number, offset: number) {
    this.listService
      .getList(listId, limit, offset, '')
      .subscribe((result: any) => {
        if (result && result.data) {
          const listIndex = this.lists.findIndex((list) => list.id === listId);
          if (listIndex !== -1) {
            const updatedLists = cloneDeep(this.lists);
            updatedLists[listIndex] = result.data.list;
            this.lists = updatedLists;
          }
        }
      });
  }

  updateItem(
    listId: string,
    listItemId: string,
    itemId: string,
    completed: boolean,
    panelId: number
  ) {
    this.expandedPanels[panelId] = true; // Ensure the panel is expanded when updating an item
    const listIndex = this.lists.findIndex((list) => list.id === listId);
    if (listIndex !== -1) {
      const updatedLists = cloneDeep(this.lists);
      updatedLists[listIndex].items = (updatedLists[listIndex].items ?? []).map(
        (listItem) => {
          if (listItem.id === listItemId) {
            return {
              ...listItem,
              completed: !completed,
            };
          }
          return listItem;
        }
      );
      this.listService
        .updateListItem(listId, listItemId, itemId, !completed)
        .subscribe((response) => {});
      this.lists = updatedLists;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Clean up the subscription
  }
}
