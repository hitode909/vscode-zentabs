import { HistoryItem } from "./HistoryItem";
import * as vscode from 'vscode';

export class HistoryRepository {
    itemGroups: { [group: string]: HistoryItem[] } = {};

    get max(): number {
        const defaultMax = 3;
        return vscode.workspace.getConfiguration('zentabs').get('maximumOpenedTabs') || defaultMax;
    }

    getItems(group: vscode.ViewColumn): HistoryItem[] {
        if (!this.itemGroups[group]) {
            this.itemGroups[group] = [];
        }
        return this.itemGroups[group];
    }

    setItems(group: vscode.ViewColumn, items: HistoryItem[]): void {
        this.itemGroups[group] = items;
    }

    push(newItem: HistoryItem): void {
        const newItems = this.getItems(newItem.group).filter(item => item.isActive && ! item.equals(newItem));
        newItems.unshift(newItem);
        this.setItems(newItem.group, newItems);
    }

    getItemToTrim(item: HistoryItem): HistoryItem | undefined {
        const items = this.getItems(item.group);
        if (items.length > this.max) {
          if (vscode.workspace.getConfiguration('zentabs').get('switchWithCurrentTab')) {
            return items.splice(1, 1)[0];
          } else {
            return items.pop();
          }
        }
    }
}
