import { Job, Company } from './db.js'

// @NOTE: This should match the schema def.
export const resolvers = {
  Query: {
    jobs: () => Job.findAll(),
    job: (_root, { id }) => Job.findById(id),
    company: (_root, { id }) => Company.findById(id)
  },
  Job: {
    company: (job) => Company.findById(job.companyId)
  },
  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId == company.id)
  },
  Mutation: {
    createJob: (_root, {input}) => {
      return Job.create(input)
    },
    deleteJob: (_root, {id}) => {
      return Job.delete(id)
    },
    updateJob: (_root, {input}) => {
      return Job.update(input)
    },
  }
}
