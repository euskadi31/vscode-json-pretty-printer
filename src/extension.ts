'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import stripComments = require('strip-json-comments');

const parse = require('json-to-ast');


const LINE_SEPERATOR = /\n|\r\n/;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "json-pretty-printer" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.prettyPrint', () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const editor_config = vscode.workspace.getConfiguration('editor');
        const tab_size = editor_config.get('tabSize', 4);
        const isSpace = editor_config.get('insertSpace', false);
        let tab_type = 'tab';

        if (isSpace) {
            tab_type = 'space';
        }

        const raw = stripComments(editor.document.getText());

        prettyPrint(raw, getTab(tab_type, tab_size), 0).then((content) => {
            return editor.edit(builder => {
                const start = new vscode.Position(0, 0);
                const lines = raw.split(LINE_SEPERATOR);
                const end = new vscode.Position(lines.length, lines[lines.length - 1].length);
                const allRange = new vscode.Range(start, end);
                builder.replace(allRange, content);
            });
        }).then(success => {
            console.log('finished');
            //@TODO: unselect text
        }).catch(reason => {
            console.error(reason);
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function visitor(ast: any, tab: string, indent: number): string {
    let data = '';

    switch (ast.type) {
        case 'Object':
            data += '{\n';

            if (ast.hasOwnProperty('children')) {
                let items: string[] = [];

                ast.children.forEach((child: any) => {
                    items.push(visitor(child, tab, indent + 1));
                });

                data += items.join(',\n') + '\n';
            }

            data += tab.repeat(indent) + '}';

            break;

        case 'Array':
            data += '[\n';

            if (ast.hasOwnProperty('children')) {
                let items: string[] = [];
                ast.children.forEach((child: any) => {
                    items.push(tab.repeat(indent + 1) + visitor(child, tab, indent + 1));
                });

                data += items.join(',\n') + '\n';
            }

            data += tab.repeat(indent) + ']';
            break;

        case 'Property':
            data += tab.repeat(indent) + ast.key.raw + ': ' + visitor(ast.value, tab, indent);

            break;

        case 'Literal':
            data += ast.raw;
            break;

        default:
            break;
    }

    return data;
}

function prettyPrint(data: string, tab: string, indent: number): Promise<string> {
    return new Promise((resolve, reject) => {
        let ast = parse(data, {
            loc: false
        });

        resolve(visitor(ast, tab, indent) + '\n');
    });
}

function getTab(tabStyle: string, tabSize: number): string {
    if (tabStyle === 'space') {
        return ' '.repeat(tabSize);
    }

    return '\t';
}
