import { Job, Company } from './db.js'

// @NOTE: This should match the schema def.
export const resolvers = {
  Query: {
    jobs: () => Job.findAll()
  },
  Job: {
    company: (job) => Company.findById(job.companyId)
  }
}
