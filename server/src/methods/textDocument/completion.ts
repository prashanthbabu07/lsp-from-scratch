import { RequestMessage } from "../../server";
import * as fs from "fs";
import { documents, TextDocumentIdentifier } from "../../documents";
import log from "../../log";
// import * as path from "path";

function getSystemDictionaryPath(): string | null {
    const candidates = [
        "/usr/share/dict/words", // Linux
        "/usr/dict/words", // Legacy UNIX
        "/System/Library/AssetsV2/com_apple_MobileAsset_DictionaryServices_dictionaryOSX/words", // Rare case
        "/usr/share/dict/web2", // BSD-like distros
        "/usr/share/dict/american-english", // Debian-based
        "/System/Library/Spelling/LocalDictionary", // macOS fallback (custom user dict)
    ];

    return candidates.find((file) => fs.existsSync(file)) || null;
}

const dictPath = getSystemDictionaryPath();

const words = dictPath ? fs.readFileSync(dictPath, "utf-8").split("\n") : [];

if (!dictPath) {
    console.warn("⚠️ No system dictionary file found. Using empty word list.");
}

// const words = fs.readFileSync("/usr/share/dict/words").toString().split("\n");
// const items = words.map((word) => { return { label: word } });

export interface CompletionItem {
    label: string;
}

export interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

interface Position {
    line: number;
    character: number;
}

interface TextDocumentPositionParams {
    textDocument: TextDocumentIdentifier;
    position: Position;
}

export interface CompletionParams extends TextDocumentPositionParams { }

export const completion = (message: RequestMessage): CompletionList | null => {
    const params = message.params as CompletionParams;
    const content = documents.get(params.textDocument.uri);
    // log.write({ completion: content });

    if (!content) {
        return null;
    }

    const currentLine = content.split("\n")[params.position.line];
    const lineUntilCursor = currentLine.slice(0, params.position.character);
    const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1");
    log.write({
        completion: {
            currentLine,
            lineUntilCursor,
            currentWord: currentPrefix,
        },
    });

    const items = words
        .filter((word) => {
            return word.startsWith(currentPrefix);
        })
        .slice(0, 1000)
        .map((word) => {
            return { label: word };
        });

    return {
        isIncomplete: true,
        items,
    };
};
