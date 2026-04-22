export type ConditionOperator = '==' | '!=' | '>' | '<' | '>=' | '<='

export type ConditionValueType = 'text' | 'number' | 'boolean'

export type ParsedEdgeCondition = {
  key: string
  operator: ConditionOperator
  value: string
  valueType: ConditionValueType
}

export const CONDITION_OPERATORS: ConditionOperator[] = ['==', '!=', '>', '<', '>=', '<=']

const stripQuotes = (value: string): string => value.replace(/^['"]|['"]$/g, '')

export const inferConditionValueType = (value: string): ConditionValueType => {
  const trimmed = value.trim()
  const unquoted = stripQuotes(trimmed)

  if (unquoted === 'true' || unquoted === 'false') {
    return 'boolean'
  }

  if (!Number.isNaN(Number(unquoted)) && unquoted !== '') {
    return 'number'
  }

  return 'text'
}

export const parseEdgeConditionExpression = (
  input: string,
): ParsedEdgeCondition | null => {
  const match = input.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(==|!=|>=|<=|>|<)\s*(.+)$/)
  if (!match) {
    return null
  }

  const value = match[3].trim()
  const valueType = inferConditionValueType(value)

  return {
    key: match[1],
    operator: match[2] as ConditionOperator,
    value: stripQuotes(value),
    valueType,
  }
}

export const stringifyEdgeCondition = (parsed: ParsedEdgeCondition): string => {
  const key = parsed.key.trim()
  const rawValue = parsed.value.trim()
  if (!key || !rawValue) {
    return ''
  }

  if (parsed.valueType === 'boolean') {
    return `${key} ${parsed.operator} ${rawValue === 'true' ? 'true' : 'false'}`
  }

  if (parsed.valueType === 'number') {
    return `${key} ${parsed.operator} ${rawValue}`
  }

  return `${key} ${parsed.operator} "${rawValue}"`
}
