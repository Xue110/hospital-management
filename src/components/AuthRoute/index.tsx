import { getToken } from '../..//utils'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children }:any) => {
  const isToken = getToken()
  if (isToken) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace />
  }
}

export default AuthRoute