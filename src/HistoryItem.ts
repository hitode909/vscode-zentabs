import * as vscode from 'vscode';

export class HistoryItem {
    readonly editor: vscode.TextEditor;
    get uri(): string {
        return this.editor.document.uri.toString();
    }
    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    equals(other: HistoryItem): boolean {
        return this.uri === other.uri;
    }
}