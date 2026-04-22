import type { AutomatedAction, AutomatedNodeData } from '../types/workflow'

export const applyAutomatedActionSelection = (
  data: AutomatedNodeData,
  action: AutomatedAction | undefined,
): AutomatedNodeData => {
  if (!action) {
    return {
      ...data,
      actionId: '',
      actionParams: {},
    }
  }

  const nextParams = Object.fromEntries(
    action.params.map((param) => [param, data.actionParams[param] ?? '']),
  )

  return {
    ...data,
    actionId: action.id,
    actionParams: nextParams,
  }
}

export const applyAutomatedActionParam = (
  data: AutomatedNodeData,
  paramName: string,
  value: string,
): AutomatedNodeData => {
  return {
    ...data,
    actionParams: {
      ...data.actionParams,
      [paramName]: value,
    },
  }
}
