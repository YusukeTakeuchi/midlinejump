import * as vscode from 'vscode';

class BisectState {
	constructor(
		public document: vscode.TextDocument,
		public startPosition: vscode.Position,
		public endPosition: vscode.Position,
	) {}

	public moveToStart(cursorPos: vscode.Position): vscode.Position {
		const newPos = new vscode.Position(this.getLine(), Math.floor((cursorPos.character + this.startPosition.character) / 2));
		this.endPosition = cursorPos;
		return newPos;
	}

	public moveToEnd(cursorPos: vscode.Position): vscode.Position {
		const newPos = new vscode.Position(this.getLine(), Math.ceil((cursorPos.character + this.endPosition.character) / 2));
		this.startPosition = cursorPos;
		return newPos;
	}

	public isInBisect(document: vscode.TextDocument, cursorPos: vscode.Position): boolean {
		return !!(
			this.document === document
			&& this.getLine() === cursorPos.line
			&& this.startPosition.character < cursorPos.character
			&& this.endPosition.character > cursorPos.character
		);
	}

	private getLine(): number {
		return this.startPosition.line;
	}
}

export function activate(context: vscode.ExtensionContext) {
	const disposableStart = vscode.commands.registerCommand('midlinejump.navigateToHalfwayStart', () => {
		// jump to the middle of the position between the current cursor and the head of the line
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor = editor.selection.active;
			const position = new vscode.Position(cursor.line, cursor.character / 2);
			setCursorPosition(editor, position);
		}
	});

	const disposableEnd = vscode.commands.registerCommand('midlinejump.navigateToHalfwayEnd', () => {
		// jump to the middle of the position between the current cursor and the end of the line
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const cursor = editor.selection.active;
			const position = new vscode.Position(cursor.line, (cursor.character + editor.document.lineAt(cursor.line).text.length) / 2);
			setCursorPosition(editor, position);
		}
	});

	const disposables = setupBisect();

	context.subscriptions.push(disposableStart);
	context.subscriptions.push(disposableEnd);
	context.subscriptions.push(...disposables);
}

function setupBisect() {
	let bisectState : BisectState | null = null;

	const disposableBisectStart = vscode.commands.registerCommand('midlinejump.navigateToBisectStart', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const cursor = editor.selection.active;
		if (bisectState == null || !bisectState.isInBisect(editor.document, cursor)) {
			bisectState = new BisectState(editor.document, new vscode.Position(cursor.line, 0), cursor);
		}
		setCursorPosition(editor, bisectState.moveToStart(cursor));
	});

	const disposableBisectEnd = vscode.commands.registerCommand('midlinejump.navigateToBisectEnd', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const cursor = editor.selection.active;
		if (bisectState == null || !bisectState.isInBisect(editor.document, cursor)) {
			bisectState = new BisectState(editor.document, cursor, new vscode.Position(cursor.line, editor.document.lineAt(cursor.line).text.length));
		}
		setCursorPosition(editor, bisectState.moveToEnd(cursor));
	});

	return [disposableBisectStart, disposableBisectEnd];
}

function setCursorPosition(editor: vscode.TextEditor, position: vscode.Position) {
	if (editor.selection.isEmpty)	{
		editor.selection = new vscode.Selection(position, position);
	} else {
		editor.selection = new vscode.Selection(editor.selection.anchor, position);
	}
}

export function deactivate() {}
