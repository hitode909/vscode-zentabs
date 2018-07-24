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
        // comparing editor is better?
        return this.editor.document === other.editor.document;
    }

    get isActive(): boolean {
        return ! this.editor.document.isClosed;
    }
}