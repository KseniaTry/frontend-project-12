const BASE_URL = '/api/v1';

const getLoginRoute = () => `${BASE_URL}/login`
const getChannelsRoute = () => `${BASE_URL}/channels`
const getChannelsRouteById = (id) => `${BASE_URL}/channels/${id}`
const getMessagesRoute = () => `${BASE_URL}/messages`
const getMessagesRouteById = (id) => `${BASE_URL}/messages/${id}`
const getSignUpRoute = () => `${BASE_URL}/signup`   
  
export {getLoginRoute, getChannelsRoute, getChannelsRouteById, getMessagesRoute, getMessagesRouteById, getSignUpRoute}