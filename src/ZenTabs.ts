import { HistoryItem } from './HistoryItem';
import { HistoryRepository } from './HistoryRepository';
import { Lock } from './Lock';
import * as vscode from 'vscode';

export class ZenTabs {
    readonly repository: HistoryRepository;
    readonly lock: Lock;
    constructor() {
        this.repository = new HistoryRepository();
        this.lock = new Lock();
    }
    async onDidChangeActiveTextEditor(editor: vscode.TextEditor) {
        if (this.lock.inSession) {
            console.log('in GC');
            return;
        }
        const item = new HistoryItem(editor);
        this.repository.push(item);
        console.log(`append ${item.uri}`);
        console.log(this.repository.items.map(i => `- ${i.uri}`).join("\n"));
        const itemToTrim = this.repository.getItemToTrim();
        if (!itemToTrim) {
            return;
        }
        try {
            this.lock.start();
            console.log(`close ${itemToTrim.uri}`);
            await vscode.window.showTextDocument(itemToTrim.editor.document, itemToTrim.editor.viewColumn);
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            if (!editor.document.isClosed) {
                await vscode.window.showTextDocument(editor.document, editor.viewColumn);
            }
        }
        catch (error) {
            this.lock.stop();
        }
        finally {
            this.lock.stop();
        }
    }
}