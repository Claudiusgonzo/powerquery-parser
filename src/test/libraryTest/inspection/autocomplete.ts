// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from "chai";
import "mocha";
import { Inspection } from "../../..";
import { ResultUtils } from "../../../common";
import { Inspected } from "../../../inspection";
import { KeywordKind, TExpressionKeywords } from "../../../lexer";
import { Ast } from "../../../parser";
import { DefaultSettings } from "../../../settings";
import { expectParseErrInspection, expectParseOkInspection, expectTextWithPosition } from "../../common";

type AbridgedInspection = Inspected["autocompleteKeywords"];

function expectNodesEqual(triedInspection: Inspection.TriedInspection, expected: AbridgedInspection): void {
    if (!ResultUtils.isOk(triedInspection)) {
        throw new Error(`AssertFailed: ResultUtils.isOk(triedInspection): ${triedInspection.error.message}`);
    }
    const inspection: Inspection.Inspected = triedInspection.value;
    const actual: AbridgedInspection = inspection.autocompleteKeywords;

    expect(actual).deep.equal(expected);
}

describe(`Inspection`, () => {
    describe(`Autocomplete`, () => {
        describe("partial keyword", () => {
            it("a|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`a|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("x a|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`x a|`);
                const expected: AbridgedInspection = [KeywordKind.And, KeywordKind.As];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("e|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`e|`);
                const expected: AbridgedInspection = [KeywordKind.Each, KeywordKind.Error];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("if x then x e|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if x then x e|`);
                const expected: AbridgedInspection = [KeywordKind.Else];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("i|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`i|`);
                const expected: AbridgedInspection = [KeywordKind.If];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("l|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`l|`);
                const expected: AbridgedInspection = [KeywordKind.Let];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("m|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`m|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("x m|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`x m|`);
                const expected: AbridgedInspection = [KeywordKind.Meta];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("n|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`n|`);
                const expected: AbridgedInspection = [KeywordKind.Not];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("true o|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`true o|`);
                const expected: AbridgedInspection = [KeywordKind.Or];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("try true o|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true o|`);
                const expected: AbridgedInspection = [KeywordKind.Or, KeywordKind.Otherwise];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("try true o |", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true o |`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("try true ot|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true ot|`);
                const expected: AbridgedInspection = [KeywordKind.Otherwise];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("try true oth|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true oth|`);
                const expected: AbridgedInspection = [KeywordKind.Otherwise];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("s|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`s|`);
                const expected: AbridgedInspection = [KeywordKind.Section];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it("[] s|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`[] s|`);
                const expected: AbridgedInspection = [KeywordKind.Section];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("section; s|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`section; s|`);
                const expected: AbridgedInspection = [KeywordKind.Shared];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("section; shared x|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`section; shared x|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("section; [] s|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`section; [] s|`);
                const expected: AbridgedInspection = [KeywordKind.Shared];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("if true t|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if true t|`);
                const expected: AbridgedInspection = [KeywordKind.Then];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it("t|", () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`t|`);
                const expected: AbridgedInspection = [KeywordKind.True, KeywordKind.Try, KeywordKind.Type];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.ErrorHandlingExpression}`, () => {
            it(`try |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`try true|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true|`);
                const expected: AbridgedInspection = [KeywordKind.True];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it(`try true |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true |`);
                const expected: AbridgedInspection = [KeywordKind.Otherwise];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.ErrorRaisingExpression}`, () => {
            it(`if |error`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if |error`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if error|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if error|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`error |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`error |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.IfExpression}`, () => {
            it(`if|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if |if`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if |if`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if i|f`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if i|f`);
                const expected: AbridgedInspection = [KeywordKind.If];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 |`);
                const expected: AbridgedInspection = [KeywordKind.Then];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 t|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 t|`);
                const expected: AbridgedInspection = [KeywordKind.Then];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 then |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 then |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 then 1|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 then 1|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 then 1 e|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 then 1 e|`);
                const expected: AbridgedInspection = [KeywordKind.Else];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 then 1 else|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 then 1 else|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 th|en 1 else`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 th|en 1 else`);
                const expected: AbridgedInspection = [KeywordKind.Then];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`if 1 then 1 else |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`if 1 then 1 else |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.InvokeExpression}`, () => {
            it(`foo(|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`foo(|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`foo(a|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`foo(a|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`foo(a|,`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`foo(a|,`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`foo(a,|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`foo(a,|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.ListExpression}`, () => {
            it(`{|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`{1|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{1|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`{1|,`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{1|,`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`{1,|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{1,|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`{1,|2`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{1,|2`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`{1,|2,`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{1,|2,`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`{1..|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`{1..|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.OtherwiseExpression}`, () => {
            it(`try true otherwise| false`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(
                    `try true otherwise| false`,
                );
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it(`try true otherwise |false`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(
                    `try true otherwise |false`,
                );
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it(`try true oth|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true oth|`);
                const expected: AbridgedInspection = [KeywordKind.Otherwise];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`try true otherwise |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`try true otherwise |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.ParenthesizedExpression}`, () => {
            it(`+(|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+(|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.RecordExpression}`, () => {
            it(`+[|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=|`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a|=1`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a|=1`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1|]`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1|]`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=| 1]`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=| 1]`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseOkInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1|,`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1,|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1,|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1|,b`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1|,b`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1|,b=`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1|,b=`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=|1,b=`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=|1,b=`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1,b=2|`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1,b=2|`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`+[a=1,b=2 |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`+[a=1,b=2 |`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });

        describe(`${Ast.NodeKind.SectionMember}`, () => {
            it(`section; [] |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`section; [] |`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`section; [] x |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`section; [] x |`);
                const expected: AbridgedInspection = [];
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });

            it(`section; x = |`, () => {
                const [text, position]: [string, Inspection.Position] = expectTextWithPosition(`section; x = |`);
                const expected: AbridgedInspection = TExpressionKeywords;
                expectNodesEqual(expectParseErrInspection(DefaultSettings, text, position), expected);
            });
        });
    });
});