import { useTranslation } from "react-i18next"

const NotFound = () => {
  const {t} = useTranslation()

  return(
    <div>{t('errors.notFound')}</div>
  )
}

export default NotFound