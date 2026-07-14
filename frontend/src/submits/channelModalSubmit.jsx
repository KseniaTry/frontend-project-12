
import { toast } from "react-toastify";
import filter from 'leo-profanity';
import { addChannel, setActiveChannelId, editChannel } from "../slices/channelsSlice";

const handleChannelModalSubmit = async (values, actions, context, type) => {    
  const {activeChannelId, onHide, dispatch, rollbar, t} = context
  const {setSubmitting, resetForm} = actions
  
  const newChannel = {
    name: filter.clean(values.channelName)
  }

  const handleAddChannel = async (newChannel) => {
    try {
      const response = await dispatch(addChannel(newChannel)).unwrap()
      localStorage.setItem('activeChannel', response.id);
      dispatch(setActiveChannelId(response.id))
      toast.success(t('notifications.success.channelAdd'));
      return true // нужно для закрытия модалки и для сброса формы только в случае успешной обработки запроса
    } catch(err) {
      toast.error(t('errors.channelAdd'))
      rollbar.error(t('errors.channelAdd'), err);
      return false 
    }
  };

  const handleRenameChannel = async (activeChannelId, newChannel) => {
    try {
      await dispatch(editChannel({ channelId: activeChannelId, editedChannel: newChannel })).unwrap()
      toast.success(t('notifications.success.channelRename'));
      return true
    } catch(err) {
      toast.error(t('errors.channelRename'))
      rollbar.error(t('errors.channelRename'), err);
      return false 
    }
  };

  let isSuccess = false

  switch (type) {
    case 'add':
      isSuccess = await handleAddChannel(newChannel)
      break
    case 'rename':
      isSuccess = await handleRenameChannel(activeChannelId, newChannel)
      break
    default: 
      console.log('type not exist')
      break
  }
  
  if (isSuccess) {
    resetForm()
    onHide()
  }

  setSubmitting(false);
}

export {handleChannelModalSubmit}