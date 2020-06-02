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
            issues(states: OPEN, first: 100) {
              edges {
                cursor
                node {
                  labels(first: 5) {
                    nodes {
                      id
                    }
                  }
                }
              }
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
