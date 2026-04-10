import { FlatCompat } from '@eslint/eslintrc'
import base from './base.js'

const compat = new FlatCompat()

export default [
  ...base,
  ...compat.extends('next/core-web-vitals'),
]
