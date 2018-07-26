import * as vscode from 'vscode';

import { HistoryItem } from './HistoryItem';
import { Lock } from './Lock';
import { HistoryRepository } from './HistoryRepository';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "zentabs" is now active!');

    const repository = new HistoryRepository(3);
    const lock = new Lock();

    vscode.window.onDidChangeActiveTextEditor(async editor => {
        if (!editor) { return; }
        if (lock.inSession) {
            console.log('in GC');
            return;
        }
        const item = new HistoryItem(editor);

        repository.push(item);
        console.log(`append ${item.uri}`);
        console.log(repository.items.map(i => `- ${i.uri}`).join("\n"));
        const itemToTrim = repository.getItemToTrim();
        if (!itemToTrim) {
            return;
        }

        try {
            lock.start();
            console.log(`close ${itemToTrim.uri}`);
            await vscode.window.showTextDocument(itemToTrim.editor.document, itemToTrim.editor.viewColumn);
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            if (!editor.document.isClosed) {
                await vscode.window.showTextDocument(editor.document, editor.viewColumn);
            }
        } catch (error) {
            lock.stop();
        } finally {
            lock.stop();
        }
    }, null, context.subscriptions);
}

export function deactivate() {
}