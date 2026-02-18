import dayjsLib from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/pt-br'

dayjsLib.extend(localizedFormat)
dayjsLib.extend(utc)
dayjsLib.extend(timezone)

dayjsLib.locale('pt-br')

dayjsLib.tz.setDefault('America/Sao_Paulo')

export const dayjs = dayjsLib
