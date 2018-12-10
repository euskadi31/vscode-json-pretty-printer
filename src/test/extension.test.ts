//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
import { prettyPrint, getTab } from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', () => {
    test('getTab', () => {
        assert.equal('\t', getTab('tab', 4));
        assert.equal('    ', getTab('space', 4));
        assert.equal('  ', getTab('space', 2));
        assert.equal('\t', getTab('bad', 4));
    });

    // Defines a Mocha unit test
    test("prettyprint", () => {
        const actual = `{"foo":"bar","bar":[1,2,3],"jar":{"tee":2354645676567568678678978977978965756464646,"nullable":null,"boolean":true}}`;

        prettyPrint(actual, '    ').then((content) => {
            assert.equal(content, `{
                "foo": "bar",
                "bar": [
                    1,
                    2,
                    3
                ],
                "jar": {
                    "tee": 2354645676567568678678978977978965756464646,
                    "nullable": null,
                    "boolean": true
                }
            }`);
        });
    });
});
