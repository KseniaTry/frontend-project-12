import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

function ErrorAlert(error) {
  const [show, setShow] = useState(true);
  const {t} = useTranslation

  return (
    <>
      <Alert show={show} variant="danger">
        <Alert.Heading>{t('errors.title')}</Alert.Heading>
        <p>
          {t('errors,server', {error})}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            {t('close')}
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default ErrorAlert