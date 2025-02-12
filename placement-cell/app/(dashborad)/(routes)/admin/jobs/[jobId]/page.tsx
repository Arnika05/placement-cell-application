const JobDetailsPage = ({ params }: { params: { jobId: string } }) => {
    return <div>Job Details: {params.jobId}</div>;
};

export default JobDetailsPage;
