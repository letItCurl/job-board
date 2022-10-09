import JobList from './JobList';
import { useJobs } from '../graphql/hooks.js'

function JobBoard() {

  const { jobs, loading, error } = useJobs()

  if (loading) return <p>LOADING...</p>
  if (error) return <p>ERROR...</p>

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;

// @NOTE: we can build our own effet
//const { data, loading, error } = useQuery(JOBS_QUERY, { fetchPolicy: 'network-only' })
//const { jobs } = data

// @NOTE: full react example, not required because we are using `useQuery`
// const [jobs, setJobs] = useState([]);
// useEffect(() => {
//   //getJobs().then((jobs) => setJobs(jobs))
//   getJobs().then(setJobs)
// }, []) // @NOTE: change if dependency changes
