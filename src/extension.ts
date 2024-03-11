import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposableStart = vscode.commands.registerCommand('midlinejump.navigateToHalfwayStart', () => {
		// jump to the middle of the position between the current cursor and the head of the line
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor = editor.selection.active;
			const position = new vscode.Position(cursor.line, cursor.character / 2);
			editor.selection = new vscode.Selection(position, position);
		}
	});

	const disposableEnd = vscode.commands.registerCommand('midlinejump.navigateToHalfwayEnd', () => {
		// jump to the middle of the position between the current cursor and the end of the line
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor = editor.selection.active;
			const position = new vscode.Position(cursor.line, (cursor.character + editor.document.lineAt(cursor.line).text.length) / 2);
			editor.selection = new vscode.Selection(position, position);
		}
	});

	context.subscriptions.push(disposableStart);
	context.subscriptions.push(disposableEnd);
}

export function deactivate() {}
