import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
// import { request } from 'graphql-request' // @NOTE: gql is note the same as the one given by graphql, this is just to intelecene // can unistall
import { getAccessToken } from '../auth'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`
const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  // look up the diff options
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only'
  //   },
  //   mutate: {
  //     fetchPolicy: 'network-only'
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'network-only'
  //   }
  // }
})

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `
  // const { jobs } = await request(GRAPHQL_URL, query)
  const { data: {jobs} } = await client.query({ query, fetchPolicy: 'network-only' })
  return jobs
}

export async function getJob(id) {
  const variables = { id }

  // const { job } = await request(GRAPHQL_URL, query, variables)
  const { data: {job} } = await client.query({ JOB_QUERY, variables })
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
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `
  const variables = { input }
  const context = {
    headers: { 'Authorization': 'Bearer ' + getAccessToken() }
  }

  // const { job } = await request(GRAPHQL_URL, query, variables, requestHeaders)
  const { data: {job} } = await client.mutate({
    mutation,
    variables,
    context,
    update: (cache, { data: { job } }) => { // typical after mutation
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id:  job.id },
        data: { job }
      })
    }
  })
  return job
}
