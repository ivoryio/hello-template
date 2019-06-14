import { ServiceProps } from '../constructs/interfaces'

export interface WebCICDStackProps extends ServiceProps{
  buildSpec?: any
}