import { ZenTabs } from './ZenTabs';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "zentabs" is now active!');

    const zentabs = new ZenTabs();

    vscode.window.onDidChangeActiveTextEditor(async editor => {
        if (!editor) { return; }
        await zentabs.onDidChangeActiveTextEditor(editor);
    }, null, context.subscriptions);
}

export function deactivate() {
}