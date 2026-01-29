import { Mask } from 'maska'

export function mask(val, mascara) {
  const mask = new Mask({ mask: mascara })
  return mask.masked(val)
}

export function unmaskOld(val, mascara) {
  const mask = new Mask({ mask: mascara })
  return mask.unmasked(val)
}
export function unmask(value) {
  const stringValue = String(value || '')
  return stringValue.replace(/\D/g, '')
}
