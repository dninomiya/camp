import gql from 'graphql-tag';

export const repos = gql`
  {
    search(
      first: 100
      type: REPOSITORY
      query: "org:camp-team archived:false"
    ) {
      repositoryCount
      edges {
        cursor
        node {
          ... on Repository {
            labels(first: 30) {
              nodes {
                name
                id
                issues(first: 100) {
                  nodes {
                    state
                  }
                }
              }
            }
            id
            name
            owner {
              id
            }
            pullRequests(states: OPEN) {
              totalCount
            }
          }
        }
      }
    }
  }
`;

export const ownRepos = gql`
  {
    organization(login: "camp-team") {
      repositories(first: 30, affiliations: [OWNER]) {
        nodes {
          id
          name
        }
      }
    }
  }
`;

export const createLabel = gql`
  mutation createLabel($input: CreateLabelInput!) {
    createLabel(input: $input) {
      label {
        name
      }
    }
  }
`;

export interface OwnRepos {
  organization: {
    repositories: {
      nodes: {
        id: string;
        name: string;
      }[];
    };
  };
}
