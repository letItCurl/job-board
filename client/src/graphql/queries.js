import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
// import { request } from 'graphql-request' // @NOTE: gql is note the same as the one given by graphql, this is just to intelecene // can unistall
import { getAccessToken } from '../auth'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache()
})

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
  // const { jobs } = await request(GRAPHQL_URL, query)
  const { data: {jobs} } = await client.query({ query })
  return jobs
}

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `
  const variables = { id }

  // const { job } = await request(GRAPHQL_URL, query, variables)
  const { data: {job} } = await client.query({ query, variables })
  return job
}

export async function getCompany(id) {
  const query = gql`
    query companyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `
  const variables = { id }

  // const { company } = await request(GRAPHQL_URL, query, variables)
  const { data: {company} } = await client.query({ query, variables })
  return company
}

export async function createJob(input) {
  const mutation = gql`
    mutation createJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `
  const variables = { input }
  const context = {
    headers: { 'Authorization': 'Bearer ' + getAccessToken() }
  }

  // const { job } = await request(GRAPHQL_URL, query, variables, requestHeaders)
  const { data: {job} } = await client.mutate({ mutation, variables, context })
  return job
}
