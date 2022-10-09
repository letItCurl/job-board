import { Job, Company } from './db.js'

// @NOTE: This should match the schema def.
function rejectIf(condition) {
  if (condition) {
    throw new Error('NOOP')
  };
}

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
    createJob: (_root, {input}, {user}) => {
      rejectIf(!user)

      return Job.create({...input, companyId: user.companyId})
    },
    deleteJob: async (_root, {id}, {user}) => {
      rejectIf(!user)

      const job = await Job.findById(id)
      rejectIf(user.companyId != job.companyId)

      return Job.delete(id)
    },
    updateJob: async (_root, {input}, {user}) => {
      rejectIf(!user)

      const job = await Job.findById(input.id)
      rejectIf(user.companyId != job.companyId)

      return Job.update({...input, companyId: job.companyId})
    },
  }
}
