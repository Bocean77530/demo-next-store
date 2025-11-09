import seoFragment from "./seo";

export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
    metafields(
      identifiers: [
        { namespace: "custom", key: "isnewrelease" },
        { namespace: "custom", key: "showimages" },
        { namespace: "custom", key: "showvideo" }
      ]
    ) {
      key
      namespace
      value
      reference {
        __typename
        ... on Video {
          sources {
            url
            mimeType
          }
          previewImage {
            url
          }
        }
      }
    }
  }
  ${seoFragment}
`;
