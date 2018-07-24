'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class GC {
    inSession: boolean = false;

    start():void {
        this.inSession = true;
    }
    stop():void {
        this.inSession = false;
    }
}

class HistoryRepository {

    readonly max: number;
    constructor(max: number) {
        this.max = max;
    }

    items: Array<HistoryItem> = [];

    push(item: HistoryItem): void {
        this.items.unshift(item);

        const knownUris: { [key: string]: boolean } = {};
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
class HistoryItem {
    readonly editor: vscode.TextEditor;

    get uri(): string {
        return this.editor.document.uri.toString();
    }

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "zentabs" is now active!');

    const repository = new HistoryRepository(3);
    const gc = new GC();

    vscode.window.onDidChangeActiveTextEditor(async editor => {
        if (!editor) { return; }
        if (gc.inSession) {
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
            gc.start();
            console.log(`close ${itemToTrim.uri}`);
            await vscode.window.showTextDocument(itemToTrim.editor.document);
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            if (!editor.document.isClosed) {
                await vscode.window.showTextDocument(editor.document);
            }
        } finally {
            gc.stop();
        }
    }, null, context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {
}