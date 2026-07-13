import * as yup from 'yup';

const getRegistrationSchema = (t) => {
  return yup.object().shape({
    username: yup.string()
      .min(3, t('validation.length'))
      .max(20, t('validation.length'))
      .required(t('validation.required')),
    password: yup.string()
      .min(6, t('validation.passwordLength'))
      .required(t('validation.required')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], t('validation.passwordConfirm'))
      .required(t('validation.required'))
  })
}

const getChannelsSchema = (t, channels) => {
  return yup.object().shape({
    channelName: yup.string()
      .min(3, t('validation.length'))
      .max(20, t('validation.length'))
      .test(
        '',
        t('validation.unique'),
        (value) => {
          return channels.every((channel) => channel.name !== value)
        }
      )
  })
}

export { getRegistrationSchema , getChannelsSchema}