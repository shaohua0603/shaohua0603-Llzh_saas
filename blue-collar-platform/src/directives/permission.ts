import type { Directive, DirectiveBinding } from 'vue'
import { PermissionUtil } from '@/utils/permissionUtil'

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const permissions = value as string[]

      const hasPermission = checkPermission(permissions)

      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('需要权限！如 v-permission="[system:position:view]"')
    }
  }
}

function checkPermission(permissions: string[]): boolean {
  return permissions.some(permission => {
    return PermissionUtil.hasButtonPermission(permission)
  })
}

export default permission
