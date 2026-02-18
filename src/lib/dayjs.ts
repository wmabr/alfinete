import dayjsLib from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjsLib.extend(localizedFormat)

export const dayjs = dayjsLib
