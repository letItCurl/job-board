// @NOTE: gql is note the same as the one given by graphql, this is just to intelecene
import { request, gql } from 'graphql-request'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `
  const { jobs } = await request(GRAPHQL_URL, query)
  return jobs
}
