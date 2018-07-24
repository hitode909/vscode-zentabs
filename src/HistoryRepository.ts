import * as vscode from 'vscode';
import { HistoryItem } from "./HistoryItem";

export class HistoryRepository {
    readonly max: number;
    readonly itemsByColumns: { [column: string]: HistoryItem[] } = { };
    constructor(max: number) {
        this.max = max;
    }

    getItems(column: vscode.ViewColumn | undefined): HistoryItem[] {
        if (!column) { column = 0; }
        if (!this.itemsByColumns[column]) {
            this.itemsByColumns[column] = [];
        }
        return this.itemsByColumns[column];
    }

    setItems(column: vscode.ViewColumn | undefined, items: HistoryItem[]): void {
        if (!column) { column = 0; }
        this.itemsByColumns[column] = items;
    }

    push(newItem: HistoryItem): void {
        const newItems = this.getItems(newItem.viewColumn).filter(item => item.isActive && ! item.equals(newItem));
        newItems.unshift(newItem);
        this.setItems(newItem.viewColumn, newItems);
    }
    getItemToTrim(item: HistoryItem): HistoryItem | undefined {
        const items = this.getItems(item.viewColumn);
        if (items.length > this.max) {
            return items.pop();
        }
    }
}