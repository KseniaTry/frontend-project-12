import { useTranslation } from "react-i18next"

const Error = ({error, errorStatus}) => {
  const {t} = useTranslation()

  const errorMessage = typeof error === 'object' ? (error.message || error.error) : error;

  return(
    <div className="text-danger small mt-2">
      {errorStatus === 401 ? t('errors.401') : t('errors.server', {error: errorMessage})}
    </div>
  )
}

export default Error