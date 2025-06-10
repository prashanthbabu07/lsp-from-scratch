import { documents, TextDocumentContentChangeEvent, VersionedTextDocumentIdentifier } from "../../documents";
import log from "../../log";
import { NotificationMessage } from "../../server";



interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocumentIdentifier;
    contentChanges: TextDocumentContentChangeEvent[];
}

export const didChange = (message: NotificationMessage): void => {
    log.write(message);
    const params  = message.params as DidChangeTextDocumentParams;
    documents.set(params.textDocument.uri, params.contentChanges[0].text);
}
