import { useTranslation } from "react-i18next"

const NotFound = () => {
  const {t} = useTranslation()

  return(
    <div>{t('errors.404')}</div>
  )
}

export default NotFound