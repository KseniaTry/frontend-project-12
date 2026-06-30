import { useTranslation } from "react-i18next"

const Error = (error) => {
  const {t} = useTranslation

  return(
    <div className="text-danger small mt-2">{t('errors.server', {error: error.error})}</div>
  )
}

export default Error