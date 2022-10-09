import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

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
export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`

export const JOBS_QUERY = gql`
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

export const COMPANY_QUERY = gql`
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

export const CREATE_JOB_MUTATION = gql`
  mutation createJobMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  // @NOTE: look up the diff options
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

// import { request } from 'graphql-request' // @NOTE: gql is note the same as the one given by graphql, this is just to intelecene // can unistall

// @NOTE: No longer required since we use `useQuery` / custom hooks
// export async function createJob(input) {
//   const variables = { input }
//   const context = {
//     headers: { 'Authorization': 'Bearer ' + getAccessToken() }
//   }
//
//   // const { job } = await request(GRAPHQL_URL, query, variables, requestHeaders)
//   const { data: {job} } = await client.mutate({
//     CREATE_JOB_MUTATION,
//     variables,
//     context,
//     update: (cache, { data: { job } }) => { // typical after mutation
//       cache.writeQuery({
//         query: JOB_QUERY,
//         variables: { id:  job.id },
//         data: { job }
//       })
//     }
//   })
//   return job
// }

// @NOTE: No longer required since we use `useQuery` / custom hooks
// export async function getJobs() {
//   // const { jobs } = await request(GRAPHQL_URL, JOBS_QUERY)
//   const { data: {jobs} } = await client.query({ JOBS_QUERY, fetchPolicy: 'network-only' })
//   return jobs
// }

// @NOTE: No longer required since we use `useQuery` / custom hooks
//export async function getJob(id) {
//  const variables = { id }
//
//  // const { job } = await request(GRAPHQL_URL, query, variables)
//  const { data: {job} } = await client.query({ JOB_QUERY, variables })
//  return job
//}

// @NOTE: No longer required since we use `useQuery` / custom hooks
//export async function getCompany(id) {
//  const variables = { id }
//
//  // const { company } = await request(GRAPHQL_URL, query, variables)
//  const { data: {company} } = await client.query({ COMPANY_QUERY, variables })
//  return company
//}
