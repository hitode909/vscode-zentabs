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
            return;
        }
        const item = new HistoryItem(editor);
        this.repository.push(item);
        const itemToTrim = this.repository.getItemToTrim();
        if (!itemToTrim) {
            return;
        }
        await this.trim(itemToTrim, editor);
    }

    private async trim(itemToTrim: HistoryItem, editor: vscode.TextEditor) {
        try {
            this.lock.start();
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