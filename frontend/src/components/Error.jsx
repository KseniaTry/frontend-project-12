const Error = (error) => {
  return(
    <div className="text-danger small mt-2">{error.error}</div>
  )
}

export default Error