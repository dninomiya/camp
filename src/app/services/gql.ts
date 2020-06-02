import gql from 'graphql-tag';

export const repos = gql`
  {
    organization(login: "camp-team") {
      repositories(first: 100) {
        totalCount
        edges {
          cursor
          node {
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
