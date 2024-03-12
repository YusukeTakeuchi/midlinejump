import * as vscode from 'vscode';

class DocumentPosition {
	constructor(public document: vscode.TextDocument, public position: vscode.Position) {}
}

export function activate(context: vscode.ExtensionContext) {
	let previousStartPosition: DocumentPosition | undefined = undefined;

	const setCursor = (editor: vscode.TextEditor, position: vscode.Position) => {
		if (editor.selection.isEmpty)	{
			editor.selection = new vscode.Selection(position, position);
		} else {
			editor.selection = new vscode.Selection(editor.selection.anchor, position);
		}
	};

	const isValidPreviousStartPosition= (pos: typeof previousStartPosition): pos is DocumentPosition  => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return false;
		}
		const cursor = editor.selection.active;

		return !!(
			pos
			&& pos.document === editor.document
			&& pos.position.line === cursor.line
		);
	};

	const disposableStart = vscode.commands.registerCommand('midlinejump.navigateToHalfwayStart', () => {
		// jump to the middle of the position between the current cursor and the head of the line
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor = editor.selection.active;
			const position = new vscode.Position(cursor.line, cursor.character / 2);
			setCursor(editor, position);
		}
	});

	const disposableEnd = vscode.commands.registerCommand('midlinejump.navigateToHalfwayEnd', () => {
		// jump to the middle of the position between the current cursor and the end of the line
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor = editor.selection.active;
			const position = new vscode.Position(cursor.line, (cursor.character + editor.document.lineAt(cursor.line).text.length) / 2);
			setCursor(editor, position);
		}
	});

	const disposableBisectStart = vscode.commands.registerCommand('midlinejump.navigateToBisectStart', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const cursor = editor.selection.active;
		const newPreviousStartPosition = new DocumentPosition(editor.document, editor.selection.active);
		if (isValidPreviousStartPosition(previousStartPosition) && previousStartPosition.position.character < cursor.character) {
			const position = new vscode.Position(cursor.line, (previousStartPosition.position.character + cursor.character) / 2);
			setCursor(editor, position);
		} else {
			const position = new vscode.Position(cursor.line, cursor.character / 2);
			setCursor(editor, position);
		}
		previousStartPosition = newPreviousStartPosition;
	});

	const disposableBisectEnd = vscode.commands.registerCommand('midlinejump.navigateToBisectEnd', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const cursor = editor.selection.active;
		const newPreviousStartPosition = new DocumentPosition(editor.document, editor.selection.active);
		if (isValidPreviousStartPosition(previousStartPosition) && previousStartPosition.position.character > cursor.character) {
			const position = new vscode.Position(cursor.line, (previousStartPosition.position.character + cursor.character) / 2);
			setCursor(editor, position);
		} else {
			const position = new vscode.Position(cursor.line, (cursor.character + editor.document.lineAt(cursor.line).text.length) / 2);
			setCursor(editor, position);
		}
		previousStartPosition = newPreviousStartPosition;
	});

	context.subscriptions.push(disposableStart);
	context.subscriptions.push(disposableEnd);
	context.subscriptions.push(disposableBisectStart);
	context.subscriptions.push(disposableBisectEnd);
}

export function deactivate() {}
