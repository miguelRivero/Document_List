export function mapApiDocumentToListDocument(apiDoc) {
    // console.log("mapApiDocumentToListDocument : ", apiDoc)
    return {
        id: apiDoc.ID,
        title: apiDoc.Title,
        contributors: apiDoc.Contributors.map(c => ({ id: c.ID, name: c.Name })),
        version: apiDoc.Version,
        attachments: apiDoc.Attachments,
        createdAt: apiDoc.CreatedAt,
    };
}
