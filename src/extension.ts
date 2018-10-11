'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import cp = require('child_process');
import os = require('os');
import stripComments = require('strip-json-comments');
import stream = require('stream');

const LINE_SEPERATOR = /\n|\r\n/;

const archsAlias: { [key: string]: string } = {
    'x64': 'amd64',
};

const platformsAlias: { [key: string]: string } = {
    'win32': 'windows',
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "json-pretty-printer" is now active!');

    console.log(process.cwd());
    console.log(__dirname);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.prettyPrint', () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        let arch = os.arch();
        let platform = <string>os.platform();

        if (archsAlias.hasOwnProperty(arch)) {
            arch = archsAlias[arch];
        }

        if (platformsAlias.hasOwnProperty(platform)) {
            platform = platformsAlias[platform];
        }

        const editor_config = vscode.workspace.getConfiguration('editor');
        const indent_size = editor_config.get('tabSize', 4);
        const isSpace = editor_config.get('insertSpace', false);
        let indent_type = 'tab';

        if (isSpace) {
            indent_type = 'space';
        }

        const raw = stripComments(editor.document.getText());

        let child = cp.execFile(
            `${__dirname}/../build/${platform}/${arch}/json-pretty-print`,
            [
                `--indent-type=${indent_type}`,
                `--indent-size=${indent_size}`
            ],
            (err, stdout, stderr) => {
                if (err) {
                    vscode.window.showErrorMessage(err.message);

                    return;
                }

                editor.edit(builder => {
                    const start = new vscode.Position(0, 0);
                    const lines = raw.split(LINE_SEPERATOR);
                    const end = new vscode.Position(lines.length, lines[lines.length - 1].length);
                    const allRange = new vscode.Range(start, end);
                    builder.replace(allRange, stdout);
                }).then(success => {
                    //@TODO: unselect text
                });
            }
        );

        var stdinStream = new stream.Readable();
        stdinStream.push(raw);  // Add data to the internal queue for users of the stream to consume
        stdinStream.push(null);   // Signals the end of the stream (EOF)
        stdinStream.pipe(child.stdin);

        // Display a message box to the user
        //vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
