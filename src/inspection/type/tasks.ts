// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Assert, CommonError, Result, ResultUtils } from "../../common";
import { getLocalizationTemplates } from "../../localization";
import { NodeIdMap, TXorNode } from "../../parser";
import { CommonSettings } from "../../settings";
import { Type } from "../../type";
import { ScopeById, ScopeItemByKey } from "../scope";
import { getOrCreateScope, getOrCreateType, inspectXorNode } from "./inspectType";
import { ScopeTypeByKey, TypeById, TypeInspectionState } from "./type";

export type TriedScopeType = Result<ScopeTypeByKey, CommonError.CommonError>;

export type TriedType = Result<Type.TType, CommonError.CommonError>;

// A cache that can be re-used for successive calls under the same document.
export interface TypeCache {
    readonly scopeById: ScopeById;
    readonly typeById: TypeById;
}

export function tryScopeType(
    settings: CommonSettings,
    nodeIdMapCollection: NodeIdMap.Collection,
    leafNodeIds: ReadonlyArray<number>,
    nodeId: number,
    maybeTypeCache: TypeCache | undefined = undefined,
): TriedScopeType {
    const state: TypeInspectionState = {
        settings,
        givenTypeById: maybeTypeCache?.typeById ?? new Map(),
        deltaTypeById: new Map(),
        nodeIdMapCollection,
        leafNodeIds,
        scopeById: maybeTypeCache?.scopeById ?? new Map(),
    };

    return ResultUtils.ensureResult(getLocalizationTemplates(settings.locale), () => inspectScopeType(state, nodeId));
}

export function tryType(
    settings: CommonSettings,
    nodeIdMapCollection: NodeIdMap.Collection,
    leafNodeIds: ReadonlyArray<number>,
    xorNode: TXorNode,
    maybeTypeCache: TypeCache | undefined = undefined,
): TriedType {
    const state: TypeInspectionState = {
        settings,
        givenTypeById: maybeTypeCache?.scopeById ?? new Map(),
        deltaTypeById: new Map(),
        nodeIdMapCollection,
        leafNodeIds,
        scopeById: maybeTypeCache?.typeById ?? new Map(),
    };

    return ResultUtils.ensureResult(getLocalizationTemplates(settings.locale), () => inspectXorNode(state, xorNode));
}

function inspectScopeType(state: TypeInspectionState, nodeId: number): ScopeTypeByKey {
    const scopeItemByKey: ScopeItemByKey = getOrCreateScope(state, nodeId);

    for (const scopeItem of scopeItemByKey.values()) {
        if (!state.givenTypeById.has(scopeItem.id)) {
            state.deltaTypeById.set(scopeItem.id, getOrCreateType(state, scopeItem));
        }
    }

    for (const [key, value] of state.deltaTypeById.entries()) {
        state.givenTypeById.set(key, value);
    }

    const result: ScopeTypeByKey = new Map();
    for (const [key, scopeItem] of scopeItemByKey.entries()) {
        const maybeType: Type.TType | undefined = state.givenTypeById.get(scopeItem.id);
        Assert.isDefined(maybeType, `expected nodeId to be in givenTypeById`, { nodeId: scopeItem.id });

        result.set(key, maybeType);
    }

    return result;
}
