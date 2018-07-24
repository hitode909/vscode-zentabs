import { HistoryItem } from "./HistoryItem";

export class HistoryRepository {
    readonly max: number;
    constructor(max: number) {
        this.max = max;
    }
    items: Array<HistoryItem> = [];
    push(item: HistoryItem): void {
        this.items.unshift(item);
        const knownUris: {
            [key: string]: boolean;
        } = {};
        const newHistory: Array<HistoryItem> = [];
        this.items.forEach(item => {
            if (item.editor.document.isClosed) {
                return;
            }
            if (knownUris[item.uri]) {
                return;
            }
            knownUris[item.uri] = true;
            newHistory.push(item);
        });
        this.items = newHistory;
    }
    getItemToTrim(): HistoryItem | undefined {
        if (this.items.length > this.max) {
            return this.items.pop();
        }
    }
}