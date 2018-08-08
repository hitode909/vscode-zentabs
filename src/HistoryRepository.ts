import { HistoryItem } from "./HistoryItem";
import * as vscode from 'vscode';

export class HistoryRepository {
    items: Array<HistoryItem> = [];

    get max(): number {
        const defaultMax = 3;
        return vscode.workspace.getConfiguration('zentabs').get('maximumOpenedTabs') || defaultMax;
   }

    push(newItem: HistoryItem): void {
        const newItems = this.items.filter(item => item.isActive && ! item.equals(newItem));
        newItems.unshift(newItem);
        this.items = newItems;
    }

    getItemToTrim(): HistoryItem | undefined {
        const items = this.items;
        if (items.length > this.max) {
            return items.pop();
        }
    }
}