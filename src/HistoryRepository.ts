import { HistoryItem } from "./HistoryItem";

export class HistoryRepository {
    readonly max: number;
    constructor(max: number) {
        this.max = max;
    }
    items: Array<HistoryItem> = [];
    push(newItem: HistoryItem): void {
        const newItems = this.items.filter(item => item.isActive && ! item.equals(newItem));
        newItems.unshift(newItem);
        this.items = newItems;
    }
    getItemToTrim(): HistoryItem | undefined {
        if (this.items.length > this.max) {
            return this.items.pop();
        }
    }
}